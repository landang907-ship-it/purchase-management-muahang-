import pg from 'pg';
import fs from 'fs';
import path from 'path';

const { Client } = pg;
const dbUrl = 'postgresql://postgres:Pro1371997@22222@db.abfrrzuxvbnvizlwpxea.supabase.co:5432/postgres';

async function applyMigrations() {
    const client = new Client({ connectionString: dbUrl });
    await client.connect();
    
    console.log('Connected to DB. Applying migrations...');
    
    try {
        const sql1 = fs.readFileSync(path.join(process.cwd(), 'supabase/migrations/20260720_04_add_urgent_columns.sql'), 'utf-8');
        await client.query(sql1);
        console.log('Migration 04 applied successfully.');
        
        const sql2 = fs.readFileSync(path.join(process.cwd(), 'supabase/migrations/20260720_05_add_request_date.sql'), 'utf-8');
        await client.query(sql2);
        console.log('Migration 05 applied successfully.');
        
    } catch (err) {
        console.error('Error applying migrations:', err);
    } finally {
        await client.end();
    }
}

applyMigrations();
