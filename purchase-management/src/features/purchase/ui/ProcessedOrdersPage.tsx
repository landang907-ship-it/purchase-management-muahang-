import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileCheck, ArrowLeft, Sparkles, Home, Filter } from 'lucide-react';
import { RightTaskBar } from '@/features/layout/ui/RightTaskBar';
import { Header } from '@/features/purchase/ui/Header';
import { useAuth } from '@/features/auth/hooks/useAuth';

const WORKSHOPS = [
    { id: 'all', label: 'Tất cả' },
    { id: 'rice', label: 'Xưởng Bánh Gạo - 米果厂' },
    { id: 'candy', label: 'Xưởng Kẹo 糖果厂' },
    { id: 'public', label: 'Công Vụ 公务' },
];

export function ProcessedOrdersPage() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [selectedWorkshop, setSelectedWorkshop] = useState('all');

    return (
        <div className="flex h-screen w-screen overflow-hidden bg-[#f4f7ff]">
            {/* Left Sidebar */}
            <RightTaskBar />

            {/* Main Area */}
            <div className="flex flex-1 flex-col overflow-hidden">
                {/* Header */}
                <Header
                    onImport={() => navigate('/system-orders')}
                    onLogout={logout}
                    userLabel={user?.user || 'admin123'}
                />

                {/* Main Content */}
                <main className="flex-1 overflow-y-auto px-6 py-8 md:px-12 pt-[72px]">
                    <div className="mx-auto max-w-5xl space-y-6">
                        {/* Page Title & Back Button */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 shrink-0">
                                    <FileCheck size={24} strokeWidth={2.2} />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                                        Đơn thu mua đang xử lý
                                    </h1>
                                    <p className="text-xs font-semibold text-slate-500">
                                        Danh sách các đơn hàng đã biến mất khỏi file hệ thống (Đã xử lý xong).
                                    </p>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={() => navigate('/dashboard')}
                                className="inline-flex items-center gap-2 rounded-2xl bg-white border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-700 shadow-sm hover:bg-slate-50 transition-all cursor-pointer"
                            >
                                <ArrowLeft size={16} />
                                Quay lại trang chủ
                            </button>
                        </div>

                        {/* Filter Bar Card */}
                        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
                            <div className="flex flex-wrap items-center gap-3">
                                <div className="inline-flex items-center gap-1.5 rounded-xl bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-600 border border-blue-100">
                                    <Home size={14} />
                                    Phân Xưởng <span className="opacity-75">0/3</span>
                                </div>

                                {WORKSHOPS.map((ws) => (
                                    <button
                                        key={ws.id}
                                        type="button"
                                        onClick={() => setSelectedWorkshop(ws.id)}
                                        className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                                            selectedWorkshop === ws.id
                                                ? 'bg-blue-600 text-white shadow-sm'
                                                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                                        }`}
                                    >
                                        {ws.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Content Card */}
                        <div className="rounded-3xl border border-slate-200/80 bg-white p-10 shadow-sm text-center flex flex-col items-center space-y-6">
                            <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-sky-100 text-sky-600">
                                <Sparkles size={32} strokeWidth={2} />
                            </div>

                            <div className="max-w-2xl space-y-3">
                                <h3 className="text-xl font-bold text-slate-900">
                                    Theo dõi tiến độ tự động
                                </h3>
                                <p className="text-sm font-medium text-slate-600 leading-relaxed">
                                    Thuật toán thông minh sẽ tự động so sánh dữ liệu giữa 2 lần bạn nhập file Excel liên tiếp. Nếu một đơn hàng từng tồn tại ở file cũ nhưng không còn xuất hiện trong file mới, VÀ có trạng thái cuối cùng là &apos;05&apos;, hệ thống sẽ kết luận đơn hàng đó đã được giải quyết trên SAP và lưu trữ tại đây (các đơn có trạng thái khác như 03, 08 sẽ bị loại bỏ).
                                </p>
                            </div>

                            <div className="inline-flex items-center gap-2 rounded-2xl bg-sky-50 border border-sky-200/60 px-5 py-3 text-xs font-bold text-sky-700">
                                <Filter size={15} />
                                Vui lòng chọn một hoặc nhiều phân xưởng ở bộ lọc phía trên để xem
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
