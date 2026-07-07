# Purchase Filter Improvements — Technical Plan

## 1. File Changes

### New Files
| File | Purpose |
|------|---------|
| `src/features/purchase/ui/StatusFilter.tsx` | Dropdown lọc theo cột T.trg xử lý |
| `src/features/purchase/ui/DateRangeFilter.tsx` | Input lọc khoảng ngày cột Ngày YC |

### Modified Files
| File | Changes |
|------|---------|
| `src/features/purchase/ui/PurchasePage.tsx` | Thêm state, logic lọc, nút Xóa lọc |

## 2. Component Design

### StatusFilter
- Props: `options: string[]`, `value: string`, `onChange: (v: string) => void`
- Single-select dropdown
- Hiển thị nhãn "T.trg xử lý:"
- Placeholder: "— Tất cả —"
- Options được populate từ dữ liệu đã load

### DateRangeFilter
- Props: `dateFrom`, `dateTo`, `onDateFromChange`, `onDateToChange`
- Hai input type="date" native: "Từ" và "Đến"
- Có nút X nhỏ để xóa từng ngày riêng lẻ
- Sử dụng parseDateSafe() từ date.ts để parse ngày

## 3. State Management (PurchasePage)

```ts
// State mới
const [selectedStatus, setSelectedStatus] = useState<string>('');
const [dateFrom, setDateFrom] = useState<string>('');
const [dateTo, setDateTo] = useState<string>('');

// Computed values
const statusOptions = useMemo(() => { ... }, [rows]);
const hasAnyFilter = selectedRequesters.length > 0 || selectedStatus !== '' || dateFrom !== '' || dateTo !== '';
const clearAllFilters = () => { setSelectedRequesters([]); setSelectedStatus(''); setDateFrom(''); setDateTo(''); };
```

## 4. Filter Logic

```ts
if (selectedStatus) {
    result = result.filter((r) => ((r['T.trg xử lý'] ?? '').trim()) === selectedStatus);
}
if (dateFrom || dateTo) {
    result = result.filter((r) => {
        const dateVal = parseDateSafe(r['Ngày YC'] ?? '');
        if (!dateVal) return false;
        const fromDate = dateFrom ? new Date(dateFrom) : null;
        const toDate = dateTo ? new Date(dateTo) : null;
        if (fromDate && dateVal < fromDate) return false;
        if (toDate && dateVal > toDate) return false;
        return true;
    });
}
```

## 5. UI Layout

```
[RequesterFilter] | [StatusFilter] | [DateRangeFilter] | [Xóa lọc button]
```

- Flex row với gap
- Overflow-x-auto cho responsive
- Nút "Xóa lọc" chỉ render khi hasAnyFilter === true
