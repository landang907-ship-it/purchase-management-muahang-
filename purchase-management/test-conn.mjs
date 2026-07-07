import pg from 'pg';

const tests = [
    // Direct db connection (port 5432)
    {
        name: 'Direct: db.*.supabase.co:5432',
        config: {
            host: 'db.abfrrzuxvbnvizlwpxea.supabase.co',
            port: 5432,
            user: 'postgres',
            password: 'Pro1371997@22222',
            database: 'postgres',
            ssl: { rejectUnauthorized: false },
            connectionTimeoutMillis: 10000,
        },
    },
    // Pooler transaction mode (port 6543)
    {
        name: 'Pooler tx: aws-0-ap-southeast-1:6543',
        config: {
            host: 'aws-0-ap-southeast-1.pooler.supabase.com',
            port: 6543,
            user: 'postgres.abfrrzuxvbnvizlwpxea',
            password: 'Pro1371997@22222',
            database: 'postgres',
            ssl: { rejectUnauthorized: false },
            connectionTimeoutMillis: 10000,
        },
    },
];

for (const t of tests) {
    try {
        console.log('Testing:', t.name);
        const c = new pg.Client(t.config);
        await c.connect();
        const r = await c.query('SELECT 1 AS ok');
        console.log('✅ Connected! Result:', r.rows[0]);
        await c.end();
        process.exit(0);
    } catch (e) {
        console.log('❌', e.message);
    }
}
console.log('All failed');
process.exit(1);