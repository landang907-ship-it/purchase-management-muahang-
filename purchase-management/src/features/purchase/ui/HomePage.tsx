import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Zap, ArrowRight } from 'lucide-react';
import { RightTaskBar } from '@/features/layout/ui/RightTaskBar';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useTranslation } from '@/i18n/useTranslation';
import { Header } from '@/features/purchase/ui/Header';

export function HomePage() {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const { t } = useTranslation();

    return (
        <div className="flex h-screen w-screen overflow-hidden bg-slate-50">
            {/* Left Sidebar */}
            <RightTaskBar />

            {/* Main Area */}
            <div className="flex flex-1 flex-col overflow-hidden">
                {/* Top Header */}
                <Header
                    onImport={() => navigate('/system-orders')}
                    onLogout={logout}
                    userLabel={user?.user}
                />

                {/* Dashboard Scrollable Content */}
                <main className="flex-1 overflow-y-auto px-6 py-10 md:px-12 lg:px-16 pt-[72px]">
                    <div className="mx-auto max-w-5xl space-y-10">
                        {/* Hero Header Section */}
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                            <div className="max-w-2xl space-y-3">
                                <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
                                    Quản lý Mua hàng{' '}
                                    <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                        Thế hệ mới
                                    </span>
                                </h1>
                                <p className="text-base md:text-lg text-slate-600 font-medium leading-relaxed">
                                    Tự động hóa đối soát, phân bổ thông minh và loại bỏ thao tác thủ công. Bức tranh toàn cảnh về quy trình cung ứng của bạn.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() => navigate('/system-orders')}
                                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-6 py-3.5 text-base font-bold text-white shadow-xl shadow-slate-900/20 hover:bg-slate-800 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer shrink-0"
                            >
                                Bắt đầu làm việc
                                <ArrowRight size={18} strokeWidth={2.5} />
                            </button>
                        </div>

                        {/* Feature Cards Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                            {/* Card 1: Tự động đối soát đơn hàng */}
                            <div className="flex flex-col justify-between rounded-3xl bg-white p-8 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
                                <div className="space-y-4">
                                    <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-100 text-sky-600">
                                        <CheckCircle2 size={28} strokeWidth={2.2} />
                                    </div>

                                    <h3 className="text-xl font-bold text-slate-900">
                                        Tự động đối soát đơn hàng
                                    </h3>

                                    <p className="text-sm text-slate-600 leading-relaxed">
                                        Thuật toán thông minh tự động dò tìm các đơn hàng đã được xử lý xong và biến mất khỏi báo cáo gốc. Quản lý tình trạng đơn hàng mà không cần rà soát thủ công.
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => navigate('/processed-orders')}
                                    className="mt-6 inline-flex items-center gap-1.5 text-sm font-bold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
                                >
                                    Xem danh sách đơn đã xử lý
                                    <ArrowRight size={15} strokeWidth={2.5} />
                                </button>
                            </div>

                            {/* Card 2: Nhập liệu siêu tốc */}
                            <div className="flex flex-col justify-between rounded-3xl bg-gradient-to-br from-indigo-600 via-purple-600 to-purple-700 p-8 text-white shadow-xl shadow-purple-600/20">
                                <div className="space-y-4">
                                    <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 text-white backdrop-blur-md">
                                        <Zap size={28} strokeWidth={2.2} />
                                    </div>

                                    <h3 className="text-xl font-bold text-white">
                                        Nhập liệu siêu tốc
                                    </h3>

                                    <p className="text-sm text-purple-100/90 leading-relaxed">
                                        Kéo thả file Excel xuất trực tiếp từ hệ thống SAP. Ứng dụng tự động bóc tách, lên màu và cấu trúc lại dữ liệu trong chớp mắt.
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => navigate('/system-orders')}
                                    className="mt-6 inline-flex items-center gap-1.5 text-sm font-bold text-white/90 hover:text-white hover:underline cursor-pointer"
                                >
                                    Đến trang Hệ Thống Mua Hàng
                                    <ArrowRight size={15} strokeWidth={2.5} />
                                </button>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
