import { Injectable, OnModuleInit } from '@nestjs/common';
import { Client } from 'pg';
import { databaseConfig } from '../../config/database.config';

@Injectable()
export class DatabaseService implements OnModuleInit {
  private client: Client;

  constructor() {
    this.client = new Client(databaseConfig);
  }

  async onModuleInit() {
    await this.client.connect();

    // Postgres adlı veritabanı var mı? Yoksa oluşturma işlemi
    await this.ensureDatabase();

    // Users tablosu var mı? Yoksa oluşturma işlemi
    await this.ensureUsersTable();

    console.log('Database and table are ready!');
  }

  async query(queryText: string, params?: any[]): Promise<any> {
    return this.client.query(queryText, params);
  }

  private async ensureDatabase() {
    const dbName = 'postgres';
    const dbExists = await this.client.query(
      `SELECT 1 FROM pg_database WHERE datname = $1`,
      [dbName],
    );

    if (dbExists.rowCount === 0) {
      await this.client.query(`CREATE DATABASE ${dbName}`);
      console.log(`Database "${dbName}" created.`);
    } else {
      console.log(`Database "${dbName}" already exists.`);
    }

    // Connext to Db
    this.client.end();
    this.client = new Client(databaseConfig);
    await this.client.connect();
  }

  private async ensureUsersTable() {
    const tableExists = await this.client.query(
      `SELECT 1 FROM information_schema.tables WHERE table_name = $1`,
      ['users'],
    );

    if (tableExists.rowCount === 0) {
      await this.client.query(`
        CREATE TABLE users (
            id SERIAL PRIMARY KEY, 
            name VARCHAR(100) NOT NULL, 
            surname VARCHAR(100) NOT NULL, 
            email VARCHAR(150) UNIQUE NOT NULL, 
            password VARCHAR(255) NOT NULL, 
            phone VARCHAR(15), 
            age INT, 
            country VARCHAR(100), 
            district VARCHAR(100), 
            role VARCHAR(50), 
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
      console.log('Table "users" created.');
    } else {
      console.log('Table "users" already exists.');
    }
  }
}
