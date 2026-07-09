import { X, Check, Image as ImageIcon, Upload, Loader2 } from 'lucide-react';
import { cn } from '@/shared/lib/cn';
import type { PurchaseRow } from '@/features/purchase/services/excel';
import type { MaterialImageMap } from '@/features/purchase/services/materialService';
import { useEffect, useState, useRef } from 'react';
import { useTranslation } from '@/i18n/useTranslation';
import { compressAndUploadImage } from '@/features/purchase/services/imageService';
import { upsertMaterialImage } from '@/features/purchase/services/materialService';

interface PurchaseDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    data: PurchaseRow | null;
    materialImage: MaterialImageMap | null | undefined;
    onImageUploaded: (materialCode: string, thumbUrl: string, origUrl: string) => void;
}

export function PurchaseDetailModal({ isOpen, onClose, data, materialImage, onImageUploaded }: PurchaseDetailModalProps) {
    const { t } = useTranslation();
    const [isClosing, setIsClosing] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

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

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !code) return;

        try {
            setIsUploading(true);
            const { thumbUrl, origUrl } = await compressAndUploadImage(file, code);
            await upsertMaterialImage(code, thumbUrl, origUrl);
            onImageUploaded(code, thumbUrl, origUrl);
        } catch (error) {
            console.error(t('detail.errorTitle'), error);
            alert(t('detail.uploadError'));
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

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
                    <h3 className="font-bold text-gray-800 text-base uppercase tracking-wide">{t('detail.title')}</h3>
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
                    <div className="w-full sm:w-1/2 h-[200px] sm:h-auto sm:min-h-[250px] bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 shrink-0 relative overflow-hidden group">
                        {materialImage?.orig_url ? (
                            <img 
                                src={materialImage.orig_url} 
                                alt={name}
                                className="w-full h-full object-contain bg-white"
                            />
                        ) : (
                            <>
                                <ImageIcon size={32} className="mb-2 opacity-40" strokeWidth={1.5} />
                                <span className="text-[13px] font-medium">{t('detail.imageArea')}</span>
                            </>
                        )}
                        
                        {/* Upload Overlay */}
                        <div className={cn(
                            "absolute inset-0 bg-black/50 flex flex-col items-center justify-center transition-opacity",
                            materialImage?.orig_url ? "opacity-0 group-hover:opacity-100" : "opacity-100 hover:bg-black/60",
                            isUploading && "opacity-100 bg-black/60"
                        )}>
                            <input 
                                type="file" 
                                accept="image/*" 
                                className="hidden" 
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                disabled={isUploading || !code}
                            />
                            <button 
                                onClick={() => fileInputRef.current?.click()}
                                disabled={isUploading || !code}
                                className="px-4 py-2 bg-white text-gray-800 rounded-lg font-bold text-sm flex items-center gap-2 shadow-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
                            >
                                {isUploading ? (
                                    <>
                                        <Loader2 size={16} className="animate-spin" />
                                        {t('detail.uploading')}
                                    </>
                                ) : (
                                    <>
                                        <Upload size={16} />
                                        {materialImage?.orig_url ? t('detail.changeImage') : t('detail.uploadImage')}
                                    </>
                                )}
                            </button>
                            {!code && <span className="text-xs text-white/70 mt-2">{t('detail.noCode')}</span>}
                        </div>
                    </div>

                    {/* Details Area (Right/Bottom Half) */}
                    <div className="w-full sm:w-1/2 flex flex-col flex-1">
                        <div className="mb-3 flex justify-between items-start gap-2">
                            <h4 className="text-[15px] font-bold text-[#2d4373] leading-snug line-clamp-2">
                                {name || t('detail.unnamed')}
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
                            <DetailRow label={t('detail.id')} value={id} />
                            <DetailRow label={t('detail.material')} value={code} />
                            <DetailRow label={t('detail.qty')} value={data['Số lượng']} />
                            <DetailRow label={t('detail.requester')} value={data['Ng.yêu cầu']} />
                            <DetailRow label={t('detail.date')} value={data['Ngày YC']} />
                            <DetailRow label={t('detail.workshop')} value={data['TAG-NAME']} />
                        </div>
                        
                        <button
                            onClick={handleClose}
                            className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-colors shrink-0 text-sm"
                        >
                            {t('detail.close')}
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
