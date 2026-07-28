import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Search } from 'lucide-react';
import { RightTaskBar } from '@/features/layout/ui/RightTaskBar';
import { Header } from '@/features/purchase/ui/Header';
import { useAuth } from '@/features/auth/hooks/useAuth';

export function MaterialCodePage() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [query, setQuery] = useState('');

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
                        {/* Page Title & Count Pill */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600 shrink-0">
                                    <FileText size={20} strokeWidth={2.2} />
                                </div>
                                <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                                    Quß║ún l├╜ m├ú vß║¡t t╞░
                                </h1>
                            </div>

                            <div className="rounded-full bg-blue-50 border border-blue-200 px-4 py-1.5 text-xs font-bold text-blue-600">
                                Tß╗òng sß╗æ: <span className="font-black text-blue-700">13507</span>
                            </div>
                        </div>

                        {/* Search Card Container */}
                        <div className="rounded-3xl border border-slate-200/80 bg-white p-8 shadow-sm space-y-12">
                            {/* Search Input Field */}
                            <div className="relative max-w-md">
                                <Search
                                    size={18}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                                />
                                <input
                                    type="text"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="T├¼m kiß║┐m m├ú hoß║╖c t├¬n vß║¡t t╞░..."
                                    className="w-full rounded-2xl bg-slate-50 py-3 pl-11 pr-4 text-sm font-semibold text-slate-800 placeholder-slate-400 border border-slate-200 focus:bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                                />
                            </div>

                            {/* Ready to Search Empty State */}
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <div className="mb-4 inline-flex h-20 w-20 items-center justify-center rounded-full bg-sky-50 text-sky-400">
                                    <Search size={44} strokeWidth={1.8} />
                                </div>
                                <h3 className="text-lg font-bold text-slate-800 mb-2">
                                    Sß║╡n s├áng t├¼m kiß║┐m
                                </h3>
                                <p className="max-w-md text-sm font-medium text-slate-500 leading-relaxed">
                                    Vui l├▓ng g├╡ m├ú hoß║╖c t├¬n v├áo ├┤ t├¼m kiß║┐m ph├¡a tr├¬n ─æß╗â hiß╗ân thß╗ï danh s├ích vß║¡t t╞░.
                                </p>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
