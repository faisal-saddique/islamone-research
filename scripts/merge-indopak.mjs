#!/usr/bin/env node

/**
 * Merge IndoPak column from iOS SQLite database into Android SQLite database
 * This ensures the Android database has all the necessary data for PostgreSQL sync
 */

import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { promisify } from 'util';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Database paths
const ANDROID_DB_PATH = join(__dirname, 'islamone_android.sqlite3');
const IOS_DB_PATH = join(__dirname, 'islamone_ios_ayah_table.sqlite3');

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
 * Main merge function
 */
async function main() {
  console.log('🔄 Merging IndoPak column from iOS database to Android database...\n');

  let androidConnection;
  let iosConnection;

  try {
    // Connect to databases
    console.log('📁 Connecting to databases...');
    const sqlite = sqlite3.verbose();

    androidConnection = new sqlite.Database(ANDROID_DB_PATH);
    const androidDb = promisifyDb(androidConnection);
    console.log(`✓ Connected to Android database: ${ANDROID_DB_PATH}`);

    iosConnection = new sqlite.Database(IOS_DB_PATH);
    const iosDb = promisifyDb(iosConnection);
    console.log(`✓ Connected to iOS database: ${IOS_DB_PATH}`);

    // Check if Android database already has IndoPak data
    const existingIndoPakCount = await androidDb.get(`
      SELECT COUNT(*) as count
      FROM ayah
      WHERE AyahTextIndoPakForIOS IS NOT NULL
      AND AyahTextIndoPakForIOS != ''
    `);

    if (existingIndoPakCount.count > 0) {
      console.log(`⚠️  Android database already has ${existingIndoPakCount.count} rows with IndoPak data`);
      console.log('   Clearing existing IndoPak data and recopying...');

      // Clear existing IndoPak data
      await androidDb.run(`
        UPDATE ayah
        SET AyahTextIndoPakForIOS = NULL
        WHERE AyahTextIndoPakForIOS IS NOT NULL
      `);

      console.log('   ✓ Cleared existing IndoPak data');
    }

    // Get IndoPak data from iOS database
    console.log('\n📱 Fetching IndoPak data from iOS database...');
    const iosData = await iosDb.all(`
      SELECT Id, SurahNumber, AyahNumber, AyahTextIndoPakForIOS
      FROM ayah
      WHERE AyahTextIndoPakForIOS IS NOT NULL
      AND AyahTextIndoPakForIOS != ''
      ORDER BY Id
    `);

    console.log(`✓ Found ${iosData.length} rows with IndoPak text in iOS database`);

    if (iosData.length === 0) {
      console.log('⚠️  No IndoPak data found in iOS database. Nothing to merge.');
      return;
    }

    // Update Android database with IndoPak data
    console.log('\n📱 Updating Android database with IndoPak data...');

    // Use a transaction for better performance and data integrity
    await androidDb.run('BEGIN TRANSACTION');

    try {
      let updatedCount = 0;
      let notFoundCount = 0;
      const batchSize = 1000;

      for (let i = 0; i < iosData.length; i += batchSize) {
        const batch = iosData.slice(i, i + batchSize);

        for (const row of batch) {
          try {
            await androidDb.run(`
              UPDATE ayah
              SET AyahTextIndoPakForIOS = ?
              WHERE Id = ?
            `, [row.AyahTextIndoPakForIOS, row.Id]);

            // Check if the update actually affected a row
            const changesResult = await androidDb.get('SELECT changes() as changes');
            if (changesResult.changes > 0) {
              updatedCount++;
            } else {
              notFoundCount++;
            }
          } catch (error) {
            console.error(`Error updating row ${row.Id}:`, error.message);
            notFoundCount++;
          }
        }

        if ((i + batchSize) % 2000 === 0 || (i + batchSize) >= iosData.length) {
          console.log(`    Processed ${Math.min(i + batchSize, iosData.length)}/${iosData.length} rows...`);
        }
      }

      await androidDb.run('COMMIT');

      console.log(`✅ Successfully updated ${updatedCount} rows in Android database`);
      if (notFoundCount > 0) {
        console.log(`⚠️  ${notFoundCount} rows from iOS database not found in Android database`);
      }

      // Verify the merge
      const verifyResult = await androidDb.get(`
        SELECT COUNT(*) as count
        FROM ayah
        WHERE AyahTextIndoPakForIOS IS NOT NULL
        AND AyahTextIndoPakForIOS != ''
      `);

      console.log(`✓ Android database now has ${verifyResult.count} rows with IndoPak text`);

    } catch (error) {
      await androidDb.run('ROLLBACK');
      throw error;
    }

    console.log('\n✅ IndoPak column merge completed successfully!');
    console.log('   Android database now contains all IndoPak data and is ready for PostgreSQL sync.');

  } catch (error) {
    console.error('\n❌ Merge failed:', error.message);
    if (error.code) {
      console.error(`   Error code: ${error.code}`);
    }
    process.exit(1);
  } finally {
    if (androidConnection) {
      androidConnection.close();
      console.log('\n🔒 Android database connection closed');
    }
    if (iosConnection) {
      iosConnection.close();
      console.log('🔒 iOS database connection closed');
    }
  }
}

// Run the merge
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}