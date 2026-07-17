import { useEffect, useState } from 'react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { getProfile, updateProfile, deleteAccount } from '@/features/auth/services/profile.service';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/features/purchase/ui/Header';
import { RightTaskBar } from '@/features/layout/ui/RightTaskBar';

export function ProfilePage() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [displayName, setDisplayName] = useState('');
    const [department, setDepartment] = useState('');
    const [newUsername, setNewUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
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
                    setNewUsername(data.user || '');
                }
            }
            setLoading(false);
        }
        fetchProfile();
    }, [user]);

    const handleSave = async () => {
        if (!user?.user) return;

        if (password && password !== confirmPassword) {
            setToastMessage('Mật khẩu xác nhận không khớp');
            setTimeout(() => setToastMessage(''), 3000);
            return;
        }

        if (password && password.length < 4) {
            setToastMessage('Mật khẩu phải có ít nhất 4 ký tự');
            setTimeout(() => setToastMessage(''), 3000);
            return;
        }

        if (newUsername.trim().length < 3) {
            setToastMessage('Tài khoản phải có ít nhất 3 ký tự');
            setTimeout(() => setToastMessage(''), 3000);
            return;
        }

        setSaving(true);

        const updates: any = {
            display_name: displayName,
            department: department,
            updated_at: new Date().toISOString()
        };

        if (newUsername.trim() !== user.user) {
            updates.user = newUsername.trim();
        }

        if (password) {
            const { hashPassword } = await import('@/features/auth/services/authService');
            updates.password = await hashPassword(password);
        }

        const result = await updateProfile(user.user, updates);
        setSaving(false);
        if (result.success) {
            setToastMessage('Cập nhật hồ sơ thành công');
            if (updates.user && updates.user !== user.user) {
                // Update local session
                logout();
                navigate('/login');
                return;
            }
            setPassword('');
            setConfirmPassword('');
        } else {
            setToastMessage(`Cập nhật thất bại: ${result.error}`);
        }
        setTimeout(() => setToastMessage(''), 5000);
    };

    const handleDelete = async () => {
        if (!user?.user) return;
        
        if (window.confirm('Bạn có chắc chắn muốn xóa tài khoản này không? Hành động này không thể hoàn tác!')) {
            setSaving(true);
            const result = await deleteAccount(user.user);
            setSaving(false);
            
            if (result.success) {
                alert('Xóa tài khoản thành công.');
                logout();
                navigate('/login');
            } else {
                setToastMessage(`Xóa tài khoản thất bại: ${result.error}`);
                setTimeout(() => setToastMessage(''), 5000);
            }
        }
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
                userLabel={user?.user}
            />

            <div
                className="absolute inset-x-0 bottom-0 flex"
                style={{ top: 'calc(env(safe-area-inset-top, 0px) + 56px)' }}
            >
                <RightTaskBar />
                <main
                    className="flex-1 flex flex-col overflow-y-auto p-4 md:p-8 bg-[#f4f7ff]"
                    style={{ 
                        paddingBottom: 'env(safe-area-inset-bottom, 0px)'
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
                                <input 
                                    type="text" 
                                    value={newUsername}
                                    onChange={e => setNewUsername(e.target.value)}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" 
                                    placeholder="Nhập tên đăng nhập mới"
                                />
                                <p className="text-xs text-gray-500 mt-1">Lưu ý: Bạn sẽ phải đăng nhập lại nếu đổi tên đăng nhập.</p>
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
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Đổi mật khẩu (Bỏ trống nếu không đổi)</label>
                                <input 
                                    type="password" 
                                    value={password} 
                                    onChange={e => setPassword(e.target.value)}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" 
                                    placeholder="Nhập mật khẩu mới"
                                />
                            </div>

                            {password && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Xác nhận mật khẩu</label>
                                    <input 
                                        type="password" 
                                        value={confirmPassword} 
                                        onChange={e => setConfirmPassword(e.target.value)}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" 
                                        placeholder="Nhập lại mật khẩu mới"
                                    />
                                </div>
                            )}

                            <div className="pt-6 flex flex-col sm:flex-row items-center gap-4 justify-between border-t border-gray-100 mt-4">
                                <button 
                                    onClick={handleSave} 
                                    disabled={saving}
                                    className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-sm"
                                >
                                    {saving ? 'Đang xử lý...' : 'Lưu Thay Đổi'}
                                </button>
                                
                                <button 
                                    onClick={handleDelete} 
                                    disabled={saving}
                                    className="w-full sm:w-auto px-6 py-2.5 bg-red-50 text-red-600 font-medium rounded-lg hover:bg-red-100 disabled:opacity-50 transition-colors shadow-sm border border-red-200"
                                >
                                    Xóa Tài Khoản
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
                <RightTaskBar />
            </div>
        </div>
    );
}
