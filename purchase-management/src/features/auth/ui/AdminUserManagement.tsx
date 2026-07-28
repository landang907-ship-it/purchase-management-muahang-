import { RightTaskBar } from '@/features/layout/ui/RightTaskBar';
import { Header } from '@/features/purchase/ui/Header';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export function AdminUserManagement() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    return (
        <div className="flex h-screen w-screen overflow-hidden bg-slate-50">
            <RightTaskBar />
            <div className="flex flex-1 flex-col overflow-hidden">
                <Header onImport={() => navigate('/system-orders')} onLogout={logout} userLabel={user?.user} />
                <main className="flex-1 overflow-y-auto p-6 pt-[72px]">
                    <div className="mx-auto max-w-5xl space-y-4">
                        <h1 className="text-2xl font-bold text-slate-800">Quản lý người dùng Admin</h1>
                        <div className="rounded-2xl bg-white p-8 border border-slate-200 text-center text-slate-500">
                            Quản lý phân quyền và tài khoản truy cập hệ thống.
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
