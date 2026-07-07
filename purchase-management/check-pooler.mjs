import pg from 'pg';

const urls = [
    'postgresql://postgres.abfrrzuxvbnvizlwpxea:Pro1371997%4022222@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres',
    'postgresql://postgres.abfrrzuxvbnvizlwpxea:Pro1371997%4022222@aws-0-us-east-1.pooler.supabase.com:6543/postgres',
    'postgresql://postgres.abfrrzuxvbnvizlwpxea:Pro1371997%4022222@aws-0-eu-west-1.pooler.supabase.com:6543/postgres',
];

for (const u of urls) {
    try {
        console.log('Trying:', u.slice(0, 80));
        const c = new pg.Client({
            connectionString: u,
            ssl: { rejectUnauthorized: false },
            connectionTimeoutMillis: 8000,
        });
        await c.connect();
        const r = await c.query('SELECT current_database() AS db, pg_database_size(current_database()) AS bytes');
        console.log('✅ Connected!');
        console.log('DB:', r.rows[0]);
        await c.end();
        process.exit(0);
    } catch (e) {
        console.log('❌', e.message);
    }
}
console.log('All URLs failed');
process.exit(1);