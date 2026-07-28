import { RightTaskBar } from '@/features/layout/ui/RightTaskBar';
import { Header } from '@/features/purchase/ui/Header';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export function ProcessedOrdersPage() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    return (
        <div className="flex h-screen w-screen overflow-hidden bg-slate-50">
            <RightTaskBar />
            <div className="flex flex-1 flex-col overflow-hidden">
                <Header onImport={() => navigate('/system-orders')} onLogout={logout} userLabel={user?.user} />
                <main className="flex-1 overflow-y-auto p-6 pt-[72px]">
                    <div className="mx-auto max-w-5xl space-y-4">
                        <h1 className="text-2xl font-bold text-slate-800">Đơn hàng đã xử lý</h1>
                        <div className="rounded-2xl bg-white p-8 border border-slate-200 text-center text-slate-500">
                            Danh sách các đơn hàng đã hoàn tất đối soát và lưu trữ.
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
