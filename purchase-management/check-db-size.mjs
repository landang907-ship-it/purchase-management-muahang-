/**
 * Check Supabase database stats via REST API (HTTPS).
 * Run: node check-db-size.mjs
 */
const SUPABASE_URL = 'https://abfrrzuxvbnvizlwpxea.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiZnJyenV4dmJudml6bHdweGVhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI3MTQ4MDEsImV4cCI6MjA5ODI5MDgwMX0.A9AzG5eHUseszQ_MoN0NuQSo2TX2FXmIHpeih87bdn0';

const headers = {
    'apikey': SUPABASE_KEY,
    'Authorization': `Bearer ${SUPABASE_KEY}`,
    'Content-Type': 'application/json',
};

function formatBytes(bytes) {
    if (bytes === 0 || !bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

async function countRows(table) {
    // Use count=exact with head request via Prefer header
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?select=id`, {
        method: 'HEAD',
        headers: { ...headers, 'Prefer': 'count=exact' },
    });
    const count = res.headers.get('content-range');
    if (count) {
        // Format: "0-N/total"
        const m = count.match(/\/(\d+)$/);
        if (m) return parseInt(m[1], 10);
    }
    return 0;
}

async function fetchAll(table, select = '*', limit = 1000) {
    const res = await fetch(
        `${SUPABASE_URL}/rest/v1/${table}?select=${select}&limit=${limit}`,
        { headers }
    );
    if (!res.ok) {
        const err = await res.text();
        throw new Error(`${table}: ${err}`);
    }
    return res.json();
}

async function run() {
    console.log('✅ Connecting to Supabase:', SUPABASE_URL + '\n');

    const TABLES = ['accounts', 'purchase_records'];

    console.log('📊 THỐNG KÊ TỪNG BẢNG');
    console.log('═'.repeat(90));
    console.log('Table'.padEnd(25) + 'Rows'.padStart(12) + '   Estimated Size');
    console.log('─'.repeat(90));

    let totalEstimatedBytes = 0;
    const stats = [];

    for (const tbl of TABLES) {
        try {
            const n = await countRows(tbl);
            // Fetch sample to estimate row size
            const sample = await fetchAll(tbl, '*', 100);
            let avgRowBytes = 0;
            if (sample.length > 0) {
                const totalSampleBytes = sample.reduce((sum, row) => {
                    return sum + JSON.stringify(row).length;
                }, 0);
                avgRowBytes = totalSampleBytes / sample.length;
            }
            const totalBytes = Math.round(avgRowBytes * n);
            totalEstimatedBytes += totalBytes;
            stats.push({ table: tbl, rows: n, avgBytes: avgRowBytes, totalBytes });
            console.log(
                tbl.padEnd(25) +
                n.toLocaleString().padStart(12) +
                '   ' +
                formatBytes(totalBytes) +
                ` (~${Math.round(avgRowBytes)} B/row)`
            );
        } catch (e) {
            console.log(tbl.padEnd(25) + '   ❌ ' + e.message.slice(0, 40));
        }
    }
    console.log('─'.repeat(90));
    console.log(
        'TOTAL'.padEnd(25) +
        ''.padStart(12) +
        '   ' +
        formatBytes(totalEstimatedBytes)
    );
    console.log('═'.repeat(90) + '\n');

    // 2. Free tier limit info
    const FREE_TIER_BYTES = 500 * 1024 * 1024; // 500 MB
    const usedPct = ((totalEstimatedBytes / FREE_TIER_BYTES) * 100).toFixed(4);
    console.log('📦 SUPABASE FREE TIER');
    console.log(`   Limit:        500 MB (524,288,000 bytes)`);
    console.log(`   Used (data):  ${formatBytes(totalEstimatedBytes)} (${usedPct}%)`);
    console.log(`   Remaining:    ${formatBytes(FREE_TIER_BYTES - totalEstimatedBytes)}`);
    console.log(`   Note:         This is only DATA size. Real DB size includes indexes + overhead.\n`);

    // 3. Top largest records in purchase_records
    try {
        const top = await fetchAll('purchase_records',
            'id,user_id,file_name,total_rows,imported_at,data', 50);
        if (top.length > 0) {
            // Compute per-row size
            const sized = top.map(r => ({
                id: r.id?.slice(0, 8) || 'n/a',
                file: r.file_name || 'n/a',
                rows: r.total_rows || 0,
                size: JSON.stringify(r).length,
                imported: r.imported_at?.slice(0, 19) || 'n/a',
            })).sort((a, b) => b.size - a.size).slice(0, 5);

            console.log('🏆 TOP 5 RECORD LỚN NHẤT (purchase_records)');
            console.log('─'.repeat(90));
            for (const r of sized) {
                console.log(`  ${r.id}…  ${r.file.padEnd(25)} ${String(r.rows).padStart(5)} rows  ${formatBytes(r.size).padStart(10)}  ${r.imported}`);
            }
            console.log('─'.repeat(90) + '\n');
        }
    } catch (e) {
        console.log('⚠️  Could not fetch top records:', e.message);
    }

    // 4. Accounts table
    try {
        const accounts = await fetchAll('accounts', 'user,language,created_at', 100);
        console.log('👥 ACCOUNTS');
        console.log('─'.repeat(90));
        for (const a of accounts) {
            console.log(`  ${(a.user || '').padEnd(20)} ${a.language || ''}  ${a.created_at?.slice(0, 19) || ''}`);
        }
        console.log('─'.repeat(90));
    } catch (e) {
        console.log('⚠️  Could not fetch accounts:', e.message);
    }

    // 5. Total rows summary
    console.log('\n🔢 TÓM TẮT');
    let totalRows = 0;
    for (const s of stats) totalRows += s.rows;
    console.log(`   Tổng số rows trong DB: ${totalRows.toLocaleString()}`);
    console.log(`   Tổng dung lượng data:  ${formatBytes(totalEstimatedBytes)}`);
    console.log(`   Free tier còn lại:    ${formatBytes(FREE_TIER_BYTES - totalEstimatedBytes)} (${(100 - parseFloat(usedPct)).toFixed(4)}%)`);

    console.log('\n✅ Done.\n');
    console.log('💡 TIP: Để xem chính xác dung lượng bao gồm indexes & overhead:');
    console.log('   Vào Supabase Dashboard → Settings → Database → Database size');
}

run().catch((e) => {
    console.error('❌ Error:', e.message);
    process.exit(1);
});