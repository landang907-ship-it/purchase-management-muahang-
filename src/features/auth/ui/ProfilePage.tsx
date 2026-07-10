import { useEffect, useState } from 'react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { getProfile, updateProfile } from '@/features/auth/services/profile.service';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/features/purchase/ui/Header';

export function ProfilePage() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [displayName, setDisplayName] = useState('');
    const [department, setDepartment] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    useEffect(() => {
        async function fetchProfile() {
            if (user?.user) {
                const data = await getProfile(user.user);
                if (data) {
                    setDisplayName(data.display_name || '');
                    setDepartment(data.department || '');
                }
            }
            setLoading(false);
        }
        fetchProfile();
    }, [user]);

    const handleSave = async () => {
        if (!user?.user) return;
        setSaving(true);
        const success = await updateProfile(user.user, {
            display_name: displayName,
            department: department,
            updated_at: new Date().toISOString()
        });
        setSaving(false);
        if (success) {
            setToastMessage('Cập nhật hồ sơ thành công');
        } else {
            setToastMessage('Cập nhật thất bại. Vui lòng thử lại.');
        }
        setTimeout(() => setToastMessage(''), 3000);
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (loading) {
        return (
            <div className="relative h-screen w-full flex items-center justify-center bg-[#f4f7ff]">
                <div className="text-center">Đang tải...</div>
            </div>
        );
    }

    return (
        <div className="relative h-screen w-full overflow-hidden bg-blue-dark">
            <Header
                onImport={() => navigate('/')}
                onLogout={handleLogout}
                userLabel={user?.user}
                onAdmin={user?.role === 'admin' ? () => navigate('/admin/users') : undefined}
            />

            <div
                className="absolute inset-x-0 bottom-0 flex"
                style={{ top: 'calc(env(safe-area-inset-top, 0px) + 56px)' }}
            >
                <main
                    className="flex-1 flex flex-col overflow-y-auto p-4 md:p-8"
                    style={{ 
                        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
                        backgroundImage: 'linear-gradient(rgba(240, 240, 240, 0.75), rgba(240, 240, 240, 0.75)), url(/login-bg.webp)',
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'center',
                        backgroundSize: 'cover'
                    }}
                >
                    <div className="max-w-2xl mx-auto w-full p-6 bg-white rounded-lg shadow border border-gray-200">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-800">Hồ Sơ Cá Nhân</h2>
                            <button onClick={() => navigate('/')} className="text-blue-600 font-medium hover:underline">
                                Quay lại Trang chủ
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Tài khoản (Tên đăng nhập)</label>
                                <input type="text" disabled value={user?.user || ''} className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm text-gray-600" />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Tên hiển thị</label>
                                <input 
                                    type="text" 
                                    value={displayName} 
                                    onChange={e => setDisplayName(e.target.value)}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" 
                                    placeholder="Nhập tên hiển thị"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Phân xưởng</label>
                                <input 
                                    type="text" 
                                    value={department} 
                                    onChange={e => setDepartment(e.target.value)}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" 
                                    placeholder="Nhập phân xưởng"
                                />
                            </div>

                            <div className="pt-6 flex items-center justify-between">
                                <button 
                                    onClick={handleSave} 
                                    disabled={saving}
                                    className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-sm"
                                >
                                    {saving ? 'Đang lưu...' : 'Lưu Thay Đổi'}
                                </button>
                            </div>
                        </div>
                        
                        {toastMessage && (
                            <div className={`mt-6 p-4 rounded-lg text-center font-medium ${toastMessage.includes('thành công') ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
                                {toastMessage}
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}
