import { Settings, Disc, Paperclip, Wrench, Zap, Component, Box } from 'lucide-react';
import { cn } from '@/shared/lib/cn';
import type { PurchaseRow } from '@/features/purchase/services/excel';
import type { MaterialImageMap } from '@/features/purchase/services/materialService';
import { useState } from 'react';
import { useTranslation } from '@/i18n/useTranslation';
import { PurchaseDetailModal } from './PurchaseDetailModal';
import { formatStatusText, getStatusColorClass } from '../lib/status';

interface MobilePurchaseListProps {
    rows: PurchaseRow[];
    materialImages: Record<string, MaterialImageMap>;
    onImageUploaded: (materialCode: string, thumbUrl: string, origUrl: string) => void;
    onDataUpdated?: () => void;
}

/**
 * Hàm hỗ trợ tự động chọn icon dựa vào từ khóa trong tên vật tư
 */
function getIconForMaterial(name: string) {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('thép') || lowerName.includes('cắt') || lowerName.includes('cơ khí')) return Settings;
    if (lowerName.includes('đĩa') || lowerName.includes('nhám') || lowerName.includes('đánh bóng')) return Disc;
    if (lowerName.includes('xích') || lowerName.includes('bulong') || lowerName.includes('ốc')) return Paperclip;
    if (lowerName.includes('điện') || lowerName.includes('nguồn') || lowerName.includes('biến tần')) return Zap;
    if (lowerName.includes('lọc') || lowerName.includes('khí') || lowerName.includes('áp')) return Component;
    if (lowerName.includes('inox') || lowerName.includes('nhôm') || lowerName.includes('nhựa')) return Box;
    return Wrench; // default icon
}

export function MobilePurchaseList({
    rows,
    materialImages,
    onImageUploaded,
    onDataUpdated
}: MobilePurchaseListProps) {
    const { t } = useTranslation();
    const [selectedItem, setSelectedItem] = useState<PurchaseRow | null>(null);
    const [, setUpdateTrigger] = useState(0);

    return (
        <div className="flex flex-col h-full bg-[#f4f7ff] font-sans overflow-hidden">
            {/* List of Cards */}
            <div className="flex-1 overflow-y-auto px-4 py-4 relative pb-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {rows.map((item, index) => {
                        const id = item['Yc.m.hàng'];
                        const code = item['Vật tư'];
                        const name = item['Văn bản ngắn'];
                        const status = item['T.trg xử lý'];
                        const isApproved = status?.toUpperCase().includes('ĐÃ DUYỆT');
                        
                        const Icon = getIconForMaterial(name);
                        const materialImage = code ? materialImages[code] : null;
                        
                        // Determine if this should be a simple card (missing Yc or code)
                        const isSimpleCard = !id && !code;

                        if (isSimpleCard) {
                            return (
                                <div
                                    key={`row-${index}`}
                                    className="bg-white rounded-lg border border-gray-200 shadow-sm p-3 flex items-center"
                                >
                                    <div className="text-[15px] font-medium text-gray-800 leading-snug truncate">
                                        {name || t('detail.unnamed')}
                                    </div>
                                </div>
                            );
                        }

                        return (
                            <div
                                key={`row-${id}-${code}-${index}`}
                                className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col p-4 hover:shadow-md transition-shadow"
                            >
                                {/* Header and Meta Info */}
                                <div className="flex justify-between items-start gap-2 mb-2">
                                    {/* Left side: Info */}
                                    <div className="flex flex-col gap-1.5 min-w-0 flex-1">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className="text-[14px] font-bold text-[#2d4373] truncate">
                                                {id ? `${t('detail.id')} : ${id}` : 'N/A'}
                                            </span>
                                            <span className="text-[13px] text-emerald-500 font-medium shrink-0">
                                                {item['Ngày YC'] || ''}
                                            </span>
                                        </div>
                                        
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className="text-xs text-gray-400 font-mono truncate max-w-[120px]">
                                                {code || ''}
                                            </span>
                                            <span className="text-[11.5px] text-gray-500 font-medium truncate">
                                                {item['Ng.yêu cầu'] ? `${t('detail.requester')} : ${item['Ng.yêu cầu']}` : ''}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Right side: Status Badge */}
                                    {status && (
                                        <div className="shrink-0">
                                            <span
                                                className={cn(
                                                    "px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider text-white shadow-sm inline-block text-center",
                                                    getStatusColorClass(status, isApproved)
                                                )}
                                            >
                                                {formatStatusText(status)}
                                            </span>
                                        </div>
                                    )}
                                </div>
                                
                                {/* Item Name */}
                                <div className="mb-3">
                                    <div className="text-[15px] font-medium text-gray-800 leading-snug line-clamp-2">
                                        {item.is_urgent && item.urgent_status === 'approved' && (
                                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-green-100 text-green-600 text-[10px] font-bold mr-1.5 uppercase tracking-wide">
                                                ✅ Đã duyệt mua gấp
                                            </span>
                                        )}
                                        {item.is_urgent && item.urgent_status === 'processing' && (
                                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-orange-100 text-orange-600 text-[10px] font-bold mr-1.5 uppercase tracking-wide">
                                                🚚 Đang mua gấp
                                            </span>
                                        )}
                                        {name}
                                    </div>
                                </div>

                                {/* Card Footer: Thumbnail, Quantity, and Action Button */}
                                <div className="flex items-center mt-auto pt-3 border-t border-gray-50 gap-3">
                                    {/* Thumbnail */}
                                    <div className="w-[46px] h-[46px] bg-gray-50 rounded-lg border border-gray-200 flex flex-col items-center justify-center shrink-0 overflow-hidden shadow-sm">
                                        {materialImage?.thumb_url ? (
                                            <img 
                                                src={materialImage.thumb_url} 
                                                alt={name}
                                                loading="lazy"
                                                decoding="async"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <Icon size={22} className="text-gray-400 opacity-70" strokeWidth={1.5} />
                                        )}
                                    </div>
                                    
                                    {/* Quantity (Center) */}
                                    <div className="flex-1 flex justify-center px-2 overflow-hidden">
                                        <div className="flex items-center justify-center h-[32px] text-[12px] font-bold text-[#2d4373] bg-blue-50/50 border border-blue-100 px-3 rounded-lg shadow-sm whitespace-nowrap truncate max-w-full">
                                            {t('detail.qty')}: {item['Số lượng'] || '0'} {item['Đơn vị']?.toLowerCase() || ''}
                                        </div>
                                    </div>
                                    
                                    {/* Action Button */}
                                    <button 
                                        onClick={() => setSelectedItem(item)}
                                        className="flex items-center justify-center h-[32px] px-5 bg-orange-500 border border-orange-500 rounded-lg text-sm font-bold text-white hover:bg-orange-600 transition-colors shadow-sm shrink-0"
                                    >
                                        {t('detail.button')}
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
                
                {rows.length === 0 && (
                    <div className="text-center py-10 text-gray-500 text-sm">
                        {t('detail.noData')}
                    </div>
                )}
            </div>
            
            <PurchaseDetailModal 
                isOpen={!!selectedItem} 
                onClose={() => setSelectedItem(null)} 
                data={selectedItem}
                materialImage={selectedItem?.['Vật tư'] ? materialImages[selectedItem['Vật tư']] : null}
                onImageUploaded={onImageUploaded}
                onDataUpdated={() => {
                    setUpdateTrigger(prev => prev + 1);
                    onDataUpdated?.();
                }}
            />
        </div>
    );
}
