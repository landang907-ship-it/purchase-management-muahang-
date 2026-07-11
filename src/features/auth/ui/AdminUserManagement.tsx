import { useEffect, useState } from 'react';
import { getAllProfiles, updateUserRole, type UserProfile } from '@/features/auth/services/profile.service';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { Header } from '@/features/purchase/ui/Header';
import { RightTaskBar } from '@/features/layout/ui/RightTaskBar';

export function AdminUserManagement() {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [profiles, setProfiles] = useState<UserProfile[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchProfiles = async () => {
        setLoading(true);
        const data = await getAllProfiles();
        setProfiles(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchProfiles();
    }, []);

    const handleRoleChange = async (userName: string, newRole: 'admin' | 'user') => {
        if (confirm(`Bạn có chắc muốn đổi quyền của user "${userName}" thành "${newRole}"?`)) {
            const success = await updateUserRole(userName, newRole);
            if (success) {
                alert('Cập nhật quyền thành công');
                fetchProfiles(); // reload data
            } else {
                alert('Cập nhật thất bại. Kiểm tra lại kết nối.');
            }
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="relative h-screen w-full overflow-hidden bg-blue-dark">
            <Header
                userLabel={user?.user}
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
                    <div className="max-w-6xl mx-auto w-full p-6 bg-white rounded-lg shadow border border-gray-200">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold">Quản Lý Người Dùng</h2>
                            <button onClick={() => navigate('/')} className="text-blue-600 font-medium hover:underline">
                                Quay lại Trang Chủ
                            </button>
                        </div>

            {loading ? (
                <div className="text-center py-10">Đang tải danh sách...</div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 border">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tài khoản</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên hiển thị</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phân xưởng</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quyền (Role)</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày tạo</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {profiles.map((profile) => (
                                <tr key={profile.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{profile.user}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{profile.display_name || '-'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{profile.department || '-'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${profile.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'}`}>
                                            {profile.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(profile.created_at).toLocaleDateString('vi-VN')}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <select 
                                            value={profile.role} 
                                            onChange={(e) => handleRoleChange(profile.user, e.target.value as 'admin' | 'user')}
                                            className="block w-full pl-3 pr-10 py-1 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md border"
                                        >
                                            <option value="user">User</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
                    </div>
                </main>
                <RightTaskBar
                    onImport={() => navigate('/')}
                    onLogout={handleLogout}
                    onProfile={() => navigate('/profile')}
                />
            </div>
        </div>
    );
}
