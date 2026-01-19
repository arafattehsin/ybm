/**
 * Azure Cosmos DB Client for YUM by Maryam
 * 
 * This module provides a singleton Cosmos DB client and utility functions
 * for interacting with orders, customers, and admin data.
 */

import { CosmosClient, Database, Container } from '@azure/cosmos';

// Cosmos DB Configuration
const endpoint = process.env.COSMOS_DB_ENDPOINT!;
const key = process.env.COSMOS_DB_KEY!;
const databaseId = process.env.COSMOS_DB_DATABASE_NAME || 'ybm-production';

if (!endpoint || !key) {
  throw new Error('COSMOS_DB_ENDPOINT and COSMOS_DB_KEY must be set in environment variables');
}

// Container IDs
export const CONTAINERS = {
  ORDERS: 'orders',
  CUSTOMERS: 'customers',
  ADMINS: 'admins',
} as const;

// Singleton client instance
let cosmosClient: CosmosClient | null = null;
let database: Database | null = null;

/**
 * Get or create Cosmos DB client
 */
export function getCosmosClient(): CosmosClient {
  if (!cosmosClient) {
    cosmosClient = new CosmosClient({ endpoint, key });
  }
  return cosmosClient;
}

/**
 * Get database instance
 */
export async function getDatabase(): Promise<Database> {
  if (!database) {
    const client = getCosmosClient();
    const { database: db } = await client.databases.createIfNotExists({
      id: databaseId,
    });
    database = db;
  }
  return database;
}

/**
 * Get container instance
 */
export async function getContainer(containerId: string): Promise<Container> {
  const db = await getDatabase();
  return db.container(containerId);
}

/**
 * Initialize database and create containers if they don't exist
 */
export async function initializeDatabase() {
  try {
    const db = await getDatabase();

    // Create Orders container (partition key: /customer_id)
    await db.containers.createIfNotExists({
      id: CONTAINERS.ORDERS,
      partitionKey: {
        paths: ['/customer_id'],
      },
    });

    // Create Customers container (partition key: /id)
    await db.containers.createIfNotExists({
      id: CONTAINERS.CUSTOMERS,
      partitionKey: {
        paths: ['/id'],
      },
    });

    // Create Admins container (partition key: /id)
    await db.containers.createIfNotExists({
      id: CONTAINERS.ADMINS,
      partitionKey: {
        paths: ['/id'],
      },
    });

    console.log('✅ Cosmos DB initialized successfully');
    return true;
  } catch (error) {
    console.error('❌ Failed to initialize Cosmos DB:', error);
    throw error;
  }
}

/**
 * Orders Repository
 */
export const ordersRepository = {
  async create(order: any) {
    const container = await getContainer(CONTAINERS.ORDERS);
    const { resource } = await container.items.create(order);
    return resource;
  },

  async getById(id: string, customerId: string) {
    const container = await getContainer(CONTAINERS.ORDERS);
    const { resource } = await container.item(id, customerId).read();
    return resource;
  },

  async getAll(filters?: { status?: string; limit?: number }) {
    const container = await getContainer(CONTAINERS.ORDERS);
    let query = 'SELECT * FROM c';
    const params: any[] = [];

    if (filters?.status) {
      query += ' WHERE c.status = @status';
      params.push({ name: '@status', value: filters.status });
    }

    query += ' ORDER BY c.created_at DESC';

    const { resources } = await container.items
      .query({
        query,
        parameters: params,
      })
      .fetchAll();

    return filters?.limit ? resources.slice(0, filters.limit) : resources;
  },

  async update(id: string, customerId: string, updates: any) {
    const container = await getContainer(CONTAINERS.ORDERS);
    const { resource: existing } = await container.item(id, customerId).read();
    
    const updated = {
      ...existing,
      ...updates,
      updated_at: new Date().toISOString(),
    };

    const { resource } = await container.item(id, customerId).replace(updated);
    return resource;
  },

  async delete(id: string, customerId: string) {
    const container = await getContainer(CONTAINERS.ORDERS);
    await container.item(id, customerId).delete();
  },
};

/**
 * Customers Repository
 */
export const customersRepository = {
  async create(customer: any) {
    const container = await getContainer(CONTAINERS.CUSTOMERS);
    const { resource } = await container.items.create(customer);
    return resource;
  },

  async getById(id: string) {
    const container = await getContainer(CONTAINERS.CUSTOMERS);
    const { resource } = await container.item(id, id).read();
    return resource;
  },

  async getByEmail(email: string) {
    const container = await getContainer(CONTAINERS.CUSTOMERS);
    const { resources } = await container.items
      .query({
        query: 'SELECT * FROM c WHERE c.email = @email',
        parameters: [{ name: '@email', value: email }],
      })
      .fetchAll();

    return resources[0] || null;
  },

  async getAll() {
    const container = await getContainer(CONTAINERS.CUSTOMERS);
    const { resources } = await container.items
      .query('SELECT * FROM c ORDER BY c.created_at DESC')
      .fetchAll();

    return resources;
  },

  async update(id: string, updates: any) {
    const container = await getContainer(CONTAINERS.CUSTOMERS);
    const { resource: existing } = await container.item(id, id).read();
    
    const updated = {
      ...existing,
      ...updates,
    };

    const { resource } = await container.item(id, id).replace(updated);
    return resource;
  },

  async delete(id: string) {
    const container = await getContainer(CONTAINERS.CUSTOMERS);
    await container.item(id, id).delete();
  },
};

/**
 * Admins Repository
 */
export const adminsRepository = {
  async create(admin: any) {
    const container = await getContainer(CONTAINERS.ADMINS);
    const { resource } = await container.items.create(admin);
    return resource;
  },

  async getById(id: string) {
    const container = await getContainer(CONTAINERS.ADMINS);
    const { resource } = await container.item(id, id).read();
    return resource;
  },

  async getByEmail(email: string) {
    const container = await getContainer(CONTAINERS.ADMINS);
    const { resources } = await container.items
      .query({
        query: 'SELECT * FROM c WHERE c.email = @email',
        parameters: [{ name: '@email', value: email }],
      })
      .fetchAll();

    return resources[0] || null;
  },

  async getAll() {
    const container = await getContainer(CONTAINERS.ADMINS);
    const { resources } = await container.items
      .query('SELECT * FROM c')
      .fetchAll();

    return resources;
  },

  async update(id: string, updates: any) {
    const container = await getContainer(CONTAINERS.ADMINS);
    const { resource: existing } = await container.item(id, id).read();
    
    const updated = {
      ...existing,
      ...updates,
      updated_at: new Date().toISOString(),
    };

    const { resource } = await container.item(id, id).replace(updated);
    return resource;
  },

  async delete(id: string) {
    const container = await getContainer(CONTAINERS.ADMINS);
    await container.item(id, id).delete();
  },
};

/**
 * Utility: Generate unique ID
 */
export function generateId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
