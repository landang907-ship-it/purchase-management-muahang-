/**
 * Excel parser - reads .xlsx / .xls / .csv file and extracts TAG-NAME column.
 * No longer filters by TAG-NAME - returns all rows for client-side filtering.
 */
import * as XLSX from 'xlsx';
import { excelDateToString, parseDateSafe } from '@/features/purchase/lib/date';

export interface ColumnDef {
    label: string;
    keys: string[];
}

export const COL_MAP: ColumnDef[] = [
    {
        label: 'Yc.m.hàng',
        keys: [
            'yc.m.hàng',
            'yc.m hàng',
            'yc m.hàng',
            'yc m hàng',
            'yc.mua hàng',
            'yêu cầu mua hàng',
            'yêu cầu mh',
            'purchase requisition',
            'purchase req',
            'pr number',
            'pr no',
            'số yc',
            'yc mua hàng',
            'req no',
            'req. no',
            'requisition no',
            'số đơn yc',
            'yc m.hàng',
        ],
    },
    {
        label: 'Vật tư',
        keys: [
            'vật tư',
            'vat tu',
            'mã vật tư',
            'ma vat tu',
            'material',
            'material no',
            'material number',
            'matnr',
            'item',
            'item no',
            'mã hàng',
            'ma hang',
            'số vật tư',
        ],
    },
    {
        label: 'Văn bản ngắn',
        keys: [
            'văn bản ngắn',
            'van ban ngan',
            'mô tả ngắn',
            'mo ta ngan',
            'short text',
            'description',
            'desc',
            'mô tả',
            'mo ta',
            'tên vật tư',
            'ten vat tu',
            'tên hàng',
            'ten hang',
            'material description',
            'item description',
        ],
    },
    {
        label: 'Ng.yêu cầu',
        keys: [
            'ng.yêu cầu',
            'ng.yêu cầu.',
            'ng yêu cầu',
            'ng.yc',
            'ng yc',
            'người yêu cầu',
            'nguoi yeu cau',
            'người đặt hàng',
            'requestor',
            'requested by',
            'created by',
            'người tạo',
            'nguoi tao',
            'người đặt',
            'nguoi dat',
        ],
    },
    {
        label: 'Số lượng',
        keys: [
            'số lượng',
            'so luong',
            'sl',
            'qty',
            'quantity',
            'amount',
            'số lượng yc',
            'sl yc',
            'quantity requested',
            'target qty',
            'order quantity',
        ],
    },
    {
        label: 'Ngày YC',
        keys: [
            'ngày yc',
            'ngày yc.',
            'ngay yc',
            'ngày yêu cầu',
            'ngay yeu cau',
            'ngày đặt',
            'ngay dat',
            'request date',
            'req date',
            'requisition date',
            'delivery date',
            'ngày giao hàng',
            'ngay giao hang',
            'required date',
            'need date',
            'date',
        ],
    },
    {
        label: 'T.trg xử lý',
        keys: [
            't.trg xử lý',
            't.trg xử lý.',
            't trg xử lý',
            't.trg xl',
            'trg xử lý',
            'trạng thái xử lý',
            'trang thai xu ly',
            'trạng thái',
            'trang thai',
            'status',
            'processing status',
            'order status',
            'pr status',
            'tình trạng',
            'tinh trang',
            'tình trạng xử lý',
            't.trg xlý',
        ],
    },
    {
        label: 'Đơn vị',
        keys: [
            'đv',
            'đơn vị',
            'don vi',
            'unit',
            'uom',
            'meins',
            'đơn vị tính',
            'don vi tinh',
            'đvt',
            'dvt',
        ],
    },
];

export const TAG_NAME_KEYS = [
    'tag-name',
    'tag name',
    'tagname',
    'tag',
    'tên thẻ',
    'ten the',
    'đã tạo',
    'da tao',
    'created by',
    'creator',
    'người tạo',
    'nguoi tao',
    'plant',
    'nhà máy',
    'nha may',
    'purchasing org',
    'purch. org',
    'purch org',
    'purchasing organization',
    'company code',
    'werks',
    'bukrs',
];

export interface PurchaseRow {
    'Yc.m.hàng': string;
    'Vật tư': string;
    'Văn bản ngắn': string;
    'Ng.yêu cầu': string;
    'Số lượng': string;
    'Ngày YC': string;
    'T.trg xử lý': string;
    'Đơn vị': string;
    'TAG-NAME': string;
    _rawDate: unknown;
    _rawStatus: string;
}

export interface ParseResult {
    allRows: PurchaseRow[]; // Tất cả rows, không lọc
    uniqueTags: string[]; // Danh sách TAG-NAME duy nhất từ file
    tagRowCounts: Record<string, number>; // Số rows cho mỗi TAG-NAME
    tagColIdx: number;
    headers: string[];
    sheetName: string;
    colIndices: number[];
    fileName: string;
}

/**
 * Normalize text: strip Vietnamese diacritics + fold đ→d for fuzzy matching.
 */
function normalizeText(value: unknown): string {
    return String(value ?? '')
        .normalize('NFD')
        .replace(/\p{Diacritic}/gu, '')
        .replace(/đ/g, 'd')
        .replace(/Đ/g, 'd')
        .toLowerCase()
        .trim();
}

function findColIndex(headers: string[], keys: string[]): number {
    const norm = headers.map((h) => normalizeText(h));
    const normKeys = keys.map((k) => normalizeText(k));

    for (const nk of normKeys) {
        const idx = norm.indexOf(nk);
        if (idx !== -1) return idx;
    }
    for (const nk of normKeys) {
        const idx = norm.findIndex((h) => h.includes(nk));
        if (idx !== -1) return idx;
    }
    return -1;
}

export async function parseExcel(file: File): Promise<ParseResult> {
    const buffer = await file.arrayBuffer();
    const data = new Uint8Array(buffer);
    const workbook = XLSX.read(data, { type: 'array', cellDates: false });

    const sheetName = workbook.SheetNames[0];
    if (!sheetName) throw new Error('File Excel không có sheet nào.');
    const sheet = workbook.Sheets[sheetName];

    const raw = XLSX.utils.sheet_to_json<unknown[]>(sheet, {
        header: 1,
        defval: '',
        blankrows: false,
    });

    if (!raw || raw.length < 2) {
        throw new Error('File Excel không có dữ liệu hoặc thiếu dòng tiêu đề.');
    }

    // Find the best header row by counting matching column definitions
    let headerRowIdx = 0;
    let maxMatches = 0;
    for (let i = 0; i < Math.min(10, raw.length); i++) {
        const row = raw[i];
        if (!row || row.every((cell) => String(cell ?? '').trim() === '')) continue;

        const headers = row.map((h) => String(h ?? '').trim());
        let matches = 0;
        for (const col of COL_MAP) {
            if (findColIndex(headers, col.keys) !== -1) {
                matches++;
            }
        }

        // Only consider rows with at least 5 column matches to be valid headers
        if (matches >= 5 && matches > maxMatches) {
            maxMatches = matches;
            headerRowIdx = i;
        }
    }

    const headers = (raw[headerRowIdx] ?? []).map((h) => String(h ?? '').trim());
    const tagColIdx = findColIndex(headers, TAG_NAME_KEYS);
    const colIndices = COL_MAP.map((col) => findColIndex(headers, col.keys));

    // Collect all TAG-NAME values for counting
    const tagCountMap = new Map<string, number>();

    const allRows: PurchaseRow[] = [];
    for (let i = headerRowIdx + 1; i < raw.length; i++) {
        const row = raw[i];
        if (!row || row.every((cell) => String(cell ?? '').trim() === '')) continue;

        // Get TAG-NAME value
        let tagValue = '';
        if (tagColIdx !== -1) {
            tagValue = String(row[tagColIdx] ?? '').trim().toUpperCase();
            if (tagValue) {
                tagCountMap.set(tagValue, (tagCountMap.get(tagValue) ?? 0) + 1);
            }
        }

        const obj: PurchaseRow = {
            'Yc.m.hàng': '',
            'Vật tư': '',
            'Văn bản ngắn': '',
            'Ng.yêu cầu': '',
            'Số lượng': '',
            'Ngày YC': '',
            'T.trg xử lý': '',
            'Đơn vị': '',
            'TAG-NAME': tagValue,
            _rawDate: '',
            _rawStatus: '',
        };

        const mutable = obj as unknown as Record<string, string>;
        COL_MAP.forEach((col, idx) => {
            const colIdx = colIndices[idx];
            let val: unknown = colIdx !== -1 ? row[colIdx] : '';
            if (col.label === 'Ngày YC') {
                val = excelDateToString(val);
            } else {
                val = val === null || val === undefined ? '' : String(val).trim();
            }
            mutable[col.label] = val as string;
        });

        const dateColIdx = colIndices[5]; // Ngày YC
        obj._rawDate = dateColIdx !== -1 ? row[dateColIdx] : '';
        obj._rawStatus = obj['T.trg xử lý'];

        // Chỉ lấy dữ liệu của năm nay và 1 năm trước đó
        // Ví dụ: Năm nay 2026 -> Lấy từ 2025 trở đi (Bỏ qua năm <= 2024)
        const reqDate = parseDateSafe(obj['Ngày YC']);
        if (reqDate) {
            const currentYear = new Date().getFullYear();
            const year = reqDate.getFullYear();
            if (year < currentYear - 1) {
                continue;
            }
        }

        allRows.push(obj);
    }

    // Build unique tags array and row counts
    const uniqueTags = Array.from(tagCountMap.keys()).sort();
    const tagRowCounts: Record<string, number> = {};
    for (const [tag, count] of tagCountMap) {
        tagRowCounts[tag] = count;
    }

    return {
        allRows,
        uniqueTags,
        tagRowCounts,
        tagColIdx,
        headers,
        sheetName,
        colIndices,
        fileName: file.name,
    };
}
