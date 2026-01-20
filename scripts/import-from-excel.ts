/**
 * Import WooCommerce orders from Excel export to Cosmos DB
 * Transforms Excel data to YBM Cosmos DB schema
 */

import * as dotenv from 'dotenv';
import * as path from 'path';
import * as XLSX from 'xlsx';
import { CosmosClient } from '@azure/cosmos';
import crypto from 'crypto';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

// Cosmos DB configuration
const cosmosEndpoint = process.env.COSMOS_DB_ENDPOINT!;
const cosmosKey = process.env.COSMOS_DB_KEY!;
const databaseId = process.env.COSMOS_DB_DATABASE_NAME || 'ybm-production';

function generateId(): string {
  return crypto.randomUUID();
}

function excelDateToJSDate(serial: any): Date {
  // Excel stores dates as days since January 1, 1900
  // The integer part is the date, the decimal part is the time
  if (typeof serial === 'number') {
    // Excel date serial number
    // Excel epoch is 1/1/1900, but there's a bug where it thinks 1900 is a leap year
    // JavaScript Date epoch is 1/1/1970
    // Days between 1/1/1900 and 1/1/1970 = 25569
    const utc_days = Math.floor(serial - 25569);
    const utc_value = utc_days * 86400; // Convert days to seconds
    
    // Extract the time portion (decimal part)
    const time_fraction = serial - Math.floor(serial);
    const time_seconds = Math.round(time_fraction * 86400); // Convert fraction to seconds
    
    const date_info = new Date((utc_value + time_seconds) * 1000);
    return date_info;
  } else if (typeof serial === 'string') {
    // Try parsing as ISO date string
    const parsed = new Date(serial);
    if (!isNaN(parsed.getTime())) {
      return parsed;
    }
  }
  // Fallback to current date
  return new Date();
}

async function importFromExcel() {
  console.log('📦 Excel to Cosmos DB Import\n');

  const excelPath = path.join(__dirname, '..', 'old-data', 'orders-2026-01-20-17-49-02.xlsx');
  
  try {
    // Read Excel file
    console.log('📥 Reading Excel file...');
    const workbook = XLSX.readFile(excelPath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet);
    
    console.log(`   Found ${data.length} rows\n`);
    console.log('📋 Sample row (first order):');
    console.log(JSON.stringify(data[0], null, 2));
    console.log('\n');

    // Connect to Cosmos DB
    console.log('🔌 Connecting to Cosmos DB...');
    const cosmosClient = new CosmosClient({ endpoint: cosmosEndpoint, key: cosmosKey });
    const database = cosmosClient.database(databaseId);
    const ordersContainer = database.container('orders');
    const customersContainer = database.container('customers');
    console.log('✅ Connected to Cosmos DB\n');

    const customersMap = new Map<string, any>();
    let ordersImported = 0;
    let customersImported = 0;

    // Group rows by Order Number (Excel has one row per item)
    const ordersMap = new Map<string, any[]>();
    for (const row of data) {
      const orderNumber = row['Order Number'] || row['Order ID'] || '';
      if (!ordersMap.has(orderNumber)) {
        ordersMap.set(orderNumber, []);
      }
      ordersMap.get(orderNumber)!.push(row);
    }

    console.log(`📋 Found ${ordersMap.size} unique orders\n`);

    // Process each order (with all its items)
    for (const [orderNumber, rows] of ordersMap.entries()) {
      const row = rows[0]; // Use first row for order-level data
      console.log(`📦 Processing Order #${orderNumber}...`);

      // Extract customer information
      const billingEmail = (row['Email (Billing)'] || row['Billing Email'] || row['Email'] || '').toString().toLowerCase().trim();
      const firstName = row['First Name (Billing)'] || '';
      const lastName = row['Last Name (Billing)'] || '';
      const billingName = `${firstName} ${lastName}`.trim() || row['Billing Name'] || row['Customer Name'] || 'Guest Customer';
      const billingPhone = row['Phone (Billing)'] || row['Billing Phone'] || row['Phone'] || '';
      
      // Create or get customer
      let customerId: string;
      if (billingEmail && customersMap.has(billingEmail)) {
        customerId = customersMap.get(billingEmail)!.id;
      } else {
        customerId = generateId();
        const customer = {
          id: customerId,
          name: billingName,
          email: billingEmail || `guest-${customerId}@yumbymaryam.com`,
          phone: billingPhone,
          addresses: [
            {
              type: 'billing',
              line1: row['Address 1&2 (Billing)'] || row['Billing Address 1'] || '',
              line2: '',
              city: row['City (Billing)'] || row['Billing City'] || '',
              state: row['State Code (Billing)'] || row['Billing State'] || '',
              postcode: row['Postcode (Billing)'] || row['Billing Postcode'] || row['Billing Postal Code'] || '',
              country: row['Country Code (Billing)'] || row['Billing Country'] || 'AU',
            },
            {
              type: 'shipping',
              line1: row['Address 1&2 (Shipping)'] || row['Address 1&2 (Billing)'] || row['Shipping Address 1'] || row['Billing Address 1'] || '',
              line2: '',
              city: row['City (Shipping)'] || row['City (Billing)'] || row['Shipping City'] || row['Billing City'] || '',
              state: row['State Code (Shipping)'] || row['State Code (Billing)'] || row['Shipping State'] || row['Billing State'] || '',
              postcode: row['Postcode (Shipping)'] || row['Postcode (Billing)'] || row['Shipping Postcode'] || row['Shipping Postal Code'] || row['Billing Postcode'] || '',
              country: row['Country Code (Shipping)'] || row['Country Code (Billing)'] || row['Shipping Country'] || row['Billing Country'] || 'AU',
            },
          ],
          total_spent: 0,
          total_orders: 0,
          created_at: excelDateToJSDate(row['Order Date'] || row['Date Created']).toISOString(),
        };

        if (billingEmail) {
          customersMap.set(billingEmail, customer);
        }
      }

      // Parse all items for this order (each row is one item)
      const items = [];
      let subtotal = 0;
      
      for (const itemRow of rows) {
        const itemName = itemRow['Item Name'] || '';
        const itemQuantity = parseFloat(itemRow['Quantity (- Refund)'] || itemRow['Quantity'] || '1');
        const itemCost = parseFloat(itemRow['Item Cost'] || '0') * 100; // Convert to cents
        
        if (itemName) {
          const itemTotal = Math.round(itemCost * itemQuantity);
          items.push({
            product_id: crypto.randomUUID(),
            name: itemName,
            size: 'Regular',
            addons: [],
            quantity: itemQuantity,
            unit_price: Math.round(itemCost),
            total_price: itemTotal,
          });
          
          subtotal += itemTotal;
        }
      }

      // Parse amounts from first row (order-level data)
      const orderTotal = Math.round(parseFloat(String(row['Order Total Amount'] || row['Order Total'] || row['Total'] || '0').replace(/[$,]/g, '')) * 100);
      const shippingTotal = Math.round(parseFloat(String(row['Order Shipping Amount'] || row['Shipping Total'] || row['Shipping'] || '0').replace(/[$,]/g, '')) * 100);
      
      // Recalculate subtotal to match order total if items don't add up
      if (subtotal > 0 && Math.abs(subtotal + shippingTotal - orderTotal) > 100) {
        // Adjust subtotal to match order total minus shipping
        subtotal = orderTotal - shippingTotal;
      }
      
      // Determine delivery method
      const shippingMethod = String(row['Shipping Method Title'] || row['Shipping Method'] || '').toLowerCase();
      const deliveryMethod = shippingTotal > 0 || shippingMethod.includes('delivery') || shippingMethod.includes('flat') ? 'delivery' : 'pickup';
      const deliveryPostcode = row['Postcode (Shipping)'] || row['Postcode (Billing)'] || row['Shipping Postcode'] || row['Shipping Postal Code'] || row['Billing Postcode'] || '';

      // Map WooCommerce status to YBM status
      const orderStatus = (row['Order Status'] || 'pending').toLowerCase();
      const statusMap: Record<string, string> = {
        'pending': 'pending',
        'processing': 'confirmed',
        'on-hold': 'pending',
        'completed': 'delivered',
        'cancelled': 'cancelled',
        'refunded': 'cancelled',
        'failed': 'cancelled',
      };

      const paymentStatusMap: Record<string, string> = {
        'pending': 'pending',
        'processing': 'captured',
        'on-hold': 'authorized',
        'completed': 'captured',
        'cancelled': 'refunded',
        'refunded': 'refunded',
        'failed': 'failed',
      };

      // Create Cosmos DB order
      const cosmosOrder = {
        id: generateId(),
        order_id: `YBM-${orderNumber}`,
        customer_id: customerId,
        items: items.length > 0 ? items : [{
          product_id: generateId(),
          name: 'Custom Order',
          size: 'Regular',
          addons: [],
          quantity: 1,
          unit_price: orderTotal - shippingTotal,
          total_price: orderTotal - shippingTotal,
        }],
        status: statusMap[orderStatus] || 'pending',
        payment_status: paymentStatusMap[orderStatus] || 'pending',
        payment_intent_id: row['Transaction ID'] || '',
        payment_method: row['Payment Method Title'] || row['Payment Method'] || 'Card Payment',
        delivery_method: deliveryMethod,
        delivery_address: deliveryMethod === 'delivery' ? {
          line1: row['Address 1&2 (Shipping)'] || row['Address 1&2 (Billing)'] || row['Shipping Address 1'] || row['Billing Address 1'] || '',
          line2: '',
          city: row['City (Shipping)'] || row['City (Billing)'] || row['Shipping City'] || row['Billing City'] || '',
          state: row['State Code (Shipping)'] || row['State Code (Billing)'] || row['Shipping State'] || row['Billing State'] || '',
          postcode: deliveryPostcode,
          country: row['Country Code (Shipping)'] || row['Country Code (Billing)'] || row['Shipping Country'] || row['Billing Country'] || 'AU',
        } : undefined,
        delivery_fee: shippingTotal,
        subtotal: orderTotal - shippingTotal,
        total: orderTotal,
        notes: row['Customer Note'] || row['Order Notes'] || '',
        created_at: excelDateToJSDate(row['Order Date'] || row['Date Created']).toISOString(),
        updated_at: excelDateToJSDate(row['Order Date'] || row['Date Created']).toISOString(),
        expected_delivery_date: row['Expected Delivery Date'] || '',
      };

      // Save to Cosmos DB
      await ordersContainer.items.create(cosmosOrder);
      ordersImported++;
      console.log(`   ✅ Imported order ${cosmosOrder.order_id} - Total: $${(orderTotal / 100).toFixed(2)}`);

      // Update customer stats
      if (billingEmail && customersMap.has(billingEmail)) {
        const customer = customersMap.get(billingEmail)!;
        customer.total_spent += cosmosOrder.total;
        customer.total_orders += 1;
        customer.last_order_date = cosmosOrder.created_at;
      }
    }

    // Import customers
    console.log(`\n👥 Importing ${customersMap.size} customers...`);
    for (const customer of customersMap.values()) {
      await customersContainer.items.create(customer);
      customersImported++;
    }

    console.log('\n✅ Import completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   Orders imported: ${ordersImported}`);
    console.log(`   Customers imported: ${customersImported}`);
    console.log('\n🎉 Excel data successfully migrated to Cosmos DB!');

  } catch (error: any) {
    console.error('\n❌ Import failed:', error.message);
    console.error('Full error:', error);
    process.exit(1);
  }
}

importFromExcel();
