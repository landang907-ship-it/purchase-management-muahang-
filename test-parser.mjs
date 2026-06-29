#!/usr/bin/env node
/**
 * Test script to verify Excel parser works with 777.xlsx
 */
import * as XLSX from 'xlsx';
import * as fs from 'fs';
import * as path from 'path';

// Read the file
const filePath = path.join(process.cwd(), '..', '777.xlsx');
if (!fs.existsSync(filePath)) {
    console.error('❌ File 777.xlsx not found at', filePath);
    process.exit(1);
}

console.log('📂 Reading 777.xlsx...\n');
const buffer = fs.readFileSync(filePath);
const workbook = XLSX.read(buffer, { type: 'buffer', cellDates: false });

const sheetName = workbook.SheetNames[0];
console.log(`📄 Sheet: ${sheetName}`);

const sheet = workbook.Sheets[sheetName];
const raw = XLSX.utils.sheet_to_json(sheet, {
    header: 1,
    defval: '',
    blankrows: false,
});

console.log(`📊 Total rows in sheet: ${raw.length}\n`);

// Show first 3 rows to understand structure
console.log('=== First 3 rows (raw structure) ===');
for (let i = 0; i < Math.min(3, raw.length); i++) {
    const row = raw[i];
    console.log(`Row ${i}: [${row.slice(0, 5).map(c => `"${c}"`).join(', ')} ...]`);
}
console.log();

// Define column maps (same as in excel.ts)
const COL_MAP = [
    {
        label: 'Yc.m.hàng',
        keys: ['yc.m.hàng', 'yc m.hàng', 'yc.mua hàng', 'yêu cầu mua hàng', 'pr number', 'pr no', 'purchase requisition'],
    },
    { label: 'Vật tư', keys: ['vật tư', 'vat tu', 'material', 'matnr'] },
    { label: 'Văn bản ngắn', keys: ['văn bản ngắn', 'van ban ngan', 'mô tả', 'description'] },
    { label: 'Ng.yêu cầu', keys: ['ng.yêu cầu', 'ng yêu cầu', 'người yêu cầu', 'requestor'] },
    { label: 'Số lượng', keys: ['số lượng', 'so luong', 'qty', 'quantity'] },
    { label: 'Ngày YC', keys: ['ngày yc', 'ngay yc', 'request date', 'delivery date'] },
    { label: 'T.trg xử lý', keys: ['t.trg xử lý', 't.trg xlý', 'trạng thái', 'status'] },
];

const TAG_NAME_KEYS = ['tag-name', 'tag name', 'đã tạo', 'da tao', 'created by', 'creator', 'plant', 'werks'];
const TAG_VALUE = 'VN005922';

function findColIndex(headers, keys) {
    const norm = headers.map(h => String(h ?? '').toLowerCase().trim());
    for (const key of keys) {
        const idx = norm.indexOf(key.toLowerCase().trim());
        if (idx !== -1) return idx;
    }
    for (const key of keys) {
        const idx = norm.findIndex(h => h.includes(key.toLowerCase().trim()));
        if (idx !== -1) return idx;
    }
    return -1;
}

// Find best header row
let headerRowIdx = 0;
let maxMatches = 0;
for (let i = 0; i < Math.min(10, raw.length); i++) {
    const row = raw[i];
    if (!row || row.every(cell => String(cell ?? '').trim() === '')) continue;

    const headers = row.map(h => String(h ?? '').trim());
    let matches = 0;
    for (const col of COL_MAP) {
        if (findColIndex(headers, col.keys) !== -1) {
            matches++;
        }
    }

    console.log(`Row ${i}: ${matches} column matches`);
    if (matches >= 5 && matches > maxMatches) {
        maxMatches = matches;
        headerRowIdx = i;
    }
}

console.log(`\n✅ Best header row: ${headerRowIdx} (${maxMatches}/${COL_MAP.length} columns matched)\n`);

const headers = (raw[headerRowIdx] ?? []).map(h => String(h ?? '').trim());
console.log(`=== Headers (Row ${headerRowIdx}) ===`);
headers.slice(0, 10).forEach((h, i) => {
    console.log(`  [${i}] "${h}"`);
});
console.log();

// Find tag column
const tagColIdx = findColIndex(headers, TAG_NAME_KEYS);
if (tagColIdx === -1) {
    console.warn('⚠️  TAG column not found!');
} else {
    console.log(`✅ TAG column found at index ${tagColIdx}: "${headers[tagColIdx]}"\n`);
}

// Find all column indices
const colIndices = COL_MAP.map(col => findColIndex(headers, col.keys));
console.log('=== Column Mapping ===');
COL_MAP.forEach((col, idx) => {
    const colIdx = colIndices[idx];
    if (colIdx === -1) {
        console.log(`  ❌ ${col.label}: NOT FOUND`);
    } else {
        console.log(`  ✅ ${col.label} (idx ${colIdx}): "${headers[colIdx]}"`);
    }
});
console.log();

// Filter rows by TAG value
let filteredCount = 0;
const tagValues = new Set();
for (let i = headerRowIdx + 1; i < raw.length; i++) {
    const row = raw[i];
    if (!row || row.every(cell => String(cell ?? '').trim() === '')) continue;

    if (tagColIdx !== -1) {
        const tagVal = String(row[tagColIdx] ?? '').trim().toUpperCase();
        tagValues.add(tagVal);
        if (tagVal === TAG_VALUE) {
            filteredCount++;
        }
    }
}

console.log(`=== Filtering Results ===`);
console.log(`Looking for TAG-NAME = "${TAG_VALUE}"`);
console.log(`Unique TAG values in file: ${Array.from(tagValues).sort().join(', ')}`);
console.log(`✅ Rows matching "${TAG_VALUE}": ${filteredCount}\n`);

// Show sample of filtered rows
console.log('=== Sample Filtered Rows ===');
let sampleCount = 0;
for (let i = headerRowIdx + 1; i < raw.length && sampleCount < 3; i++) {
    const row = raw[i];
    if (!row || row.every(cell => String(cell ?? '').trim() === '')) continue;

    if (tagColIdx !== -1) {
        const tagVal = String(row[tagColIdx] ?? '').trim().toUpperCase();
        if (tagVal === TAG_VALUE) {
            console.log(`\nRow ${i}:`);
            COL_MAP.forEach((col, idx) => {
                const colIdx = colIndices[idx];
                const val = colIdx !== -1 ? String(row[colIdx] ?? '').trim() : '';
                console.log(`  ${col.label}: "${val.substring(0, 50)}${val.length > 50 ? '...' : ''}"`);
            });
            sampleCount++;
        }
    }
}

console.log('\n' + '='.repeat(50));
console.log(`✅ Parser test complete!`);
console.log(`   Total data rows after header: ${raw.length - headerRowIdx - 1}`);
console.log(`   Filtered rows (VN005922): ${filteredCount}`);
console.log('='.repeat(50));
