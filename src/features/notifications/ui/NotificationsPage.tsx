import { useEffect, useState } from 'react';
import { useTranslation } from '@/i18n/useTranslation';
import { getPendingUrgentRequests, updateUrgentStatus, type PurchaseOrder } from '@/features/purchase/services/purchaseServiceV2';
import { Header } from '@/features/purchase/ui/Header';
import { RightTaskBar } from '@/features/layout/ui/RightTaskBar';
import { Bell, ArrowLeft, Check, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/hooks/useAuth';

export function NotificationsPage() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { user } = useAuth();
    
    const [orders, setOrders] = useState<PurchaseOrder[]>([]);
    const [loading, setLoading] = useState(true);

    const loadData = async () => {
        if (!user?.user) return;
        setLoading(true);
        try {
            const data = await getPendingUrgentRequests(user.user);
            setOrders(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [user?.user]);

    const handleApprove = async (order: PurchaseOrder) => {
        if (!user?.user) return;
        try {
            await updateUrgentStatus(
                user.user, 
                order.unique_order_key, 
                true, 
                'approved', 
                order.urgent_reason || undefined,
                order.urgent_image_url || undefined
            );
            // Remove from list
            setOrders(prev => prev.filter(o => o.unique_order_key !== order.unique_order_key));
            alert('Đã duyệt yêu cầu cần gấp!');
        } catch (err) {
            console.error(err);
            alert('Lỗi khi duyệt yêu cầu.');
        }
    };

    const handleReject = async (order: PurchaseOrder) => {
        if (!user?.user) return;
        if (!confirm('Bạn có chắc muốn từ chối yêu cầu cần gấp này?')) return;
        try {
            // Revert back to non-urgent
            await updateUrgentStatus(
                user.user, 
                order.unique_order_key, 
                false, 
                'pending'
            );
            setOrders(prev => prev.filter(o => o.unique_order_key !== order.unique_order_key));
            alert('Đã từ chối yêu cầu cần gấp!');
        } catch (err) {
            console.error(err);
            alert('Lỗi khi từ chối yêu cầu.');
        }
    };

    return (
        <div className="flex flex-col h-[100dvh] bg-slate-50 overflow-hidden">
            <Header />
            
            <div className="absolute inset-x-0 bottom-0 flex" style={{ top: 'calc(env(safe-area-inset-top, 0px) + 56px)' }}>
                <RightTaskBar mobileActions={
                    <button onClick={() => navigate('/dashboard')} className="flex items-center gap-3 w-full h-8 px-3 rounded-md hover:bg-yellow-100 text-gray-800 transition-colors">
                        <ArrowLeft size={16} strokeWidth={2} className="text-blue-500 shrink-0" />
                        <span className="text-sm font-medium">{t('sidebar.home' as any)}</span>
                    </button>
                } />
                
                <main className="flex-1 flex flex-col overflow-auto bg-[#f4f7ff] p-4 md:p-6">
                    <div className="max-w-4xl mx-auto space-y-6 w-full">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                                    <Bell size={20} />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-slate-800">{t('sidebar.notifications' as any)}</h1>
                                    <p className="text-slate-500">Duyệt các yêu cầu mua hàng cần gấp</p>
                                </div>
                            </div>
                        </div>

                        {loading ? (
                            <div className="p-8 text-center text-slate-500">Đang tải dữ liệu...</div>
                        ) : orders.length === 0 ? (
                            <div className="p-12 flex flex-col items-center justify-center text-slate-500 bg-white rounded-xl shadow-sm border border-slate-200">
                                <Bell size={48} className="mb-4 text-slate-300" />
                                <p className="text-lg">Không có thông báo mới</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {orders.map((order) => (
                                    <div key={order.unique_order_key} className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 flex flex-col">
                                        <div className="flex justify-between items-start mb-3">
                                            <div>
                                                <div className="text-xs text-slate-500 mb-1">{order.pr_number} • {order.tag_name}</div>
                                                <h3 className="font-bold text-slate-800 text-base">{order.item_no}</h3>
                                            </div>
                                            <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded font-bold uppercase">
                                                Cần gấp
                                            </span>
                                        </div>
                                        
                                        <div className="bg-slate-50 p-3 rounded-lg text-sm mb-4 flex-1">
                                            <div className="mb-2"><span className="text-slate-500">Văn bản ngắn:</span> <span className="font-medium text-slate-800">{order.description}</span></div>
                                            <div className="mb-2"><span className="text-slate-500">Người YC:</span> <span className="font-medium text-slate-800">{order.requester}</span></div>
                                            <div className="mb-2"><span className="text-slate-500">Lý do:</span> <span className="font-medium text-red-600">{order.urgent_reason}</span></div>
                                            {order.urgent_image_url && (
                                                <div className="mt-2">
                                                    <a href={order.urgent_image_url} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline text-xs">
                                                        📸 Xem ảnh đính kèm
                                                    </a>
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex gap-2">
                                            <button 
                                                onClick={() => handleReject(order)}
                                                className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg transition-colors flex items-center justify-center gap-2 text-sm"
                                            >
                                                <X size={16} /> Từ chối
                                            </button>
                                            <button 
                                                onClick={() => handleApprove(order)}
                                                className="flex-1 py-2 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2 text-sm shadow-sm"
                                            >
                                                <Check size={16} /> Phê duyệt
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}
