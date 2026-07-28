import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileCheck, ArrowLeft, Sparkles, Home, Filter } from 'lucide-react';
import { RightTaskBar } from '@/features/layout/ui/RightTaskBar';
import { Header } from '@/features/purchase/ui/Header';
import { useAuth } from '@/features/auth/hooks/useAuth';

const WORKSHOPS = [
    { id: 'all', label: 'Tß║Ñt cß║ú' },
    { id: 'rice', label: 'X╞░ß╗ƒng B├ính Gß║ío - τ▒│µ₧£σÄé' },
    { id: 'candy', label: 'X╞░ß╗ƒng Kß║╣o τ│ûµ₧£σÄé' },
    { id: 'public', label: 'C├┤ng Vß╗Ñ σà¼σèí' },
];

export function ProcessedOrdersPage() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [selectedWorkshop, setSelectedWorkshop] = useState('all');

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
                        {/* Page Title & Back Button */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 shrink-0">
                                    <FileCheck size={24} strokeWidth={2.2} />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                                        ─É╞ín thu mua ─æang xß╗¡ l├╜
                                    </h1>
                                    <p className="text-xs font-semibold text-slate-500">
                                        Danh s├ích c├íc ─æ╞ín h├áng ─æ├ú biß║┐n mß║Ñt khß╗Åi file hß╗ç thß╗æng (─É├ú xß╗¡ l├╜ xong).
                                    </p>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={() => navigate('/dashboard')}
                                className="inline-flex items-center gap-2 rounded-2xl bg-white border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-700 shadow-sm hover:bg-slate-50 transition-all cursor-pointer"
                            >
                                <ArrowLeft size={16} />
                                Quay lß║íi trang chß╗º
                            </button>
                        </div>

                        {/* Filter Bar Card */}
                        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
                            <div className="flex flex-wrap items-center gap-3">
                                <div className="inline-flex items-center gap-1.5 rounded-xl bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-600 border border-blue-100">
                                    <Home size={14} />
                                    Ph├ón X╞░ß╗ƒng <span className="opacity-75">0/3</span>
                                </div>

                                {WORKSHOPS.map((ws) => (
                                    <button
                                        key={ws.id}
                                        type="button"
                                        onClick={() => setSelectedWorkshop(ws.id)}
                                        className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                                            selectedWorkshop === ws.id
                                                ? 'bg-blue-600 text-white shadow-sm'
                                                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                                        }`}
                                    >
                                        {ws.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Content Card */}
                        <div className="rounded-3xl border border-slate-200/80 bg-white p-10 shadow-sm text-center flex flex-col items-center space-y-6">
                            <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-sky-100 text-sky-600">
                                <Sparkles size={32} strokeWidth={2} />
                            </div>

                            <div className="max-w-2xl space-y-3">
                                <h3 className="text-xl font-bold text-slate-900">
                                    Theo d├╡i tiß║┐n ─æß╗Ö tß╗▒ ─æß╗Öng
                                </h3>
                                <p className="text-sm font-medium text-slate-600 leading-relaxed">
                                    Thuß║¡t to├ín th├┤ng minh sß║╜ tß╗▒ ─æß╗Öng so s├ính dß╗» liß╗çu giß╗»a 2 lß║ºn bß║ín nhß║¡p file Excel li├¬n tiß║┐p. Nß║┐u mß╗Öt ─æ╞ín h├áng tß╗½ng tß╗ôn tß║íi ß╗ƒ file c┼⌐ nh╞░ng kh├┤ng c├▓n xuß║Ñt hiß╗çn trong file mß╗¢i, V├Ç c├│ trß║íng th├íi cuß╗æi c├╣ng l├á &apos;05&apos;, hß╗ç thß╗æng sß║╜ kß║┐t luß║¡n ─æ╞ín h├áng ─æ├│ ─æ├ú ─æ╞░ß╗úc giß║úi quyß║┐t tr├¬n SAP v├á l╞░u trß╗» tß║íi ─æ├óy (c├íc ─æ╞ín c├│ trß║íng th├íi kh├íc nh╞░ 03, 08 sß║╜ bß╗ï loß║íi bß╗Å).
                                </p>
                            </div>

                            <div className="inline-flex items-center gap-2 rounded-2xl bg-sky-50 border border-sky-200/60 px-5 py-3 text-xs font-bold text-sky-700">
                                <Filter size={15} />
                                Vui l├▓ng chß╗ìn mß╗Öt hoß║╖c nhiß╗üu ph├ón x╞░ß╗ƒng ß╗ƒ bß╗Ö lß╗ìc ph├¡a tr├¬n ─æß╗â xem
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
