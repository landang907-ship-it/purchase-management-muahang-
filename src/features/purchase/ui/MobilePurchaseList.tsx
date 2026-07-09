import { Settings, Disc, Paperclip, Check, Wrench, Zap, Component, Box } from 'lucide-react';
import { cn } from '@/shared/lib/cn';
import type { PurchaseRow } from '@/features/purchase/services/excel';
import { useState } from 'react';
import { PurchaseDetailModal } from './PurchaseDetailModal';

interface MobilePurchaseListProps {
    rows: PurchaseRow[];
    totalLoaded: number;
    onFilterClick?: () => void;
    workshopName?: string;
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
    totalLoaded,
}: MobilePurchaseListProps) {
    const [selectedItem, setSelectedItem] = useState<PurchaseRow | null>(null);

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
                        
                        // Determine if this should be a simple card (missing Yc or code)
                        const isSimpleCard = !id && !code;

                        if (isSimpleCard) {
                            return (
                                <div
                                    key={`row-${index}`}
                                    className="bg-white rounded-lg border border-gray-200 shadow-sm p-3 flex items-center"
                                >
                                    <div className="text-[15px] font-medium text-gray-800 leading-snug truncate">
                                        {name || 'Vật tư không tên'}
                                    </div>
                                </div>
                            );
                        }

                        return (
                            <div
                                key={`row-${id || index}`}
                                className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col p-4 hover:shadow-md transition-shadow"
                            >
                                {/* Header and Meta Info */}
                                <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 mb-2 items-center">
                                    {/* Row 1 Left: PR ID */}
                                    <div className="text-[14px] font-bold text-[#2d4373]">
                                        {id ? `Yêu cầu : ${id}` : 'N/A'}
                                    </div>
                                    
                                    {/* Row 1 Right: Date & Status */}
                                    <div className="flex justify-between items-center w-full min-w-0 gap-2">
                                        <div className="text-[14px] text-emerald-500 font-medium truncate">
                                            {item['Ngày YC'] || ''}
                                        </div>
                                        {status && (
                                            <span
                                                className={cn(
                                                    "px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider text-white shrink-0 shadow-sm",
                                                    (status.trim() === '3' || status.trim() === '03') ? "bg-yellow-500" :
                                                    (status.trim() === '5' || status.trim() === '05') ? "bg-green-500" :
                                                    (status.trim() === '8' || status.trim() === '08') ? "bg-red-500" :
                                                    isApproved ? "bg-[#529b55]" : "bg-[#4a89dc]"
                                                )}
                                            >
                                                {status.toUpperCase()}
                                            </span>
                                        )}
                                    </div>

                                    {/* Row 2 Left: Material Code */}
                                    <div className="text-xs text-gray-400 font-mono truncate max-w-[140px]">
                                        {code || ''}
                                    </div>

                                    {/* Row 2 Right: Requester */}
                                    <div className="text-[11.5px] text-gray-500 font-medium truncate">
                                        {item['Ng.yêu cầu'] ? `Ng.yêu cầu : ${item['Ng.yêu cầu']}` : ''}
                                    </div>
                                </div>
                                
                                {/* Item Name */}
                                <div className="mb-3">
                                    <div className="text-[15px] font-medium text-gray-800 leading-snug line-clamp-2">
                                        {name}
                                    </div>
                                </div>

                                {/* Card Footer: Thumbnail, Quantity, and Action Button */}
                                <div className="flex items-center mt-auto pt-3 border-t border-gray-50 gap-3">
                                    {/* Thumbnail Placeholder */}
                                    <div className="w-[46px] h-[46px] bg-gray-50 rounded-lg border border-gray-200 flex flex-col items-center justify-center shrink-0 overflow-hidden shadow-sm">
                                        {/* Sẽ thay thế bằng thẻ <img src={...} /> khi có ảnh */}
                                        <Icon size={22} className="text-gray-400 opacity-70" strokeWidth={1.5} />
                                    </div>
                                    
                                    {/* Quantity (Center) */}
                                    <div className="flex-1 flex justify-center px-2 overflow-hidden">
                                        <div className="flex items-center justify-center h-[32px] text-[12px] font-bold text-[#2d4373] bg-blue-50/50 border border-blue-100 px-3 rounded-lg shadow-sm whitespace-nowrap truncate max-w-full">
                                            Số lượng: {item['Số lượng'] || '0'} {item['Đơn vị']?.toLowerCase() || ''}
                                        </div>
                                    </div>
                                    
                                    {/* Action Button */}
                                    <button 
                                        onClick={() => setSelectedItem(item)}
                                        className="flex items-center justify-center h-[32px] px-5 bg-orange-500 border border-orange-500 rounded-lg text-sm font-bold text-white hover:bg-orange-600 transition-colors shadow-sm shrink-0"
                                    >
                                        Chi tiết
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
                
                {rows.length === 0 && (
                    <div className="text-center py-10 text-gray-500 text-sm">
                        Không có dữ liệu để hiển thị.
                    </div>
                )}
            </div>

            {/* Floating Toast Notification */}
            {totalLoaded > 0 && (
                <div className="absolute bottom-6 left-0 right-0 flex justify-center pointer-events-none z-10">
                    <div className="bg-[#488d61] text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 text-sm font-medium opacity-95">
                        <Check size={16} />
                        <span>Đã tải {totalLoaded} dòng</span>
                    </div>
                </div>
            )}
            
            <PurchaseDetailModal 
                isOpen={!!selectedItem} 
                onClose={() => setSelectedItem(null)} 
                data={selectedItem} 
            />
        </div>
    );
}
