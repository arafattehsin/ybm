import * as XLSX from 'xlsx';
import * as path from 'path';

const excelPath = path.join(__dirname, '..', 'old-data', 'orders-2026-01-20-17-49-02.xlsx');
const workbook = XLSX.readFile(excelPath);
const worksheet = workbook.Sheets[workbook.SheetNames[0]];
const data = XLSX.utils.sheet_to_json(worksheet);

console.log(`\n📦 Found ${data.length} rows in new file\n`);

// Group by order number and status
const ordersByStatus: Record<string, number> = {};
const ordersMap = new Map<string, string>();

data.forEach((row: any) => {
  const orderNum = row['Order Number'];
  const status = row['Order Status'];
  
  if (!ordersMap.has(orderNum)) {
    ordersMap.set(orderNum, status);
  }
  
  ordersByStatus[status] = (ordersByStatus[status] || 0) + 1;
});

console.log('Status breakdown (by rows):');
Object.entries(ordersByStatus).forEach(([status, count]) => {
  console.log(`  ${status}: ${count}`);
});

console.log(`\nUnique orders: ${ordersMap.size}\n`);

console.log('Sample orders:');
Array.from(ordersMap.entries()).slice(0, 15).forEach(([num, status]) => {
  console.log(`  #${num} - ${status}`);
});

console.log('\nCancelled/Failed orders:');
Array.from(ordersMap.entries())
  .filter(([_, status]) => status === 'Cancelled' || status === 'Failed')
  .forEach(([num, status]) => {
    console.log(`  #${num} - ${status}`);
  });
