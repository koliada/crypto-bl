import { Pool, PoolClient } from 'pg';
import { EnvironmentVariables } from '../types/index.js';

export class DatabaseConnection {
  private pool: Pool;
  private env: EnvironmentVariables;

  constructor(env: EnvironmentVariables) {
    this.env = env;
    this.pool = new Pool({
      connectionString: this.env.DATABASE_URL,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });

    this.pool.on('error', (err: Error) => {
      console.error('Unexpected error on idle client', err);
    });
  }

  async connect(): Promise<PoolClient> {
    try {
      const client = await this.pool.connect();
      console.log('✅ Database connected successfully');
      return client;
    } catch (err) {
      console.error('❌ Database connection failed:', err);
      throw err;
    }
  }

  async query<T = any>(text: string, params?: any[]): Promise<T[]> {
    const client = await this.connect();
    try {
      const result = await client.query(text, params);
      return result.rows;
    } finally {
      client.release();
    }
  }

  async close(): Promise<void> {
    await this.pool.end();
    console.log('🔌 Database connection closed');
  }

  async healthCheck(): Promise<boolean> {
    try {
      await this.query('SELECT 1');
      return true;
    } catch (err) {
      console.error('Database health check failed:', err);
      return false;
    }
  }
}

// Singleton instance
let dbConnection: DatabaseConnection | null = null;

export const getDatabaseConnection = (env: EnvironmentVariables): DatabaseConnection => {
  if (!dbConnection) {
    dbConnection = new DatabaseConnection(env);
  }
  return dbConnection;
};
