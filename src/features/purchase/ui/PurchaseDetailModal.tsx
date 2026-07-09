import { X, Check, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/shared/lib/cn';
import type { PurchaseRow } from '@/features/purchase/services/excel';
import { useEffect, useState } from 'react';

interface PurchaseDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    data: PurchaseRow | null;
}

export function PurchaseDetailModal({ isOpen, onClose, data }: PurchaseDetailModalProps) {
    const [isClosing, setIsClosing] = useState(false);

    useEffect(() => {
        if (isOpen) {
            // Prevent scrolling on body when modal is open
            document.body.style.overflow = 'hidden';
            setIsClosing(false);
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen && !isClosing) return null;

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => onClose(), 200); // Wait for animation
    };

    if (!data) return null;

    const id = data['Yc.m.hàng'];
    const code = data['Vật tư'];
    const name = data['Văn bản ngắn'];
    const status = data['T.trg xử lý'];
    const isApproved = status?.toUpperCase().includes('ĐÃ DUYỆT');

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4">
            <div 
                className={cn(
                    "fixed inset-0 bg-black/40 transition-opacity duration-200",
                    isClosing ? "opacity-0" : "opacity-100"
                )}
                onClick={handleClose} 
            />
            
            <div 
                className={cn(
                    "relative w-full sm:w-[800px] bg-white sm:rounded-xl rounded-t-xl shadow-2xl flex flex-col max-h-[90vh] transition-transform duration-200",
                    isClosing ? "translate-y-full sm:translate-y-4 sm:scale-95" : "translate-y-0 sm:scale-100"
                )}
            >
                {/* Header */}
                <div className="flex justify-between items-center px-4 py-3 border-b border-gray-100 bg-gray-50/50 sm:rounded-t-xl rounded-t-xl shrink-0">
                    <h3 className="font-bold text-gray-800 text-base uppercase tracking-wide">Chi tiết yêu cầu</h3>
                    <button 
                        onClick={handleClose}
                        className="p-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-500 transition-colors"
                    >
                        <X size={18} strokeWidth={2.5} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex flex-col sm:flex-row p-4 gap-4">
                    
                    {/* Image Area (Left/Top Half) */}
                    <div className="w-full sm:w-1/2 h-[160px] sm:h-auto sm:min-h-[250px] bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 shrink-0">
                        <ImageIcon size={32} className="mb-2 opacity-40" strokeWidth={1.5} />
                        <span className="text-[13px] font-medium">Khu vực ảnh vật tư</span>
                    </div>

                    {/* Details Area (Right/Bottom Half) */}
                    <div className="w-full sm:w-1/2 flex flex-col flex-1">
                        <div className="mb-3 flex justify-between items-start gap-2">
                            <h4 className="text-[15px] font-bold text-[#2d4373] leading-snug line-clamp-2">
                                {name || 'Vật tư không tên'}
                            </h4>
                            {status && (
                                <span
                                    className={cn(
                                    "px-2 py-1 rounded-full text-[10px] font-bold tracking-wider text-white inline-flex items-center gap-1 shadow-sm shrink-0",
                                    (status.trim() === '3' || status.trim() === '03') ? "bg-yellow-500" :
                                    (status.trim() === '5' || status.trim() === '05') ? "bg-green-500" :
                                    (status.trim() === '8' || status.trim() === '08') ? "bg-red-500" :
                                    isApproved ? "bg-[#529b55]" : "bg-[#4a89dc]"
                                )}
                                >
                                    {isApproved && <Check size={12} strokeWidth={3} />}
                                    {status.toUpperCase()}
                                </span>
                            )}
                        </div>

                        <div className="bg-gray-50/50 rounded-lg p-3 border border-gray-100 mb-4 flex-1">
                            <DetailRow label="Mã YC" value={id} />
                            <DetailRow label="Vật Tư" value={code} />
                            <DetailRow label="SL" value={data['Số lượng']} />
                            <DetailRow label="Người YC" value={data['Ng.yêu cầu']} />
                            <DetailRow label="Ngày YC" value={data['Ngày YC']} />
                            <DetailRow label="P.Xưởng" value={data['TAG-NAME']} />
                        </div>
                        
                        <button
                            onClick={handleClose}
                            className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-colors shrink-0 text-sm"
                        >
                            Đóng
                        </button>
                    </div>
                </div>
                
                {/* Footer safe area for mobile */}
                <div className="h-2 sm:h-0 shrink-0" />
            </div>
        </div>
    );
}

function DetailRow({ label, value }: { label: string; value: string | undefined }) {
    if (!value) return null;
    return (
        <div className="flex justify-between items-center py-1.5 border-b border-gray-100/50 last:border-0 last:pb-0 first:pt-0">
            <span className="text-[11px] text-gray-500 font-bold uppercase tracking-wider">{label}</span>
            <span className="text-[13px] font-semibold text-gray-800 text-right truncate max-w-[65%]">{value}</span>
        </div>
    );
}
