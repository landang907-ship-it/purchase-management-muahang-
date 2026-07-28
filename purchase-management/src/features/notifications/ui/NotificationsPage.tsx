import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Flame, Clock, Image as ImageIcon, Lightbulb } from 'lucide-react';
import { RightTaskBar } from '@/features/layout/ui/RightTaskBar';
import { Header } from '@/features/purchase/ui/Header';
import { useAuth } from '@/features/auth/hooks/useAuth';

const WORKSHOPS = [
    { id: 'all', label: 'Tß║Ñt cß║ú ph├ón x╞░ß╗ƒng' },
    { id: 'rice', label: 'X╞░ß╗ƒng B├ính Gß║ío - τ▒│µ₧£σÄé' },
    { id: 'candy', label: 'X╞░ß╗ƒng Kß║╣o τ│ûµ₧£σÄé' },
    { id: 'public', label: 'C├┤ng Vß╗Ñ σà¼σèí' },
];

export function NotificationsPage() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [selectedWorkshop, setSelectedWorkshop] = useState('all');
    const [activeTab, setActiveTab] = useState<'urgent' | 'overdue' | 'images'>('urgent');

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
                        {/* Page Header */}
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-red-500 shrink-0">
                                <Bell size={24} strokeWidth={2.2} />
                            </div>
                            <div>
                                <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                                    Th├┤ng b├ío
                                </h1>
                                <p className="text-sm font-semibold text-slate-500">
                                    Duyß╗çt c├íc y├¬u cß║ºu mua h├áng cß║ºn gß║Ñp
                                </p>
                            </div>
                        </div>

                        {/* Filter Card */}
                        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="flex items-center gap-1.5 text-xs font-bold text-slate-600 mr-2">
                                    <Lightbulb size={16} className="text-amber-500" />
                                    Lß╗ìc ph├ón x╞░ß╗ƒng:
                                </span>
                                {WORKSHOPS.map((ws) => (
                                    <button
                                        key={ws.id}
                                        type="button"
                                        onClick={() => setSelectedWorkshop(ws.id)}
                                        className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                                            selectedWorkshop === ws.id
                                                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                                                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                                        }`}
                                    >
                                        {ws.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Tabs Navigation */}
                        <div className="flex items-center gap-6 border-b border-slate-200/80 pt-2 px-1">
                            <button
                                type="button"
                                onClick={() => setActiveTab('urgent')}
                                className={`flex items-center gap-2 pb-3 text-sm font-bold transition-all border-b-2 cursor-pointer ${
                                    activeTab === 'urgent'
                                        ? 'border-red-500 text-red-600'
                                        : 'border-transparent text-slate-500 hover:text-slate-700'
                                }`}
                            >
                                <Flame size={18} className="text-red-500" />
                                Y├¬u cß║ºu cß║ºn gß║Ñp
                            </button>

                            <button
                                type="button"
                                onClick={() => setActiveTab('overdue')}
                                className={`flex items-center gap-2 pb-3 text-sm font-bold transition-all border-b-2 cursor-pointer ${
                                    activeTab === 'overdue'
                                        ? 'border-amber-500 text-amber-600'
                                        : 'border-transparent text-slate-500 hover:text-slate-700'
                                }`}
                            >
                                <Clock size={18} className="text-amber-500" />
                                Chß╗¥ duyß╗çt &gt; 10 ng├áy &amp; Tß╗½ chß╗æi
                                <span className="ml-1 inline-flex items-center justify-center rounded-full bg-amber-500 px-2 py-0.5 text-xs font-extrabold text-white">
                                    43
                                </span>
                            </button>

                            <button
                                type="button"
                                onClick={() => setActiveTab('images')}
                                className={`flex items-center gap-2 pb-3 text-sm font-bold transition-all border-b-2 cursor-pointer ${
                                    activeTab === 'images'
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-slate-500 hover:text-slate-700'
                                }`}
                            >
                                <ImageIcon size={18} className="text-emerald-500" />
                                X├íc nhß║¡n h├¼nh ß║únh linh kiß╗çn
                            </button>
                        </div>

                        {/* Content Area (Empty State) */}
                        <div className="flex flex-col items-center justify-center rounded-3xl border border-slate-200/80 bg-white py-20 px-4 text-center shadow-sm">
                            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-slate-50 text-slate-300">
                                <Bell size={36} strokeWidth={1.5} />
                            </div>
                            <p className="text-base font-bold text-slate-600">
                                Kh├┤ng c├│ th├┤ng b├ío mß╗¢i
                            </p>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
