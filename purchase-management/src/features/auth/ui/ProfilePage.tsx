import { RightTaskBar } from '@/features/layout/ui/RightTaskBar';
import { Header } from '@/features/purchase/ui/Header';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export function ProfilePage() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    return (
        <div className="flex h-screen w-screen overflow-hidden bg-slate-50">
            <RightTaskBar />
            <div className="flex flex-1 flex-col overflow-hidden">
                <Header onImport={() => navigate('/system-orders')} onLogout={logout} userLabel={user?.user} />
                <main className="flex-1 overflow-y-auto p-6 pt-[72px]">
                    <div className="mx-auto max-w-xl space-y-4">
                        <h1 className="text-2xl font-bold text-slate-800">Th├┤ng tin c├í nh├ón</h1>
                        <div className="rounded-2xl bg-white p-6 border border-slate-200 space-y-3">
                            <div>
                                <span className="text-xs text-slate-500 font-bold uppercase">T├ái khoß║ún</span>
                                <p className="text-base font-semibold text-slate-800">{user?.user || 'N/A'}</p>
                            </div>
                            <div>
                                <span className="text-xs text-slate-500 font-bold uppercase">Quyß╗ün hß║ín</span>
                                <p className="text-base font-semibold text-slate-800 capitalize">{user?.role || 'User'}</p>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
