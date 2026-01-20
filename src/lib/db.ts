import { existsSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const DB_PATH = join(process.cwd(), 'admin-data.json');

/**
 * Type definitions for database schema
 */
interface Admin {
  id: string;
  email: string;
  password: string;
  name: string;
  role: string;
  two_factor_enabled: number;
  two_factor_method?: string;
  two_factor_secret?: string;
  last_login?: string;
  active: number;
  created_at: string;
  updated_at: string;
}

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  addresses: Record<string, unknown>[];
  total_spent: number;
  total_orders: number;
  last_order_date?: string;
  created_at: string;
}

interface Order {
  id: string;
  order_id: string;
  customer_id: string;
  items: Record<string, unknown>[];
  status: string;
  payment_status: string;
  payment_intent_id?: string;
  delivery_method: string;
  delivery_address?: Record<string, unknown>;
  delivery_fee: number;
  subtotal: number;
  total: number;
  notes?: string;
  created_at: string;
  updated_at: string;
  expected_delivery_date?: string;
  actual_delivery_date?: string;
  assigned_to?: string;
}

interface TwoFactorSession {
  id: string;
  admin_id: string;
  method: string;
  code: string;
  created_at: string;
  expires_at: string;
  verified: number;
}

interface DatabaseSchema {
  admins: Admin[];
  customers: Customer[];
  orders: Order[];
  twoFactorSessions: TwoFactorSession[];
}

/**
 * In-memory database cache
 */
let db: DatabaseSchema | null = null;

/**
 * Get database instance
 */
export function getDatabase(): DatabaseSchema {
  if (db) return db;

  if (existsSync(DB_PATH)) {
    const data = readFileSync(DB_PATH, 'utf-8');
    db = JSON.parse(data);
  } else {
    db = initializeSchema();
    saveDatabase();
  }

  return db!;
}

/**
 * Save database to file
 */
function saveDatabase() {
  if (!db) return;
  writeFileSync(DB_PATH, JSON.stringify(db, null, 2), 'utf-8');
}

/**
 * Initialize database schema with sample data
 */
function initializeSchema(): DatabaseSchema {
  const now = new Date().toISOString();

  return {
    admins: [
      {
        id: 'admin-1',
        email: 'admin@yumbymaryam.com',
        password: '$2a$10$wbFe5N73.JxNoZtt5U0BHu5cNHl/dEiKMIhGNUI6zIJhchHb0rphi', // admin123
        name: 'Admin User',
        role: 'super_admin',
        two_factor_enabled: 0,
        last_login: undefined,
        active: 1,
        created_at: now,
        updated_at: now,
      },
    ],
    customers: [
      {
        id: 'cust-1',
        name: 'John Doe',
        email: 'john@example.com',
        phone: '0412345678',
        addresses: [
          {
            id: 'addr-1',
            street: '123 Main St',
            city: 'Sydney',
            postcode: '2000',
            state: 'NSW',
            isDefault: true,
          },
        ],
        total_spent: 12500,
        total_orders: 2,
        last_order_date: now,
        created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ],
    orders: [
      {
        id: 'order-1',
        order_id: '#ORD-001',
        customer_id: 'cust-1',
        items: [
          {
            productId: 'tres-leches',
            productName: 'Tres Leches Cake',
            size: 'Medium',
            addons: ['Extra Cream'],
            quantity: 1,
            unitPrice: 4500,
            totalPrice: 4500,
          },
        ],
        status: 'delivered',
        payment_status: 'captured',
        payment_intent_id: 'pi_test_001',
        delivery_method: 'delivery',
        delivery_fee: 900,
        subtotal: 4500,
        total: 5400,
        created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        assigned_to: 'admin-1',
      },
      {
        id: 'order-2',
        order_id: '#ORD-002',
        customer_id: 'cust-1',
        items: [
          {
            productId: 'choco-cake',
            productName: 'Chocolate Cake',
            size: 'Large',
            addons: [],
            quantity: 1,
            unitPrice: 6500,
            totalPrice: 6500,
          },
        ],
        status: 'confirmed',
        payment_status: 'authorized',
        payment_intent_id: 'pi_test_002',
        delivery_method: 'pickup',
        delivery_fee: 0,
        subtotal: 6500,
        total: 6500,
        created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        assigned_to: 'admin-1',
      },
    ],
    twoFactorSessions: [],
  };
}

/**
 * Admin data access methods
 */
export const adminDb = {
  getByEmail(email: string) {
    const db = getDatabase();
    return db.admins.find((a) => a.email === email) || null;
  },

  getById(id: string) {
    const db = getDatabase();
    return db.admins.find((a) => a.id === id) || null;
  },

  create(data: { email: string; password: string; name: string; role?: string }) {
    const db = getDatabase();
    const id = `admin-${Date.now()}`;
    const now = new Date().toISOString();

    const admin: Admin = {
      id,
      email: data.email,
      password: data.password,
      name: data.name,
      role: data.role || 'admin',
      two_factor_enabled: 0,
      active: 1,
      created_at: now,
      updated_at: now,
    };

    db.admins.push(admin);
    saveDatabase();
    return admin;
  },

  update(id: string, data: Partial<Omit<Admin, 'id' | 'created_at'>>) {
    const db = getDatabase();
    const index = db.admins.findIndex((a) => a.id === id);

    if (index === -1) return;

    db.admins[index] = {
      ...db.admins[index],
      ...data,
      updated_at: new Date().toISOString(),
    };

    saveDatabase();
  },

  getAll() {
    const db = getDatabase();
    return db.admins;
  },
};

/**
 * Customer data access methods
 */
export const customerDb = {
  getById(id: string) {
    const db = getDatabase();
    return db.customers.find((c) => c.id === id) || null;
  },

  getByEmail(email: string) {
    const db = getDatabase();
    return db.customers.find((c) => c.email === email) || null;
  },

  create(data: { name: string; email: string; phone?: string; addresses?: Record<string, unknown>[] }) {
    const db = getDatabase();
    const id = `cust-${Date.now()}`;
    const now = new Date().toISOString();

    const customer: Customer = {
      id,
      name: data.name,
      email: data.email,
      phone: data.phone || '',
      addresses: data.addresses || [],
      total_spent: 0,
      total_orders: 0,
      created_at: now,
    };

    db.customers.push(customer);
    saveDatabase();
    return customer;
  },

  update(id: string, data: Partial<Omit<Customer, 'id' | 'created_at'>>) {
    const db = getDatabase();
    const index = db.customers.findIndex((c) => c.id === id);

    if (index === -1) return;

    db.customers[index] = {
      ...db.customers[index],
      ...data,
    };

    saveDatabase();
  },

  getAll() {
    const db = getDatabase();
    return db.customers;
  },
};

/**
 * Order data access methods
 */
export const orderDb = {
  getById(id: string) {
    const db = getDatabase();
    return db.orders.find((o) => o.id === id) || null;
  },

  create(data: {
    order_id: string;
    customer_id: string;
    items: Record<string, unknown>[];
    status?: string;
    payment_status?: string;
    payment_intent_id?: string;
    delivery_method: string;
    delivery_address?: Record<string, unknown>;
    delivery_fee: number;
    subtotal: number;
    total: number;
    notes?: string;
    assigned_to?: string;
  }) {
    const db = getDatabase();
    const id = `order-${Date.now()}`;
    const now = new Date().toISOString();

    const order: Order = {
      id,
      order_id: data.order_id,
      customer_id: data.customer_id,
      items: data.items,
      status: data.status || 'pending',
      payment_status: data.payment_status || 'authorized',
      payment_intent_id: data.payment_intent_id,
      delivery_method: data.delivery_method,
      delivery_address: data.delivery_address,
      delivery_fee: data.delivery_fee,
      subtotal: data.subtotal,
      total: data.total,
      notes: data.notes,
      created_at: now,
      updated_at: now,
      assigned_to: data.assigned_to,
    };

    db.orders.push(order);
    saveDatabase();
    return order;
  },

  update(id: string, data: Partial<Omit<Order, 'id' | 'created_at'>>) {
    const db = getDatabase();
    const index = db.orders.findIndex((o) => o.id === id);

    if (index === -1) return;

    db.orders[index] = {
      ...db.orders[index],
      ...data,
      updated_at: new Date().toISOString(),
    };

    saveDatabase();
  },

  getAll(filters?: { status?: string; payment_status?: string }) {
    const db = getDatabase();
    let orders = db.orders;

    if (filters?.status) {
      orders = orders.filter((o) => o.status === filters.status);
    }

    if (filters?.payment_status) {
      orders = orders.filter((o) => o.payment_status === filters.payment_status);
    }

    return orders.sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  },

  getByCustomerId(customerId: string) {
    const db = getDatabase();
    return db.orders
      .filter((o) => o.customer_id === customerId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  },
};

/**
 * Two-factor authentication sessions
 */
export const twoFactorDb = {
  create(adminId: string, method: string, code: string) {
    const db = getDatabase();
    const id = `2fa-${Date.now()}`;
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 10 * 60 * 1000); // 10 minutes

    const session: TwoFactorSession = {
      id,
      admin_id: adminId,
      method,
      code,
      created_at: now.toISOString(),
      expires_at: expiresAt.toISOString(),
      verified: 0,
    };

    db.twoFactorSessions.push(session);
    saveDatabase();
    return session;
  },

  verify(id: string) {
    const db = getDatabase();
    const session = db.twoFactorSessions.find((s) => s.id === id);

    if (!session) return null;

    // Check if expired
    if (new Date(session.expires_at) < new Date()) {
      // Remove expired session
      db.twoFactorSessions = db.twoFactorSessions.filter((s) => s.id !== id);
      saveDatabase();
      return null;
    }

    // Mark as verified
    session.verified = 1;
    saveDatabase();

    return session;
  },

  getByAdminId(adminId: string) {
    const db = getDatabase();
    const now = new Date();

    return (
      db.twoFactorSessions.find(
        (s) =>
          s.admin_id === adminId &&
          s.verified === 0 &&
          new Date(s.expires_at) > now
      ) || null
    );
  },
};

/**
 * Analytics data access
 */
export const analyticsDb = {
  getStats() {
    const db = getDatabase();

    // Total orders
    const totalOrders = db.orders.length;

    // Total revenue (captured payments only)
    const totalRevenue = db.orders
      .filter((o) => o.payment_status === 'captured')
      .reduce((sum, o) => sum + o.total, 0);

    // Orders this month
    const thisMonth = new Date();
    thisMonth.setDate(1);
    thisMonth.setHours(0, 0, 0, 0);

    const ordersThisMonth = db.orders.filter(
      (o) => new Date(o.created_at) >= thisMonth
    ).length;

    // Revenue this month
    const revenueThisMonth = db.orders
      .filter(
        (o) =>
          o.payment_status === 'captured' && new Date(o.created_at) >= thisMonth
      )
      .reduce((sum, o) => sum + o.total, 0);

    // Average order value
    const avgOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;

    // Status breakdown
    const statusCounts: Record<string, number> = {};
    db.orders.forEach((order) => {
      statusCounts[order.status] = (statusCounts[order.status] || 0) + 1;
    });

    return {
      totalOrders,
      totalRevenue,
      ordersThisMonth,
      revenueThisMonth,
      averageOrderValue: avgOrderValue,
      pendingOrders: statusCounts['pending'] || 0,
      deliveredOrders: statusCounts['delivered'] || 0,
      cancelledOrders: statusCounts['cancelled'] || 0,
      statusBreakdown: statusCounts,
    };
  },
};

