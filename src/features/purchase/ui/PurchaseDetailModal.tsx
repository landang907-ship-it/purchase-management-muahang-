import { X, Check, Image as ImageIcon, Upload, Loader2, AlertTriangle, FileText, Camera } from 'lucide-react';
import { cn } from '@/shared/lib/cn';
import type { PurchaseRow } from '@/features/purchase/services/excel';
import type { MaterialImageMap } from '@/features/purchase/services/materialService';
import { useEffect, useState, useRef } from 'react';
import { useTranslation } from '@/i18n/useTranslation';
import { compressAndUploadImage, uploadUrgentImage, deleteUrgentImage } from '@/features/purchase/services/imageService';
import { upsertMaterialImage } from '@/features/purchase/services/materialService';
import { updateUrgentStatus } from '@/features/purchase/services/purchaseServiceV2';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { formatStatusText, getStatusColorClass } from '../lib/status';

interface PurchaseDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    data: PurchaseRow | null;
    materialImage: MaterialImageMap | null | undefined;
    onImageUploaded: (materialCode: string, thumbUrl: string, origUrl: string) => void;
    onDataUpdated?: () => void; // Optional callback to refresh data
}

export function PurchaseDetailModal({ isOpen, onClose, data, materialImage, onImageUploaded, onDataUpdated }: PurchaseDetailModalProps) {
    const { t } = useTranslation();
    const { user } = useAuth();
    const [isClosing, setIsClosing] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const urgentFileInputRef = useRef<HTMLInputElement>(null);

    // Urgent form state
    const [urgentReason, setUrgentReason] = useState('');
    const [urgentFile, setUrgentFile] = useState<File | null>(null);
    const [isSubmittingUrgent, setIsSubmittingUrgent] = useState(false);
    const [urgentStatus, setUrgentStatus] = useState<'pending'|'approved'|'processing'|'completed'>('pending');

    useEffect(() => {
        if (isOpen && data) {
            document.body.style.overflow = 'hidden';
            setIsClosing(false);
            setUrgentReason(data.urgent_reason || '');
            setUrgentStatus(data.urgent_status || 'pending');
            setUrgentFile(null);
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, data]);

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
    const uniqueKey = `${id}_${code}`;

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

    const handleUrgentSubmit = async (newStatus?: 'pending' | 'approved' | 'processing' | 'completed') => {
        if (!user?.user) return;
        if (!urgentReason.trim()) {
            alert('Vui lòng nhập lý do cần gấp!');
            return;
        }
        if (!urgentFile && !data?.urgent_image_url) {
            alert('Vui lòng đính kèm hình ảnh minh họa cho yêu cầu cần gấp!');
            return;
        }

        try {
            const targetStatus = newStatus || urgentStatus;
            setIsSubmittingUrgent(true);
            let imageUrl = data.urgent_image_url;

            if (urgentFile) {
                // Upload and compress image specifically for urgent requests
                imageUrl = await uploadUrgentImage(urgentFile, uniqueKey);
            }

            await updateUrgentStatus(user.user, uniqueKey, true, targetStatus, urgentReason, imageUrl || undefined);
            
            // Mutate local data for immediate UI update
            data.is_urgent = true;
            data.urgent_status = targetStatus;
            data.urgent_reason = urgentReason;
            data.urgent_image_url = imageUrl;

            setUrgentStatus(targetStatus);

            if (onDataUpdated) onDataUpdated();
            
            alert('Đã gửi yêu cầu Cần gấp! Vui lòng chờ quản lý phân xưởng phê duyệt.');
        } catch (error) {
            console.error('Error submitting urgent request:', error);
            alert('Có lỗi xảy ra, vui lòng thử lại.');
        } finally {
            setIsSubmittingUrgent(false);
        }
    };

    const handleCancelUrgent = async () => {
        if (!user?.user) return;
        if (!confirm('Bạn có chắc muốn hủy cảnh báo khẩn này?')) return;
        if (!data) return;

        try {
            const uniqueKey = `${data['Yc.m.hàng']}_${data['Vật tư']}`;
            setIsSubmittingUrgent(true);
            
            await updateUrgentStatus(user.user, uniqueKey, false, 'pending');
            
            // Delete image from storage if it exists
            if (data.urgent_image_url) {
                await deleteUrgentImage(data.urgent_image_url);
            }
            
            // Mutate local data for immediate UI update
            data.is_urgent = false;
            data.urgent_status = 'pending';
            data.urgent_reason = '';
            data.urgent_image_url = null;

            setUrgentStatus('pending');
            setUrgentReason('');
            setUrgentFile(null);

            if (onDataUpdated) onDataUpdated();
            
            alert('Đã hủy trạng thái Cần gấp!');
        } catch (error) {
            console.error('Error canceling urgent request:', error);
            alert('Có lỗi xảy ra khi hủy, vui lòng thử lại.');
        } finally {
            setIsSubmittingUrgent(false);
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
                    <h3 className="font-bold text-gray-800 text-base uppercase tracking-wide flex items-center">
                        {t('detail.title')} 
                        {data.is_urgent && (!data.urgent_status || data.urgent_status === 'pending') && (
                            <span className="ml-2 inline-flex items-center gap-1 px-2 py-0.5 rounded bg-red-100 text-red-600 text-xs font-bold uppercase tracking-wide">
                                ⏳ Chờ duyệt khẩn
                            </span>
                        )}
                        {data.is_urgent && data.urgent_status === 'processing' && (
                            <span className="ml-2 inline-flex items-center gap-1 px-2 py-0.5 rounded bg-orange-100 text-orange-600 text-xs font-bold uppercase tracking-wide">
                                🚚 Đang mua gấp
                            </span>
                        )}
                        {data.is_urgent && data.urgent_status === 'approved' && (
                            <span className="ml-2 inline-flex items-center gap-1 px-2 py-0.5 rounded bg-green-100 text-green-600 text-xs font-bold uppercase tracking-wide">
                                ✅ Đã duyệt mua gấp
                            </span>
                        )}
                    </h3>
                    <button 
                        onClick={handleClose}
                        className="p-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-500 transition-colors"
                    >
                        <X size={18} strokeWidth={2.5} />
                    </button>
                </div>

                {/* Content (Scrollable if needed) */}
                <div className="flex flex-col p-4 gap-4 overflow-y-auto overflow-x-hidden scrollbar-thin">
                    
                    {/* Top Row: Image & Details */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        {/* Image Area (Left/Top Half) */}
                        <div className="w-full sm:w-1/2 h-[200px] sm:h-[250px] bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 shrink-0 relative overflow-hidden group">
                            {materialImage?.thumb_url ? (
                                <img 
                                    src={materialImage.thumb_url} 
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
                                        getStatusColorClass(status, isApproved)
                                    )}
                                    >
                                        {isApproved && <Check size={12} strokeWidth={3} />}
                                        {formatStatusText(status)}
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
                        </div>
                    </div>

                    {/* Urgent Section */}
                    <div className="mt-2 border-t border-red-100 pt-4 bg-red-50/30 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-3">
                            <AlertTriangle className="text-red-500" size={18} strokeWidth={2.5} />
                            <h4 className="font-bold text-red-700 text-sm">BÁO CÁO CẦN GẤP</h4>
                        </div>
                        
                        <div className="space-y-3">
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">
                                    Lý do cần gấp <span className="text-red-500">*</span>
                                </label>
                                <textarea 
                                    className="w-full text-sm p-2.5 rounded-lg border border-gray-200 focus:border-red-400 focus:ring-1 focus:ring-red-400 outline-none resize-none"
                                    rows={2}
                                    placeholder="Nhập lý do (VD: Máy đang dừng, cần thay thế gấp...)"
                                    value={urgentReason}
                                    onChange={(e) => setUrgentReason(e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">
                                    Hình ảnh vị trí hư hỏng (Tùy chọn, tối đa 5MB)
                                </label>
                                <div className="flex items-center gap-3">
                                    <input 
                                        type="file" 
                                        accept="image/*" 
                                        className="hidden" 
                                        ref={urgentFileInputRef}
                                        onChange={(e) => {
                                            if (e.target.files?.[0]) setUrgentFile(e.target.files[0]);
                                        }}
                                    />
                                    <button 
                                        onClick={() => urgentFileInputRef.current?.click()}
                                        className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2 shadow-sm"
                                    >
                                        <Camera size={16} />
                                        {urgentFile ? urgentFile.name : 'Chụp / Chọn ảnh'}
                                    </button>

                                    {/* Hiển thị link ảnh cũ nếu đã từng gửi */}
                                    {!urgentFile && data.urgent_image_url && (
                                        <a 
                                            href={data.urgent_image_url} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                                        >
                                            <FileText size={14} /> Xem ảnh đã tải lên
                                        </a>
                                    )}
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-2 mt-2">
                                <button 
                                    onClick={() => handleUrgentSubmit('pending')}
                                    disabled={isSubmittingUrgent}
                                    className={cn(
                                        "flex-1 py-2 font-bold rounded-lg transition-colors flex items-center justify-center gap-2 text-sm shadow-sm",
                                        urgentStatus === 'pending' && data.is_urgent
                                            ? "bg-red-500 hover:bg-red-600 text-white" 
                                            : "bg-red-50 hover:bg-red-100 text-red-600 border border-red-200"
                                    )}
                                >
                                    {isSubmittingUrgent && urgentStatus === 'pending' ? <Loader2 size={16} className="animate-spin" /> : null}
                                    {data.is_urgent ? "Cập nhật cảnh báo" : "🔥 Cảnh báo khẩn"}
                                </button>

                                {data.is_urgent && (
                                    <button
                                        onClick={handleCancelUrgent}
                                        disabled={isSubmittingUrgent}
                                        className="flex-1 py-2 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2 text-sm shadow-sm"
                                    >
                                        Hủy báo khẩn
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Footer close button */}
                <div className="p-4 border-t border-gray-100 shrink-0">
                    <button
                        onClick={handleClose}
                        className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-colors text-sm"
                    >
                        {t('detail.close')}
                    </button>
                </div>
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
