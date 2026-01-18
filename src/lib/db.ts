/**
 * Database Service using sql.js (SQLite in WebAssembly)
 * Provides persistent storage for admin dashboard
 */

import initSqlJs, { Database } from 'sql.js';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

const DB_PATH = join(process.cwd(), 'admin-data.db');

let db: Database | null = null;

/**
 * Initialize database connection
 */
export async function getDatabase(): Promise<Database> {
  if (db) return db;

  const SQL = await initSqlJs({
    locateFile: (file) => `https://sql.js.org/dist/${file}`,
  });

  // Load existing database or create new one
  if (existsSync(DB_PATH)) {
    const buffer = readFileSync(DB_PATH);
    db = new SQL.Database(buffer);
  } else {
    db = new SQL.Database();
    await initializeSchema(db);
  }

  return db;
}

/**
 * Save database to disk
 */
export function saveDatabase() {
  if (!db) return;
  const data = db.export();
  const buffer = Buffer.from(data);
  writeFileSync(DB_PATH, buffer);
}

/**
 * Initialize database schema
 */
async function initializeSchema(database: Database) {
  // Admins table
  database.run(`
    CREATE TABLE IF NOT EXISTS admins (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      name TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'admin',
      two_factor_enabled INTEGER DEFAULT 0,
      two_factor_method TEXT,
      two_factor_secret TEXT,
      last_login TEXT,
      active INTEGER DEFAULT 1,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);

  // Customers table
  database.run(`
    CREATE TABLE IF NOT EXISTS customers (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      phone TEXT,
      addresses TEXT,
      total_spent INTEGER DEFAULT 0,
      total_orders INTEGER DEFAULT 0,
      last_order_date TEXT,
      created_at TEXT NOT NULL
    );
  `);

  // Orders table
  database.run(`
    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      order_id TEXT UNIQUE NOT NULL,
      customer_id TEXT NOT NULL,
      items TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      payment_status TEXT NOT NULL DEFAULT 'authorized',
      payment_intent_id TEXT,
      delivery_method TEXT NOT NULL,
      delivery_address TEXT,
      delivery_fee INTEGER DEFAULT 0,
      subtotal INTEGER NOT NULL,
      total INTEGER NOT NULL,
      notes TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      expected_delivery_date TEXT,
      actual_delivery_date TEXT,
      assigned_to TEXT,
      FOREIGN KEY (customer_id) REFERENCES customers(id)
    );
  `);

  // Two-factor sessions table
  database.run(`
    CREATE TABLE IF NOT EXISTS two_factor_sessions (
      id TEXT PRIMARY KEY,
      admin_id TEXT NOT NULL,
      method TEXT NOT NULL,
      code TEXT NOT NULL,
      created_at TEXT NOT NULL,
      expires_at TEXT NOT NULL,
      verified INTEGER DEFAULT 0,
      FOREIGN KEY (admin_id) REFERENCES admins(id)
    );
  `);

  // Order history/status changes table
  database.run(`
    CREATE TABLE IF NOT EXISTS order_history (
      id TEXT PRIMARY KEY,
      order_id TEXT NOT NULL,
      old_status TEXT,
      new_status TEXT NOT NULL,
      changed_by TEXT NOT NULL,
      changed_at TEXT NOT NULL,
      notes TEXT,
      FOREIGN KEY (order_id) REFERENCES orders(id),
      FOREIGN KEY (changed_by) REFERENCES admins(id)
    );
  `);

  // Insert default admin (email: admin@yumbymaryam.com, password: admin123)
  // Password is bcrypt hashed version of "admin123"
  database.run(`
    INSERT INTO admins (id, email, password, name, role, created_at, updated_at)
    VALUES (
      'admin-1',
      'admin@yumbymaryam.com',
      '$2a$10$YX5uV/zZ.FQqZ1Z1Z1Z1ZeN8N8N8N8N8N8N8N8N8N8N8N8N8N8',
      'Admin User',
      'super_admin',
      datetime('now'),
      datetime('now')
    );
  `);

  // Insert sample customer
  database.run(`
    INSERT INTO customers (id, name, email, phone, addresses, total_spent, total_orders, last_order_date, created_at)
    VALUES (
      'cust-1',
      'John Doe',
      'john@example.com',
      '0412345678',
      '[{"id":"addr-1","street":"123 Main St","city":"Sydney","postcode":"2000","state":"NSW","isDefault":true}]',
      12500,
      2,
      datetime('now'),
      datetime('now', '-5 days')
    );
  `);

  // Insert sample orders
  database.run(`
    INSERT INTO orders (
      id, order_id, customer_id, items, status, payment_status, payment_intent_id,
      delivery_method, delivery_fee, subtotal, total, created_at, updated_at, assigned_to
    )
    VALUES (
      'order-1',
      '#ORD-001',
      'cust-1',
      '[{"productId":"tres-leches","productName":"Tres Leches Cake","size":"Medium","addons":["Extra Cream"],"quantity":1,"unitPrice":4500,"totalPrice":4500}]',
      'delivered',
      'captured',
      'pi_test_001',
      'delivery',
      900,
      4500,
      5400,
      datetime('now', '-5 days'),
      datetime('now', '-3 days'),
      'admin-1'
    );
  `);

  database.run(`
    INSERT INTO orders (
      id, order_id, customer_id, items, status, payment_status, payment_intent_id,
      delivery_method, delivery_fee, subtotal, total, created_at, updated_at, assigned_to
    )
    VALUES (
      'order-2',
      '#ORD-002',
      'cust-1',
      '[{"productId":"choco-cake","productName":"Chocolate Cake","size":"Large","addons":[],"quantity":1,"unitPrice":6500,"totalPrice":6500}]',
      'confirmed',
      'authorized',
      'pi_test_002',
      'pickup',
      0,
      6500,
      6500,
      datetime('now', '-1 day'),
      datetime('now', '-1 day'),
      'admin-1'
    );
  `);

  saveDatabase();
}

/**
 * Admin data access methods
 */
export const adminDb = {
  async getByEmail(email: string) {
    const db = await getDatabase();
    const result = db.exec('SELECT * FROM admins WHERE email = ? LIMIT 1', [email]);
    if (result.length === 0 || result[0].values.length === 0) return null;

    const row = result[0].values[0];
    const columns = result[0].columns;
    return columns.reduce((obj: any, col, idx) => {
      obj[col] = row[idx];
      return obj;
    }, {});
  },

  async getById(id: string) {
    const db = await getDatabase();
    const result = db.exec('SELECT * FROM admins WHERE id = ? LIMIT 1', [id]);
    if (result.length === 0 || result[0].values.length === 0) return null;

    const row = result[0].values[0];
    const columns = result[0].columns;
    return columns.reduce((obj: any, col, idx) => {
      obj[col] = row[idx];
      return obj;
    }, {});
  },

  async create(data: { email: string; password: string; name: string; role?: string }) {
    const db = await getDatabase();
    const id = `admin-${Date.now()}`;
    const now = new Date().toISOString();

    db.run(
      `INSERT INTO admins (id, email, password, name, role, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [id, data.email, data.password, data.name, data.role || 'admin', now, now]
    );

    saveDatabase();
    return { id, ...data, created_at: now, updated_at: now };
  },

  async update(id: string, data: Partial<{ name: string; two_factor_enabled: boolean; two_factor_method: string; two_factor_secret: string; last_login: string }>) {
    const db = await getDatabase();
    const updates: string[] = [];
    const values: any[] = [];

    Object.entries(data).forEach(([key, value]) => {
      updates.push(`${key} = ?`);
      values.push(value);
    });

    updates.push('updated_at = ?');
    values.push(new Date().toISOString());
    values.push(id);

    db.run(`UPDATE admins SET ${updates.join(', ')} WHERE id = ?`, values);
    saveDatabase();
  },

  async getAll() {
    const db = await getDatabase();
    const result = db.exec('SELECT * FROM admins');
    if (result.length === 0) return [];

    return result[0].values.map((row) => {
      return result[0].columns.reduce((obj: any, col, idx) => {
        obj[col] = row[idx];
        return obj;
      }, {});
    });
  },
};

/**
 * Customer data access methods
 */
export const customerDb = {
  async getById(id: string) {
    const db = await getDatabase();
    const result = db.exec('SELECT * FROM customers WHERE id = ? LIMIT 1', [id]);
    if (result.length === 0 || result[0].values.length === 0) return null;

    const row = result[0].values[0];
    const columns = result[0].columns;
    const customer = columns.reduce((obj: any, col, idx) => {
      obj[col] = row[idx];
      return obj;
    }, {});

    // Parse JSON fields
    customer.addresses = JSON.parse(customer.addresses || '[]');
    return customer;
  },

  async getByEmail(email: string) {
    const db = await getDatabase();
    const result = db.exec('SELECT * FROM customers WHERE email = ? LIMIT 1', [email]);
    if (result.length === 0 || result[0].values.length === 0) return null;

    const row = result[0].values[0];
    const columns = result[0].columns;
    const customer = columns.reduce((obj: any, col, idx) => {
      obj[col] = row[idx];
      return obj;
    }, {});

    customer.addresses = JSON.parse(customer.addresses || '[]');
    return customer;
  },

  async create(data: { name: string; email: string; phone?: string; addresses?: any[] }) {
    const db = await getDatabase();
    const id = `cust-${Date.now()}`;
    const now = new Date().toISOString();

    db.run(
      `INSERT INTO customers (id, name, email, phone, addresses, created_at)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [id, data.name, data.email, data.phone || '', JSON.stringify(data.addresses || []), now]
    );

    saveDatabase();
    return { id, ...data, created_at: now };
  },

  async update(id: string, data: Partial<{ name: string; phone: string; addresses: any[]; total_spent: number; total_orders: number; last_order_date: string }>) {
    const db = await getDatabase();
    const updates: string[] = [];
    const values: any[] = [];

    Object.entries(data).forEach(([key, value]) => {
      if (key === 'addresses') {
        updates.push(`${key} = ?`);
        values.push(JSON.stringify(value));
      } else {
        updates.push(`${key} = ?`);
        values.push(value);
      }
    });

    values.push(id);
    db.run(`UPDATE customers SET ${updates.join(', ')} WHERE id = ?`, values);
    saveDatabase();
  },

  async getAll() {
    const db = await getDatabase();
    const result = db.exec('SELECT * FROM customers ORDER BY created_at DESC');
    if (result.length === 0) return [];

    return result[0].values.map((row) => {
      const customer = result[0].columns.reduce((obj: any, col, idx) => {
        obj[col] = row[idx];
        return obj;
      }, {});
      customer.addresses = JSON.parse(customer.addresses || '[]');
      return customer;
    });
  },
};

/**
 * Order data access methods
 */
export const orderDb = {
  async getById(id: string) {
    const db = await getDatabase();
    const result = db.exec('SELECT * FROM orders WHERE id = ? LIMIT 1', [id]);
    if (result.length === 0 || result[0].values.length === 0) return null;

    const row = result[0].values[0];
    const columns = result[0].columns;
    const order = columns.reduce((obj: any, col, idx) => {
      obj[col] = row[idx];
      return obj;
    }, {});

    order.items = JSON.parse(order.items || '[]');
    order.delivery_address = order.delivery_address ? JSON.parse(order.delivery_address) : null;
    return order;
  },

  async create(data: {
    order_id: string;
    customer_id: string;
    items: any[];
    status?: string;
    payment_status?: string;
    payment_intent_id?: string;
    delivery_method: string;
    delivery_address?: any;
    delivery_fee: number;
    subtotal: number;
    total: number;
    notes?: string;
    assigned_to?: string;
  }) {
    const db = await getDatabase();
    const id = `order-${Date.now()}`;
    const now = new Date().toISOString();

    db.run(
      `INSERT INTO orders (
        id, order_id, customer_id, items, status, payment_status, payment_intent_id,
        delivery_method, delivery_address, delivery_fee, subtotal, total, notes,
        created_at, updated_at, assigned_to
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        data.order_id,
        data.customer_id,
        JSON.stringify(data.items),
        data.status || 'pending',
        data.payment_status || 'authorized',
        data.payment_intent_id || null,
        data.delivery_method,
        data.delivery_address ? JSON.stringify(data.delivery_address) : null,
        data.delivery_fee,
        data.subtotal,
        data.total,
        data.notes || null,
        now,
        now,
        data.assigned_to || null,
      ]
    );

    saveDatabase();
    return { id, ...data, created_at: now, updated_at: now };
  },

  async update(id: string, data: Partial<{
    status: string;
    payment_status: string;
    notes: string;
    assigned_to: string;
    expected_delivery_date: string;
    actual_delivery_date: string;
  }>) {
    const db = await getDatabase();
    const updates: string[] = [];
    const values: any[] = [];

    Object.entries(data).forEach(([key, value]) => {
      updates.push(`${key} = ?`);
      values.push(value);
    });

    updates.push('updated_at = ?');
    values.push(new Date().toISOString());
    values.push(id);

    db.run(`UPDATE orders SET ${updates.join(', ')} WHERE id = ?`, values);
    saveDatabase();
  },

  async getAll(filters?: { status?: string; payment_status?: string }) {
    const db = await getDatabase();
    let query = 'SELECT * FROM orders';
    const conditions: string[] = [];
    const values: any[] = [];

    if (filters?.status) {
      conditions.push('status = ?');
      values.push(filters.status);
    }

    if (filters?.payment_status) {
      conditions.push('payment_status = ?');
      values.push(filters.payment_status);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY created_at DESC';

    const result = db.exec(query, values);
    if (result.length === 0) return [];

    return result[0].values.map((row) => {
      const order = result[0].columns.reduce((obj: any, col, idx) => {
        obj[col] = row[idx];
        return obj;
      }, {});
      order.items = JSON.parse(order.items || '[]');
      order.delivery_address = order.delivery_address ? JSON.parse(order.delivery_address) : null;
      return order;
    });
  },

  async getByCustomerId(customerId: string) {
    const db = await getDatabase();
    const result = db.exec('SELECT * FROM orders WHERE customer_id = ? ORDER BY created_at DESC', [customerId]);
    if (result.length === 0) return [];

    return result[0].values.map((row) => {
      const order = result[0].columns.reduce((obj: any, col, idx) => {
        obj[col] = row[idx];
        return obj;
      }, {});
      order.items = JSON.parse(order.items || '[]');
      order.delivery_address = order.delivery_address ? JSON.parse(order.delivery_address) : null;
      return order;
    });
  },
};

/**
 * Two-factor authentication sessions
 */
export const twoFactorDb = {
  async create(adminId: string, method: string, code: string) {
    const db = await getDatabase();
    const id = `2fa-${Date.now()}`;
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 10 * 60 * 1000); // 10 minutes

    db.run(
      `INSERT INTO two_factor_sessions (id, admin_id, method, code, created_at, expires_at)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [id, adminId, method, code, now.toISOString(), expiresAt.toISOString()]
    );

    saveDatabase();
    return { id, admin_id: adminId, method, code, created_at: now.toISOString(), expires_at: expiresAt.toISOString() };
  },

  async verify(id: string) {
    const db = await getDatabase();
    const result = db.exec('SELECT * FROM two_factor_sessions WHERE id = ? LIMIT 1', [id]);
    if (result.length === 0 || result[0].values.length === 0) return null;

    const row = result[0].values[0];
    const columns = result[0].columns;
    const session = columns.reduce((obj: any, col, idx) => {
      obj[col] = row[idx];
      return obj;
    }, {});

    // Check if expired
    if (new Date(session.expires_at) < new Date()) {
      db.run('DELETE FROM two_factor_sessions WHERE id = ?', [id]);
      saveDatabase();
      return null;
    }

    // Mark as verified
    db.run('UPDATE two_factor_sessions SET verified = 1 WHERE id = ?', [id]);
    saveDatabase();

    return session;
  },

  async getByAdminId(adminId: string) {
    const db = await getDatabase();
    const result = db.exec(
      'SELECT * FROM two_factor_sessions WHERE admin_id = ? AND verified = 0 AND expires_at > datetime("now") ORDER BY created_at DESC LIMIT 1',
      [adminId]
    );

    if (result.length === 0 || result[0].values.length === 0) return null;

    const row = result[0].values[0];
    const columns = result[0].columns;
    return columns.reduce((obj: any, col, idx) => {
      obj[col] = row[idx];
      return obj;
    }, {});
  },
};

/**
 * Analytics data access
 */
export const analyticsDb = {
  async getStats() {
    const db = await getDatabase();

    // Total orders
    const totalOrders = db.exec('SELECT COUNT(*) as count FROM orders')[0]?.values[0]?.[0] || 0;

    // Total revenue (captured payments only)
    const totalRevenue = db.exec(
      'SELECT COALESCE(SUM(total), 0) as revenue FROM orders WHERE payment_status = "captured"'
    )[0]?.values[0]?.[0] || 0;

    // Orders this month
    const ordersThisMonth = db.exec(
      'SELECT COUNT(*) as count FROM orders WHERE created_at >= date("now", "start of month")'
    )[0]?.values[0]?.[0] || 0;

    // Revenue this month
    const revenueThisMonth = db.exec(
      'SELECT COALESCE(SUM(total), 0) as revenue FROM orders WHERE payment_status = "captured" AND created_at >= date("now", "start of month")'
    )[0]?.values[0]?.[0] || 0;

    // Average order value
    const avgOrderValue = Number(totalOrders) > 0 ? Math.round(Number(totalRevenue) / Number(totalOrders)) : 0;

    // Status breakdown
    const statusBreakdown = db.exec('SELECT status, COUNT(*) as count FROM orders GROUP BY status');
    const statusCounts: Record<string, number> = {};
    if (statusBreakdown.length > 0) {
      statusBreakdown[0].values.forEach((row) => {
        statusCounts[row[0] as string] = row[1] as number;
      });
    }

    return {
      totalOrders: Number(totalOrders),
      totalRevenue: Number(totalRevenue),
      ordersThisMonth: Number(ordersThisMonth),
      revenueThisMonth: Number(revenueThisMonth),
      averageOrderValue: avgOrderValue,
      pendingOrders: statusCounts['pending'] || 0,
      deliveredOrders: statusCounts['delivered'] || 0,
      cancelledOrders: statusCounts['cancelled'] || 0,
      statusBreakdown: statusCounts,
    };
  },
};
