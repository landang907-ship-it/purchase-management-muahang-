import { useEffect, useState, useMemo } from 'react';
import { getAllProfiles, updateUserRole, type UserProfile } from '@/features/auth/services/profile.service';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { Header } from '@/features/purchase/ui/Header';
import { RightTaskBar } from '@/features/layout/ui/RightTaskBar';
import { Search, Shield, User as UserIcon, Calendar, ArrowLeft, Loader2, ShieldCheck } from 'lucide-react';

export function AdminUserManagement() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [profiles, setProfiles] = useState<UserProfile[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

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
                // Update locally without reloading
                setProfiles(prev => prev.map(p => p.user === userName ? { ...p, role: newRole } : p));
            } else {
                alert('Cập nhật thất bại. Kiểm tra lại kết nối.');
            }
        }
    };

    const filteredProfiles = useMemo(() => {
        return profiles.filter(p => 
            p.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (p.display_name && p.display_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (p.department && p.department.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    }, [profiles, searchTerm]);

    return (
        <div className="relative h-screen w-full overflow-hidden bg-blue-dark">
            <Header userLabel={user?.user} />

            <div
                className="absolute inset-x-0 bottom-0 flex"
                style={{ top: 'calc(env(safe-area-inset-top, 0px) + 56px)' }}
            >
                <RightTaskBar />
                <main
                    className="flex-1 flex flex-col overflow-y-auto p-4 md:p-8 bg-[#f4f7ff]"
                    style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
                >
                    <div className="max-w-6xl mx-auto w-full flex flex-col h-full gap-6">
                        
                        {/* Header Section */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                                    <ShieldCheck className="text-blue-600" size={28} />
                                    Quản Lý Người Dùng
                                </h1>
                                <p className="text-slate-500 mt-1">Phân quyền và quản lý thông tin các tài khoản trong hệ thống</p>
                            </div>
                            <button 
                                onClick={() => navigate('/')} 
                                className="flex items-center gap-2 text-sm font-medium text-slate-600 bg-white px-4 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 hover:text-blue-600 transition-colors shadow-sm self-start md:self-auto"
                            >
                                <ArrowLeft size={16} />
                                Trang Chủ
                            </button>
                        </div>

                        {/* Search and Filters */}
                        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex items-center shrink-0">
                            <div className="relative w-full max-w-md">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Search className="text-slate-400" size={18} />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Tìm kiếm theo tài khoản, tên, phân xưởng..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg bg-slate-50 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 focus:bg-white transition-colors text-sm"
                                />
                            </div>
                            <div className="ml-auto text-sm text-slate-500 font-medium">
                                Tổng cộng: <span className="text-blue-600 font-bold">{filteredProfiles.length}</span> tài khoản
                            </div>
                        </div>

                        {/* Content Area */}
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex-1 overflow-hidden flex flex-col">
                            {loading ? (
                                <div className="p-8 flex flex-col items-center justify-center text-slate-400 flex-1 gap-3">
                                    <Loader2 className="animate-spin text-blue-500" size={32} />
                                    <p>Đang tải dữ liệu người dùng...</p>
                                </div>
                            ) : filteredProfiles.length === 0 ? (
                                <div className="p-12 flex flex-col items-center justify-center text-slate-400 flex-1 text-center">
                                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                                        <UserIcon size={32} className="text-slate-300" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-slate-700 mb-1">Không tìm thấy tài khoản</h3>
                                    <p className="text-sm">Thử thay đổi từ khóa tìm kiếm của bạn.</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto flex-1">
                                    <table className="min-w-full divide-y divide-slate-200">
                                        <thead className="bg-slate-50 sticky top-0 z-10">
                                            <tr>
                                                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Tài khoản</th>
                                                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Thông tin</th>
                                                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Phân xưởng</th>
                                                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Quyền hạn</th>
                                                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Thao tác</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-slate-100">
                                            {filteredProfiles.map((profile) => (
                                                <tr key={profile.id} className="hover:bg-slate-50/50 transition-colors">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center gap-3">
                                                            <div className="h-10 w-10 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-700 shrink-0">
                                                                <span className="font-bold text-sm">{profile.user.charAt(0).toUpperCase()}</span>
                                                            </div>
                                                            <div className="flex flex-col">
                                                                <span className="text-sm font-bold text-slate-900">{profile.user}</span>
                                                                <span className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                                                                    <Calendar size={12} />
                                                                    {new Date(profile.created_at).toLocaleDateString('vi-VN')}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className="text-sm font-medium text-slate-700">{profile.display_name || <span className="text-slate-400 italic">Chưa cập nhật</span>}</span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                                                            {profile.department || 'N/A'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${
                                                            profile.role === 'admin' 
                                                            ? 'bg-purple-50 text-purple-700 border-purple-200' 
                                                            : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                                        }`}>
                                                            {profile.role === 'admin' ? <Shield size={12} /> : <UserIcon size={12} />}
                                                            {profile.role === 'admin' ? 'Quản trị viên' : 'Nhân viên'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                                        <div className="flex items-center gap-2">
                                                            <button
                                                                onClick={() => handleRoleChange(profile.user, 'user')}
                                                                disabled={profile.role === 'user'}
                                                                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                                                                    profile.role === 'user' 
                                                                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed opacity-50' 
                                                                    : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 hover:text-emerald-600 shadow-sm'
                                                                }`}
                                                            >
                                                                Set User
                                                            </button>
                                                            <button
                                                                onClick={() => handleRoleChange(profile.user, 'admin')}
                                                                disabled={profile.role === 'admin'}
                                                                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                                                                    profile.role === 'admin' 
                                                                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed opacity-50' 
                                                                    : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 hover:text-purple-600 shadow-sm'
                                                                }`}
                                                            >
                                                                Set Admin
                                                            </button>
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
