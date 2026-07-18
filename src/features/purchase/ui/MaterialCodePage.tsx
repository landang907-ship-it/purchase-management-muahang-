import { useState, useEffect, useRef, useMemo } from 'react';
import { Header } from './Header';
import { RightTaskBar } from '@/features/layout/ui/RightTaskBar';
import { Upload, FileText, Loader2, Search } from 'lucide-react';
import { useTranslation } from '@/i18n/useTranslation';
import { useToastQueue } from '@/shared/hooks/useToastQueue';
import { Toast } from '@/shared/ui/Toast';
import { read, utils } from 'xlsx';
import { fetchMaterialCodes, upsertMaterialCodes, deleteAllMaterialCodes, type MaterialCode } from '../services/materialCodeService';
import { fetchMaterialImages, type MaterialImageMap } from '../services/materialService';
import { cn } from '@/shared/lib/cn';

export function MaterialCodePage() {
    const { t } = useTranslation();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { toasts, showToast } = useToastQueue();
    const [materials, setMaterials] = useState<MaterialCode[]>([]);
    const [loading, setLoading] = useState(true);
    const [importing, setImporting] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [images, setImages] = useState<Record<string, MaterialImageMap>>({});

    useEffect(() => {
        loadMaterials();
    }, []);

    const loadMaterials = async () => {
        setLoading(true);
        try {
            const data = await fetchMaterialCodes();
            setMaterials(data);
        } catch (error) {
            console.error('Error fetching materials:', error);
            showToast('Lỗi khi tải danh sách vật tư', 'error');
        } finally {
            setLoading(false);
        }
    };

    const openFilePicker = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setImporting(true);
        try {
            const data = await file.arrayBuffer();
            const workbook = read(data);
            const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
            
            // Lấy dữ liệu dạng mảng 2 chiều
            const rows: any[][] = utils.sheet_to_json(firstSheet, { header: 1 });
            
            if (rows.length < 2) {
                showToast('File không có dữ liệu', 'warning');
                return;
            }

            // Hàm bỏ dấu tiếng Việt để so sánh chính xác dù khác bảng mã Unicode
            const normalizeStr = (str: string) => {
                return String(str || '')
                    .normalize('NFD')
                    .replace(/[\u0300-\u036f]/g, '')
                    .toLowerCase()
                    .trim();
            };

            // Tìm dòng header chứa các cột cần thiết (tìm trong 50 dòng đầu)
            let headerRowIdx = -1;
            let codeIdx = -1;
            let descIdx = -1;

            for (let i = 0; i < Math.min(rows.length, 50); i++) {
                const row = rows[i] || [];
                const rowStrs = row.map(cell => normalizeStr(cell));
                
                // Mở rộng các từ khóa tìm kiếm cột mã vật tư (đã bỏ dấu)
                const cIdx = rowStrs.findIndex(s => s.includes('vat tu') || s.includes('ma lieu') || s.includes('ma vt') || s.includes('material'));
                
                // Mở rộng các từ khóa tìm kiếm cột mô tả (đã bỏ dấu)
                const dIdx = rowStrs.findIndex(s => s.includes('mo ta') || s.includes('ten vat tu') || s.includes('description') || s.includes('chi tiet') || (s.includes('ten') && cIdx !== -1 && rowStrs.indexOf(s) !== cIdx));

                if (cIdx !== -1 && dIdx !== -1 && cIdx !== dIdx) {
                    headerRowIdx = i;
                    codeIdx = cIdx;
                    descIdx = dIdx;
                    break;
                }
            }

            if (headerRowIdx === -1) {
                const nonEmpties = rows.filter(r => r && r.some(c => c)).slice(0, 5);
                const sampleHeaders = nonEmpties.map(r => r.join(', ')).join(' | ');
                showToast(`Không tìm thấy cột Mã/Tên Vật tư. File đang có: ${sampleHeaders.slice(0, 150)}...`, 'error', 15000);
                return;
            }

            // Parse dữ liệu từ dòng dưới header
            const parsedCodes: MaterialCode[] = [];
            for (let i = headerRowIdx + 1; i < rows.length; i++) {
                const row = rows[i];
                if (!row || row.length === 0) continue;
                
                const code = String(row[codeIdx] || '').trim();
                const desc = String(row[descIdx] || '').trim();
                
                if (code && code !== 'undefined' && code !== 'null') {
                    parsedCodes.push({ code, description: desc });
                }
            }

            // Loại bỏ các mã trùng lặp trong cùng một file (Postgres sẽ báo lỗi nếu insert 2 dòng có cùng khóa chính trong 1 lệnh)
            const uniqueCodesMap = new Map<string, MaterialCode>();
            for (const item of parsedCodes) {
                uniqueCodesMap.set(item.code, item); // Dòng sau cùng sẽ ghi đè dòng trước nếu trùng mã
            }
            const uniqueCodes = Array.from(uniqueCodesMap.values());

            if (uniqueCodes.length > 0) {
                // Xóa toàn bộ dữ liệu cũ trước khi nạp dữ liệu mới
                await deleteAllMaterialCodes();
                await upsertMaterialCodes(uniqueCodes);
                showToast(`Đã xóa dữ liệu cũ và nhập thành công ${uniqueCodes.length} mã vật tư mới`, 'success', 5000);
                await loadMaterials();
            } else {
                showToast('Không tìm thấy dòng dữ liệu nào hợp lệ bên dưới tiêu đề', 'warning', 5000);
            }

        } catch (error) {
            console.error('Import error:', error);
            const msg = error instanceof Error ? error.message : String(error);
            showToast(`Lỗi hệ thống: ${msg}`, 'error', 10000);
        } finally {
            setImporting(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const filteredMaterials = useMemo(() => {
        if (!searchQuery) return materials;
        const query = searchQuery.toLowerCase();
        return materials.filter(m => 
            (m.code && m.code.toLowerCase().includes(query)) ||
            (m.description && m.description.toLowerCase().includes(query))
        );
    }, [materials, searchQuery]);

    // Chỉ hiển thị tối đa 100 kết quả đầu tiên để trình duyệt không bị đơ
    const displayMaterials = filteredMaterials.slice(0, 100);

    useEffect(() => {
        const codes = displayMaterials.map(m => m.code);
        if (codes.length === 0) return;
        
        // Fetch missing images
        const missingCodes = codes.filter(c => !images[c]);
        if (missingCodes.length === 0) return;

        fetchMaterialImages(missingCodes).then(map => {
            if (Object.keys(map).length > 0) {
                setImages(prev => ({ ...prev, ...map }));
            }
        });
    }, [displayMaterials, images]);

    return (
        <div className="flex flex-col h-[100dvh] bg-slate-50 overflow-hidden">
            <Header
                actions={
                    <div className="flex items-center gap-1 sm:gap-2 shrink-0 overflow-x-auto scrollbar-hide">
                        <button 
                            onClick={openFilePicker} 
                            disabled={importing}
                            className={cn(
                                "flex items-center gap-1.5 px-2 py-1.5 text-white/90 hover:text-white hover:bg-white/10 rounded-md transition-colors shrink-0",
                                importing && "opacity-70 cursor-not-allowed"
                            )}
                        >
                            {importing ? <Loader2 size={15} strokeWidth={2.5} className="animate-spin" /> : <Upload size={15} strokeWidth={2.5} />}
                            <span className="hidden sm:block text-[12px] font-semibold whitespace-nowrap">
                                {importing ? 'Đang xử lý...' : t('header.import')}
                            </span>
                        </button>
                    </div>
                }
            />
            
            <div
                className="absolute inset-x-0 bottom-0 flex"
                style={{ top: 'calc(env(safe-area-inset-top, 0px) + 56px)' }}
            >
                <RightTaskBar />
                
                <main className="flex-1 overflow-auto bg-[#f4f7ff]" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px))' }}>
                    <div className="max-w-6xl mx-auto w-full p-4 md:p-6 h-full flex flex-col">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                                <FileText className="text-blue-500" size={24} />
                                Quản lý mã vật tư
                            </h2>
                            <span className="text-sm text-slate-500 font-medium bg-white px-3 py-1 rounded-full shadow-sm border border-slate-200">
                                Tổng số: <span className="text-blue-600 font-bold">{materials.length}</span>
                            </span>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex-1 flex flex-col">
                            {/* Thanh công cụ (Search) */}
                            <div className="p-4 border-b border-slate-100 flex items-center gap-3 bg-white">
                                <div className="relative max-w-md w-full">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Search size={16} className="text-slate-400" />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Tìm kiếm mã hoặc tên vật tư..."
                                        className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-slate-50 outline-none transition-all"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="overflow-x-auto flex-1">
                                <table className="w-full text-left border-collapse">
                                    <thead className="bg-slate-50 sticky top-0 z-10 shadow-sm">
                                        <tr>
                                            <th className="px-4 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider border-b border-slate-200 w-16">
                                                Ảnh
                                            </th>
                                            <th className="px-4 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider border-b border-slate-200">
                                                Vật tư
                                            </th>
                                            <th className="px-4 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider border-b border-slate-200">
                                                Mô tả vật tư
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {loading ? (
                                            <tr>
                                                <td colSpan={3} className="px-4 py-8 text-center text-slate-500">
                                                    <Loader2 className="animate-spin mx-auto mb-2 text-blue-500" size={24} />
                                                    Đang tải dữ liệu...
                                                </td>
                                            </tr>
                                        ) : materials.length === 0 ? (
                                            <tr>
                                                <td colSpan={3} className="px-4 py-12 text-center text-slate-500">
                                                    <div className="max-w-md mx-auto">
                                                        <FileText className="mx-auto mb-3 text-slate-300" size={48} />
                                                        <p className="text-lg font-medium text-slate-700 mb-1">
                                                            Chưa có mã vật tư nào
                                                        </p>
                                                        <p className="text-sm">Vui lòng chọn nút "Nhập file" ở góc trên bên phải để tải lên danh sách mã vật tư từ file Excel.</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : !searchQuery ? (
                                            <tr>
                                                <td colSpan={3} className="px-4 py-12 text-center text-slate-500">
                                                    <div className="max-w-md mx-auto">
                                                        <Search className="mx-auto mb-3 text-blue-300" size={48} />
                                                        <p className="text-lg font-medium text-slate-700 mb-1">
                                                            Sẵn sàng tìm kiếm
                                                        </p>
                                                        <p className="text-sm">Vui lòng gõ mã hoặc tên vào ô tìm kiếm phía trên để hiển thị danh sách vật tư.</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : displayMaterials.length === 0 ? (
                                            <tr>
                                                <td colSpan={3} className="px-4 py-12 text-center text-slate-500">
                                                    <div className="max-w-md mx-auto">
                                                        <Search className="mx-auto mb-3 text-slate-300" size={48} />
                                                        <p className="text-lg font-medium text-slate-700 mb-1">
                                                            Không tìm thấy kết quả nào
                                                        </p>
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : (
                                            displayMaterials.map((item, idx) => (
                                                <tr key={item.id || idx} className="hover:bg-blue-50/50 transition-colors">
                                                    <td className="px-4 py-2 border-b border-slate-100 align-middle">
                                                        {images[item.code]?.thumb_url ? (
                                                            <div className="w-10 h-10 rounded-md border border-slate-200 overflow-hidden bg-slate-50 flex items-center justify-center">
                                                                <img
                                                                    src={images[item.code].thumb_url}
                                                                    alt={item.code}
                                                                    className="w-full h-full object-cover"
                                                                    loading="lazy"
                                                                />
                                                            </div>
                                                        ) : (
                                                            <div className="w-10 h-10 rounded-md border border-slate-200 bg-slate-50 flex items-center justify-center">
                                                                <span className="text-slate-300 text-[10px]">No img</span>
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td className="px-4 py-3 text-sm font-medium text-slate-700 whitespace-nowrap">
                                                        {item.code}
                                                    </td>
                                                    <td className="px-4 py-3 text-sm text-slate-600">
                                                        {item.description}
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            
                            {!!searchQuery && filteredMaterials.length > 100 && (
                                <div className="p-3 bg-slate-50 border-t border-slate-200 text-center text-sm text-slate-500">
                                    Đang hiển thị 100 kết quả đầu tiên. Vui lòng gõ thêm từ khóa để tìm kiếm chính xác hơn.
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>
            
            <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept=".xlsx, .xls, .csv" 
                onChange={handleFileChange} 
            />

            <Toast toasts={toasts} />
        </div>
    );
}
