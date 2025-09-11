#!/usr/bin/env node

/**
 * SQLite to PostgreSQL Database Converter (Node.js version)
 * Converts islamone_android.sqlite3 to PostgreSQL database
 */

import sqlite3 from 'sqlite3';
import pkg from 'pg';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { promisify } from 'util';

const { Client } = pkg;

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Database configurations
const SQLITE_DB_PATH = join(__dirname, 'islamone_android.sqlite3');
const PG_CONFIG = {
  host: 'localhost',
  port: 5432,
  database: 'islamone-db',
  user: 'islamone',
  password: 'islamone',
};

/**
 * Promisify sqlite3 methods for async/await usage
 */
function promisifyDb(db) {
  return {
    all: promisify(db.all.bind(db)),
    get: promisify(db.get.bind(db)),
    run: promisify(db.run.bind(db)),
  };
}

/**
 * Get all table names from SQLite database
 */
async function getSqliteTables(db) {
  const query = "SELECT name FROM sqlite_master WHERE type='table' AND name != 'android_metadata';";
  const rows = await db.all(query);
  return rows.map(row => row.name);
}

/**
 * Get CREATE TABLE statement for a table
 */
async function getTableSchema(db, tableName) {
  const query = `SELECT sql FROM sqlite_master WHERE type='table' AND name='${tableName}';`;
  const result = await db.get(query);
  return result ? result.sql : null;
}

/**
 * Convert SQLite data types to PostgreSQL equivalents
 */
function sqliteToPgType(sqliteType) {
  const type = sqliteType.toUpperCase();
  
  const typeMapping = {
    'INTEGER': 'INTEGER',
    'INT': 'INTEGER',
    'TEXT': 'TEXT',
    'LONGTEXT': 'TEXT',
    'VARCHAR': 'VARCHAR',
    'TINYINT': 'SMALLINT',
    'LARGE TEXT': 'TEXT',
  };

  // Handle sized types like varchar(255)
  for (const [sqliteT, pgT] of Object.entries(typeMapping)) {
    if (type.startsWith(sqliteT)) {
      if (type.includes('(') && sqliteT === 'VARCHAR') {
        return type.replace('VARCHAR', 'VARCHAR');
      }
      return pgT;
    }
  }

  return 'TEXT'; // Default fallback
}

/**
 * Inspect actual data to determine correct column types
 */
async function inspectColumnDataTypes(db, tableName) {
  // Get column info
  const columns = await db.all(`PRAGMA table_info(${tableName})`);
  
  // Sample data to determine actual types
  const sampleRows = await db.all(`SELECT * FROM ${tableName} LIMIT 5`);
  
  const correctedTypes = {};
  
  for (let colIdx = 0; colIdx < columns.length; colIdx++) {
    const column = columns[colIdx];
    const colName = column.name;
    const declaredType = column.type;
    let actualType = declaredType;
    
    if (sampleRows.length > 0 && colIdx < Object.keys(sampleRows[0]).length) {
      const sampleValues = sampleRows
        .map(row => row[colName])
        .filter(val => val !== null);
      
      if (sampleValues.length > 0) {
        // If declared as INTEGER but contains text, change to TEXT
        if (['INTEGER', 'INT'].includes(declaredType.toUpperCase()) && 
            sampleValues.some(val => typeof val === 'string' && !/^\d+$/.test(val))) {
          actualType = 'TEXT';
        }
      }
    }
    
    correctedTypes[colName] = actualType;
  }
  
  return correctedTypes;
}

/**
 * Convert SQLite CREATE TABLE statement to PostgreSQL
 */
async function convertSchemaToPostgreSQL(db, tableName, sqliteSchema) {
  if (!sqliteSchema) {
    return null;
  }

  // Get corrected data types based on actual data
  const correctedTypes = await inspectColumnDataTypes(db, tableName);

  // Remove SQLite-specific syntax
  let pgSchema = sqliteSchema.replace(/`/g, '"');
  pgSchema = pgSchema.replace(/IF NOT EXISTS/g, '');

  // Convert data types
  const lines = pgSchema.split('\n');
  const convertedLines = [];

  for (const line of lines) {
    if (line.includes('CREATE TABLE')) {
      convertedLines.push(line);
    } else if (line.trim().startsWith('PRIMARY KEY')) {
      convertedLines.push(line);
    } else if (line.trim() && !line.trim().startsWith(')')) {
      // Process column definitions
      const parts = line.trim().replace(/,$/, '').split(/\s+/);
      if (parts.length >= 2) {
        const colName = parts[0].replace(/["`]/g, '');
        const colType = parts.slice(1).join(' ');

        let pgType;
        if (correctedTypes[colName]) {
          pgType = sqliteToPgType(correctedTypes[colName]);
        } else {
          const baseType = colType.includes('(') ? colType.split('(')[0] : colType.split(' ')[0];
          pgType = sqliteToPgType(baseType);
        }

        if (pgType === 'VARCHAR' && colType.includes('(')) {
          const sizeMatch = colType.match(/\([\d,\s]+\)/);
          if (sizeMatch) {
            pgType += sizeMatch[0];
          }
        }

        let convertedLine = `\t"${colName}"\t${pgType}`;
        if (colType.includes('NOT NULL')) {
          convertedLine += ' NOT NULL';
        }
        if (colType.includes('DEFAULT')) {
          const defaultMatch = colType.match(/DEFAULT\s+[^,\s]+/i);
          if (defaultMatch) {
            convertedLine += ` ${defaultMatch[0]}`;
          }
        }

        if (line.trim().endsWith(',')) {
          convertedLine += ',';
        }

        convertedLines.push(convertedLine);
      } else {
        convertedLines.push(line);
      }
    } else {
      convertedLines.push(line);
    }
  }

  return convertedLines.join('\n');
}

/**
 * Create all tables in PostgreSQL database
 */
async function createPostgreSQLTables(pgClient, sqliteDb) {
  const tables = await getSqliteTables(sqliteDb);
  
  console.log(`Creating ${tables.length} tables in PostgreSQL...`);

  for (const table of tables) {
    console.log(`Creating table: ${table}`);
    const sqliteSchema = await getTableSchema(sqliteDb, table);
    const pgSchema = await convertSchemaToPostgreSQL(sqliteDb, table, sqliteSchema);

    try {
      // Drop table if exists
      await pgClient.query(`DROP TABLE IF EXISTS "${table}" CASCADE;`);
      // Create table
      await pgClient.query(pgSchema);
    } catch (error) {
      console.error(`Error creating table ${table}:`, error.message);
      console.error(`Schema was: ${pgSchema}`);
    }
  }
}

/**
 * Copy data from SQLite table to PostgreSQL table
 */
async function copyTableData(sqliteDb, pgClient, tableName) {
  try {
    // Get column names
    const columns = await sqliteDb.all(`PRAGMA table_info(${tableName})`);
    const columnNames = columns.map(col => col.name);

    // Get all data
    const rows = await sqliteDb.all(`SELECT * FROM ${tableName}`);

    if (rows.length === 0) {
      console.log(`  No data in table ${tableName}`);
      return;
    }

    // Prepare INSERT statement
    const columnList = columnNames.map(col => `"${col}"`).join(', ');
    const placeholders = columnNames.map((_, i) => `$${i + 1}`).join(', ');
    const insertSql = `INSERT INTO "${tableName}" (${columnList}) VALUES (${placeholders})`;

    // Insert data in batches
    for (const row of rows) {
      const values = columnNames.map(col => row[col]);
      await pgClient.query(insertSql, values);
    }

    console.log(`  Copied ${rows.length} rows`);
  } catch (error) {
    console.error(`  Error copying data for table ${tableName}:`, error.message);
  }
}

/**
 * Verify PostgreSQL connection and database readiness
 */
async function verifyDatabaseConnection(pgClient) {
  try {
    // Test basic connection
    await pgClient.query('SELECT NOW()');
    console.log('✓ PostgreSQL connection verified');
    
    // Check if any Prisma tables exist (indicating migrations have run)
    const result = await pgClient.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('User', 'users', '_prisma_migrations')
      LIMIT 1
    `);
    
    if (result.rows.length === 0) {
      console.log('⚠️  No Prisma tables found. Make sure migrations have been applied.');
      console.log('   Run: prisma migrate deploy');
      return false;
    }
    
    console.log('✓ Database schema is ready');
    return true;
  } catch (error) {
    console.error('✗ Database verification failed:', error.message);
    return false;
  }
}

/**
 * Main conversion function
 */
async function main() {
  console.log('🔄 Starting SQLite to PostgreSQL sync...\n');

  let sqliteDb;
  let pgClient;
  let sqliteConnection;

  try {
    // Connect to SQLite
    console.log('📁 Connecting to SQLite database...');
    const sqlite = sqlite3.verbose();
    sqliteConnection = new sqlite.Database(SQLITE_DB_PATH);
    sqliteDb = promisifyDb(sqliteConnection);
    console.log(`✓ Connected to SQLite: ${SQLITE_DB_PATH}`);

    // Connect to PostgreSQL
    console.log('\n🐘 Connecting to PostgreSQL...');
    pgClient = new Client(PG_CONFIG);
    await pgClient.connect();
    console.log(`✓ Connected to PostgreSQL: ${PG_CONFIG.database}`);

    // Verify database is ready
    console.log('\n🔍 Verifying database readiness...');
    const isReady = await verifyDatabaseConnection(pgClient);
    if (!isReady) {
      throw new Error('Database is not ready for sync. Please run migrations first.');
    }

    // Get table list and filter out Prisma-managed tables
    const allTables = await getSqliteTables(sqliteDb);
    const managedTables = ['User', 'users', 'TranslationReview', 'translation_reviews', 
                          'UserProgress', 'user_progress', 'ReviewMetrics', 'review_metrics', 
                          'FlaggedTranslation', 'flagged_translations'];
    
    const tablesToSync = allTables.filter(table => 
      !managedTables.includes(table) && !table.startsWith('_prisma')
    );

    console.log(`\n📊 Found ${allTables.length} total tables, syncing ${tablesToSync.length} data tables`);
    console.log(`   (Skipping ${allTables.length - tablesToSync.length} application/system tables)`);

    // Create/update tables
    console.log('\n🏗️  Creating/updating table structures...');
    await createPostgreSQLTables(pgClient, sqliteDb);

    // Copy data
    console.log(`\n📥 Syncing data from ${tablesToSync.length} tables...`);
    for (const table of tablesToSync) {
      console.log(`   📋 Syncing table: ${table}`);
      await copyTableData(sqliteDb, pgClient, table);
    }

    console.log('\n✅ Database sync completed successfully!');
    console.log('   Your PostgreSQL database now contains the latest SQLite data.');

  } catch (error) {
    console.error('\n❌ Sync failed:', error.message);
    if (error.code) {
      console.error(`   Error code: ${error.code}`);
    }
    process.exit(1);
  } finally {
    if (sqliteConnection) {
      sqliteConnection.close();
      console.log('\n🔒 SQLite connection closed');
    }
    if (pgClient) {
      await pgClient.end();
      console.log('🔒 PostgreSQL connection closed');
    }
  }
}

// Run the conversion
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}