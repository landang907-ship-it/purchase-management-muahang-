import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { usePurchaseDataV2 } from '@/features/purchase/hooks/usePurchaseDataV2';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { MobilePurchaseList } from '@/features/purchase/ui/MobilePurchaseList';
import { AlertCircle, Loader2 } from 'lucide-react';

export function UrgentOrdersPage() {
    const { t } = useTranslation();
    const { user } = useAuth();
    
    // Fetch data using the existing hook
    const { rows, isLoading, error } = usePurchaseDataV2({
        userId: user?.user,
        t,
    });

    // Filter only urgent rows that have both a reason and an image
    const urgentRows = useMemo(() => {
        return rows.filter(
            (r) => r.is_urgent && r.urgent_reason && r.urgent_image_url
        );
    }, [rows]);

    return (
        <div className="flex flex-col h-full bg-[#f4f7ff] overflow-hidden relative font-sans">
            <div className="flex-shrink-0 bg-white/70 backdrop-blur-xl border-b border-slate-200/50 px-6 py-4">
                <h1 className="text-xl font-bold text-slate-800">Nhu cầu gấp</h1>
                <p className="text-sm text-slate-500 mt-1">Danh sách các mặt hàng đã được báo cáo khẩn cấp</p>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 relative min-h-0 overflow-y-auto">
                {isLoading ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500 bg-white/50 backdrop-blur-sm z-10">
                        <Loader2 className="w-8 h-8 animate-spin text-blue-500 mb-4" />
                        <p className="font-medium">Đang tải dữ liệu...</p>
                    </div>
                ) : error ? (
                    <div className="flex flex-col items-center justify-center h-full text-red-500 p-4 text-center">
                        <AlertCircle className="w-12 h-12 mb-2 opacity-80" />
                        <p className="font-medium text-lg">Lỗi tải dữ liệu</p>
                        <p className="text-sm opacity-80 mt-1">{(error as Error).message}</p>
                    </div>
                ) : urgentRows.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-slate-400 p-8 text-center bg-white/30 rounded-2xl mx-4 mt-8 border border-slate-200/50 border-dashed">
                        <div className="w-20 h-20 rounded-full bg-slate-100/80 flex items-center justify-center mb-4">
                            <AlertCircle className="w-10 h-10 text-slate-400" />
                        </div>
                        <p className="text-lg font-medium text-slate-600">Không có báo cáo nào</p>
                        <p className="text-sm mt-2 max-w-[250px]">Chưa có mặt hàng nào được báo cáo khẩn cấp với đầy đủ hình ảnh và lý do.</p>
                    </div>
                ) : (
                    <div className="h-full">
                        <MobilePurchaseList
                            rows={urgentRows}
                            materialImages={{}} // Since we don't fetch material images here, pass empty. Detail modal can handle it or we can ignore
                            onImageUploaded={() => {}}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
