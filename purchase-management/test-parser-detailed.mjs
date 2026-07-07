#!/usr/bin/env node
/**
 * Test script to examine the exact structure of 777.xlsx
 */
import * as XLSX from 'xlsx';
import * as fs from 'fs';
import * as path from 'path';

const filePath = path.join(process.cwd(), '..', '777.xlsx');
if (!fs.existsSync(filePath)) {
    console.error('❌ File 777.xlsx not found');
    process.exit(1);
}

console.log('📂 Examining 777.xlsx structure...\n');
const buffer = fs.readFileSync(filePath);
const workbook = XLSX.read(buffer, { type: 'buffer', cellDates: false });

const sheetName = workbook.SheetNames[0];
const sheet = workbook.Sheets[sheetName];

// Get raw data with different parsing options
console.log('=== Trying different parsing approaches ===\n');

// Approach 1: header: 1
console.log('Approach 1 - header: 1 (array mode):');
const raw1 = XLSX.utils.sheet_to_json(sheet, {
    header: 1,
    defval: '',
    blankrows: false,
});
console.log(`  Total rows: ${raw1.length}`);
console.log(`  First 15 rows:`);
for (let i = 0; i < Math.min(15, raw1.length); i++) {
    const row = raw1[i];
    const nonEmptyCount = row.filter(c => String(c ?? '').trim() !== '').length;
    const preview = row.slice(0, 3).map(c => `"${String(c ?? '').substring(0, 20)}"`).join(', ');
    console.log(`    Row ${i}: ${nonEmptyCount} non-empty cells | [${preview} ...]`);
}

// Approach 2: header: "A" (object mode)
console.log('\n\nApproach 2 - header: "A" (object mode):');
const raw2 = XLSX.utils.sheet_to_json(sheet, {
    header: 'A',
    defval: '',
    blankrows: false,
});
console.log(`  Total rows: ${raw2.length}`);
if (raw2.length > 0) {
    console.log(`  First row keys: ${Object.keys(raw2[0]).slice(0, 10).join(', ')}`);
    console.log(`  First row values: ${Object.values(raw2[0]).slice(0, 10).map(v => `"${String(v ?? '').substring(0, 15)}"`).join(', ')}`);
}

// Approach 3: Look at all rows to find actual header
console.log('\n\nApproach 3 - Scanning for actual header row:');
for (let i = 0; i < Math.min(50, raw1.length); i++) {
    const row = raw1[i];
    const nonEmptyCount = row.filter(c => String(c ?? '').trim() !== '').length;
    if (nonEmptyCount > 5) {
        const cells = row.slice(0, 15).map(c => String(c ?? '').trim()).filter(c => c !== '');
        console.log(`  Row ${i} (${nonEmptyCount} cells): ${cells.join(' | ')}`);
    }
}

// Approach 4: Get merged cells info
console.log('\n\nApproach 4 - Merged cells:');
if (sheet['!merges']) {
    console.log(`  Total merged cell ranges: ${sheet['!merges'].length}`);
    console.log(`  First 10 merged ranges:`);
    sheet['!merges'].slice(0, 10).forEach((merge, idx) => {
        console.log(`    ${idx}: ${XLSX.utils.encode_range(merge)}`);
    });
} else {
    console.log('  No merged cells detected');
}

// Approach 5: Read with merge option
console.log('\n\nApproach 5 - Reading with merge cells:');
const raw5 = XLSX.utils.sheet_to_json(sheet, {
    header: 1,
    defval: '',
    blankrows: false,
});
console.log(`  Total rows: ${raw5.length}`);
for (let i = 0; i < Math.min(20, raw5.length); i++) {
    const row = raw5[i];
    const nonEmptyCount = row.filter(c => String(c ?? '').trim() !== '').length;
    if (nonEmptyCount > 3) {
        const cells = row.map(c => String(c ?? '').trim()).filter(c => c !== '');
        console.log(`  Row ${i}: ${cells.join(' | ')}`);
    }
}
