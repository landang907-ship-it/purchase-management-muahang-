import { useState, useEffect, useRef } from 'react';
import { Header } from './Header';
import { RightTaskBar } from '@/features/layout/ui/RightTaskBar';
import { Upload, FileText, Loader2 } from 'lucide-react';
import { useTranslation } from '@/i18n/useTranslation';
import { useToastQueue } from '@/shared/hooks/useToastQueue';
import { Toast } from '@/shared/ui/Toast';
import { read, utils } from 'xlsx';
import { fetchMaterialCodes, upsertMaterialCodes, type MaterialCode } from '../services/materialCodeService';
import { cn } from '@/shared/lib/cn';

export function MaterialCodePage() {
    const { t } = useTranslation();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { toasts, showToast } = useToastQueue();
    const [materials, setMaterials] = useState<MaterialCode[]>([]);
    const [loading, setLoading] = useState(true);
    const [importing, setImporting] = useState(false);

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

            // Tìm dòng header chứa các cột cần thiết (tìm trong 10 dòng đầu)
            let headerRowIdx = -1;
            let codeIdx = -1;
            let descIdx = -1;

            for (let i = 0; i < Math.min(rows.length, 10); i++) {
                const row = rows[i] || [];
                const rowStrs = row.map(cell => String(cell || '').trim().toLowerCase());
                
                const cIdx = rowStrs.findIndex(s => s.includes('vật tư'));
                const dIdx = rowStrs.findIndex(s => s.includes('mô tả vật tư'));

                if (cIdx !== -1 && dIdx !== -1) {
                    headerRowIdx = i;
                    codeIdx = cIdx;
                    descIdx = dIdx;
                    break;
                }
            }

            if (headerRowIdx === -1) {
                const sampleHeaders = rows.slice(0, 3).map(r => (r || []).join(', ')).join(' | ');
                showToast(`Không tìm thấy 2 cột cần thiết. File đang có: ${sampleHeaders.slice(0, 100)}...`, 'error', 10000);
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

            if (parsedCodes.length > 0) {
                await upsertMaterialCodes(parsedCodes);
                showToast(`Đã nhập thành công ${parsedCodes.length} mã vật tư`, 'success', 5000);
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
                            <div className="overflow-x-auto flex-1">
                                <table className="w-full text-left border-collapse">
                                    <thead className="bg-slate-50 sticky top-0 z-10 shadow-sm">
                                        <tr>
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
                                                <td colSpan={2} className="px-4 py-8 text-center text-slate-500">
                                                    <Loader2 className="animate-spin mx-auto mb-2 text-blue-500" size={24} />
                                                    Đang tải dữ liệu...
                                                </td>
                                            </tr>
                                        ) : materials.length === 0 ? (
                                            <tr>
                                                <td colSpan={2} className="px-4 py-12 text-center text-slate-500">
                                                    <div className="max-w-md mx-auto">
                                                        <FileText className="mx-auto mb-3 text-slate-300" size={48} />
                                                        <p className="text-lg font-medium text-slate-700 mb-1">Chưa có mã vật tư nào</p>
                                                        <p className="text-sm">Vui lòng chọn nút "Nhập file" ở góc trên bên phải để tải lên danh sách mã vật tư từ file Excel.</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : (
                                            materials.map((item, idx) => (
                                                <tr key={item.id || idx} className="hover:bg-blue-50/50 transition-colors">
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
