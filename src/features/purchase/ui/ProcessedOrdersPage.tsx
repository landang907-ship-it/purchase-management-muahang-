import { useEffect, useState, useMemo } from 'react';
import { useTranslation } from '@/i18n/useTranslation';
import { type ProcessedOrder, fetchProcessedOrders } from '../services/processedOrdersService';
import { Header } from './Header';
import { FileText, Clock, ArrowLeft, Factory } from 'lucide-react';
import { RightTaskBar } from '@/features/layout/ui/RightTaskBar';
import { useNavigate } from 'react-router-dom';
import { WorkshopFilter } from '@/features/purchase/ui/WorkshopFilter';
import { useWorkshopConfig } from '@/features/purchase/hooks/useWorkshopConfig';
import { useAuth } from '@/features/auth/hooks/useAuth';

export function ProcessedOrdersPage() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { user } = useAuth();
    const userId = user?.user;
    
    const [orders, setOrders] = useState<ProcessedOrder[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                const data = await fetchProcessedOrders();
                setOrders(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const { workshops } = useWorkshopConfig(userId);

    const [selectedWorkshops, setSelectedWorkshops] = useState<string[]>(() => {
        try {
            const raw = localStorage.getItem('purchase_selected_workshops');
            if (raw) {
                const parsed = JSON.parse(raw);
                if (Array.isArray(parsed)) return parsed;
            }
        } catch {}
        return [];
    });

    useEffect(() => {
        try {
            localStorage.setItem('purchase_selected_workshops', JSON.stringify(selectedWorkshops));
        } catch {}
    }, [selectedWorkshops]);

    const workshopOptions = useMemo(() => workshops.map((w) => w.name), [workshops]);

    const workshopToTagsMap = useMemo(() => {
        const map: Record<string, string[]> = {};
        for (const w of workshops) {
            map[w.name] = w.tagValues;
        }
        return map;
    }, [workshops]);

    const visibleOrders = useMemo(() => {
        if (selectedWorkshops.length === 0) return [];

        const tagSet = new Set<string>();
        for (const wsName of selectedWorkshops) {
            const tags = workshopToTagsMap[wsName] || [];
            for (const tag of tags) {
                tagSet.add(tag);
            }
        }

        return orders.filter(o => tagSet.has((o.tag_name ?? '').trim()));
    }, [orders, selectedWorkshops, workshopToTagsMap]);

    return (
        <div className="flex flex-col h-[100dvh] bg-slate-50 overflow-hidden">
            <Header />
            
            {/* Layout: Main content (TaskBar from layout/ overlays the left side) */}
            <div
                className="absolute inset-x-0 bottom-0 flex"
                style={{ top: 'calc(env(safe-area-inset-top, 0px) + 56px)' }}
            >
                <RightTaskBar mobileActions={
                    <>
                        <button onClick={() => navigate('/dashboard')} className="flex items-center gap-3 w-full h-8 px-3 rounded-md hover:bg-yellow-100 text-gray-800 transition-colors">
                            <ArrowLeft size={16} strokeWidth={2} className="text-blue-500 shrink-0" />
                            <span className="text-sm font-medium">{t('sidebar.home' as any)}</span>
                        </button>
                    </>
                } />
                
                <main className="flex-1 flex flex-col overflow-auto bg-[#f4f7ff] p-4 md:p-6" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
                    <div className="max-w-6xl mx-auto space-y-6 w-full">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                    <FileText size={20} />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-slate-800">{t('sidebar.processed_orders' as any)}</h1>
                                    <p className="text-slate-500">{t('processed.subtitle' as any)}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => navigate('/dashboard')}
                                className="hidden md:flex items-center gap-2 px-4 py-2 bg-white text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg shadow-sm border border-slate-200 transition-colors"
                            >
                                <ArrowLeft size={16} />
                                <span>{t('processed.back_home' as any)}</span>
                            </button>
                        </div>

                        {/* Action Bar */}
                        <div className="bg-white px-3 py-2 flex items-center justify-between gap-4 border border-slate-200 rounded-xl shadow-sm z-20 overflow-x-auto scrollbar-hide">
                            <div className="shrink-0 min-w-[200px]">
                                <WorkshopFilter
                                    options={workshopOptions}
                                    value={selectedWorkshops}
                                    onChange={setSelectedWorkshops}
                                />
                            </div>
                        </div>

                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        {loading ? (
                            <div className="p-8 text-center text-slate-500">{t('processed.loading' as any)}</div>
                        ) : selectedWorkshops.length === 0 ? (
                            <div className="p-12 flex flex-col items-center justify-center text-slate-500">
                                <Factory size={48} className="mb-4 text-slate-300" />
                                <p className="text-lg">{t('noresults.tab' as any)}</p>
                            </div>
                        ) : visibleOrders.length === 0 ? (
                            <div className="p-12 flex flex-col items-center justify-center text-slate-500">
                                <FileText size={48} className="mb-4 text-slate-300" />
                                <p className="text-lg">{t('processed.empty.title' as any)}</p>
                                <p className="text-sm mt-1 text-slate-400">{t('processed.empty.subtitle' as any)}</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="text-xs text-slate-600 bg-slate-50 border-b border-slate-200 uppercase">
                                        <tr>
                                            <th className="px-4 py-3">{t('col.Yc.m.hàng' as any)}</th>
                                            <th className="px-4 py-3">{t('col.Vật tư' as any)}</th>
                                            <th className="px-4 py-3">{t('col.Văn bản ngắn' as any)}</th>
                                            <th className="px-4 py-3">{t('col.Ng.yêu cầu' as any)}</th>
                                            <th className="px-4 py-3 text-right">{t('col.Số lượng' as any)}</th>
                                            <th className="px-4 py-3">{t('processed.col.status' as any)}</th>
                                            <th className="px-4 py-3 text-right">{t('processed.col.disappear_time' as any)}</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {visibleOrders.map((order) => (
                                            <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                                                <td className="px-4 py-3 font-medium text-slate-900">{order.pr_number}</td>
                                                <td className="px-4 py-3 text-slate-600">{order.item_no}</td>
                                                <td className="px-4 py-3 text-slate-600 max-w-xs truncate" title={order.description || ''}>
                                                    {order.description}
                                                </td>
                                                <td className="px-4 py-3 text-slate-600">{order.requester}</td>
                                                <td className="px-4 py-3 text-right font-medium text-slate-700">
                                                    {order.quantity} {order.unit}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                                        {order.status || '05'}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-right text-slate-500 whitespace-nowrap">
                                                    <div className="flex items-center justify-end gap-1.5">
                                                        <Clock size={14} className="text-slate-400" />
                                                        {new Date(order.disappeared_at).toLocaleString('vi-VN')}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
