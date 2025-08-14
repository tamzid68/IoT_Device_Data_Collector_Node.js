import { Pool, PoolClient } from 'pg';
import logger from '../utils/logger.utils';
import dotenv from 'dotenv';

dotenv.config();


// PostgreSQL connection pool configuration
const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'UniversityDB',
    password: process.env.DB_PASSWORD || 'asm_tamzid',
    port: parseInt(process.env.DB_PORT || '5432', 10),
});


// Function to connect to PostgreSQL database
export async function connectToPostgreSQL(): Promise<void> {
    try {
        const client: PoolClient = await pool.connect();
        logger.log('✅ Connected to PostgreSQL database successfully');
        client.release();// Release the client back to the pool
    } catch (error: any) {
        logger.error('❌ Error connecting to PostgreSQL database:', error);
        throw error;
    }
};


// Function to test the database connection
export async function testDatabaseConnection(): Promise<void> {
    try {
        const client = await pool.connect();
        const result = await client.query('SELECT NOW()');
        logger.log('✅ Database connection successful:', result.rows[0]);
        client.release(); // Release the client back to the pool
    } catch (error: any) {
        logger.error('❌ Error during database connection:', error);
        throw error;
    }
};


// Function to execute a SQL query
export async function executeQuery(query: string, values?: any[]): Promise<any> {
    try {
        const client = await pool.connect();
        const result = await client.query(query, values);
        client.release(); // Release the client back to the pool
        return result;
    } catch (error: any) {
        console.error('❌ Error executing query:', error);
        throw error;
    }
};


// Export the pool and connection functions
export function getPool(): Pool {
    return pool;
}