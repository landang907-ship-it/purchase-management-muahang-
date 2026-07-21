import { Header } from './Header';
import { RightTaskBar } from '@/features/layout/ui/RightTaskBar';
import { useNavigate } from 'react-router-dom';
import { motion, type Variants } from 'motion/react';
import { 
    Clock, 
    Network, 
    Image as ImageIcon, 
    Zap, 
    Smartphone, 
    ArrowRight,
    CheckCircle2,
    BarChart3
} from 'lucide-react';
import { useTranslation } from '@/i18n/useTranslation';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useDashboardData } from '@/features/purchase/hooks/useDashboardData';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#64748b'];
export function HomePage() {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { user } = useAuth();
    const { data: stats } = useDashboardData(user?.user);

    // Animation variants
    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
    };

    return (
        <div className="flex flex-col h-[100dvh] bg-slate-50 overflow-hidden">
            <Header />
            
            <div
                className="absolute inset-x-0 bottom-0 flex"
                style={{ top: 'calc(env(safe-area-inset-top, 0px) + 56px)' }}
            >
                <RightTaskBar />
                
                <main className="flex-1 overflow-auto bg-gradient-to-br from-slate-50 to-blue-50/50 p-4 md:p-8 lg:p-12" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 2rem)' }}>
                    <div className="max-w-6xl mx-auto w-full">
                        {/* Hero Section */}
                        <motion.div 
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 md:mb-16 gap-6"
                        >
                            <div>
                                <h1 className="text-3xl md:text-5xl font-extrabold text-slate-800 tracking-tight leading-tight">
                                    {t('home.hero.title')} <br/>
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">{t('home.hero.subtitle')}</span>
                                </h1>
                                <p className="mt-4 text-slate-500 max-w-xl text-lg">
                                    {t('home.hero.description')}
                                </p>
                            </div>
                            
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => navigate('/system-orders')}
                                className="group relative inline-flex items-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-2xl overflow-hidden shadow-xl shadow-slate-900/20 hover:shadow-2xl hover:shadow-blue-900/30 transition-all"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                <span className="relative font-bold text-lg">{t('home.hero.cta')}</span>
                                <ArrowRight className="relative group-hover:translate-x-1 transition-transform" />
                            </motion.button>
                        </motion.div>

                        {/* Analytics Dashboard Section */}
                        {stats && (
                            <motion.div 
                                variants={containerVariants}
                                initial="hidden"
                                animate="show"
                                className="mb-12"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                                    <motion.div variants={itemVariants} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex items-center gap-4">
                                        <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600">
                                            <Clock size={28} />
                                        </div>
                                        <div>
                                            <p className="text-slate-500 font-medium">Đang xử lý</p>
                                            <h3 className="text-3xl font-bold text-slate-800">{stats.activeCount}</h3>
                                        </div>
                                    </motion.div>
                                    <motion.div variants={itemVariants} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex items-center gap-4">
                                        <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600">
                                            <CheckCircle2 size={28} />
                                        </div>
                                        <div>
                                            <p className="text-slate-500 font-medium">Đã hoàn thành</p>
                                            <h3 className="text-3xl font-bold text-slate-800">{stats.processedCount}</h3>
                                        </div>
                                    </motion.div>
                                    <motion.div variants={itemVariants} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex items-center gap-4">
                                        <div className="w-14 h-14 rounded-2xl bg-purple-100 flex items-center justify-center text-purple-600">
                                            <Network size={28} />
                                        </div>
                                        <div>
                                            <p className="text-slate-500 font-medium">Người yêu cầu</p>
                                            <h3 className="text-3xl font-bold text-slate-800">{stats.topRequesters.length}</h3>
                                        </div>
                                    </motion.div>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {/* Pie Chart: Status */}
                                    <motion.div variants={itemVariants} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
                                        <h3 className="text-lg font-bold text-slate-800 mb-6">Trạng thái đơn hàng (Đang chờ)</h3>
                                        <div className="h-64 w-full">
                                            {stats.statusDistribution.length > 0 ? (
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <PieChart>
                                                        <Pie
                                                            data={stats.statusDistribution}
                                                            cx="50%"
                                                            cy="50%"
                                                            innerRadius={60}
                                                            outerRadius={80}
                                                            paddingAngle={5}
                                                            dataKey="value"
                                                        >
                                                            {stats.statusDistribution.map((entry, index) => {
                                                                const name = entry.name.toLowerCase();
                                                                let fill = COLORS[index % COLORS.length];
                                                                if (name.includes('chờ duyệt') || name.includes('đang')) fill = '#f59e0b';
                                                                else if (name.includes('đã duyệt') || name.includes('hoàn')) fill = '#10b981';
                                                                else if (name.includes('từ chối') || name.includes('hủy') || name.includes('quá hạn')) fill = '#ef4444';
                                                                else if (name.includes('khác')) fill = '#94a3b8';
                                                                
                                                                return <Cell key={`cell-${index}`} fill={fill} stroke="rgba(255,255,255,0.5)" strokeWidth={2} />;
                                                            })}
                                                        </Pie>
                                                        <Tooltip />
                                                    </PieChart>
                                                </ResponsiveContainer>
                                            ) : (
                                                <div className="h-full flex items-center justify-center text-slate-400">Không có dữ liệu</div>
                                            )}
                                        </div>
                                        <div className="flex flex-wrap justify-center gap-4 mt-4">
                                            {stats.statusDistribution.map((entry, index) => {
                                                const name = entry.name.toLowerCase();
                                                let fill = COLORS[index % COLORS.length];
                                                if (name.includes('chờ duyệt') || name.includes('đang')) fill = '#f59e0b';
                                                else if (name.includes('đã duyệt') || name.includes('hoàn')) fill = '#10b981';
                                                else if (name.includes('từ chối') || name.includes('hủy') || name.includes('quá hạn')) fill = '#ef4444';
                                                else if (name.includes('khác')) fill = '#94a3b8';
                                                
                                                return (
                                                    <div key={entry.name} className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
                                                        <div className="w-2.5 h-2.5 rounded-full shadow-sm" style={{ backgroundColor: fill }} />
                                                        <span className="text-xs font-semibold text-slate-700">{entry.name} <span className="text-slate-400 font-normal ml-1">({entry.value})</span></span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </motion.div>

                                    {/* Bar Chart: Trend */}
                                    <motion.div variants={itemVariants} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
                                        <h3 className="text-lg font-bold text-slate-800 mb-6">Tiến độ hoàn thành (7 ngày qua)</h3>
                                        <div className="h-64 w-full">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <BarChart data={stats.completionTrend}>
                                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                                                    <Tooltip cursor={{ fill: '#f1f5f9' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }} />
                                                    <defs>
                                                        <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.2}/>
                                                        </linearGradient>
                                                    </defs>
                                                    <Bar dataKey="count" fill="url(#colorCount)" radius={[6, 6, 0, 0]} />
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </motion.div>
                                </div>
                            </motion.div>
                        )}

                        {/* Bento Grid */}
                        <motion.div 
                            variants={containerVariants}
                            initial="hidden"
                            animate="show"
                            className="grid grid-cols-1 md:grid-cols-3 gap-6"
                        >
                            {/* Feature 1: Smart Reconciliation (Large Card) */}
                            <motion.div variants={itemVariants} className="md:col-span-2 group relative overflow-hidden rounded-3xl bg-white p-8 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <Clock size={120} />
                                </div>
                                <div className="relative z-10 h-full flex flex-col justify-between">
                                    <div>
                                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white mb-6 shadow-lg shadow-blue-500/30">
                                            <CheckCircle2 size={28} />
                                        </div>
                                        <h3 className="text-2xl font-bold text-slate-800 mb-3">{t('home.feature.sync.title')}</h3>
                                        <p className="text-slate-500 text-lg max-w-md">
                                            {t('home.feature.sync.desc')}
                                        </p>
                                    </div>
                                    <div className="mt-8 flex items-center gap-2 text-blue-600 font-semibold cursor-pointer" onClick={() => navigate('/processed-orders')}>
                                        <span>{t('home.feature.sync.link')}</span>
                                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                            </motion.div>

                            {/* Feature 2: 1-Click Import */}
                            <motion.div variants={itemVariants} className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-600 to-indigo-700 p-8 text-white shadow-lg shadow-purple-900/20">
                                <div className="absolute -bottom-4 -right-4 opacity-10 rotate-12">
                                    <Zap size={140} />
                                </div>
                                <div className="relative z-10 h-full flex flex-col">
                                    <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-6">
                                        <Zap size={24} className="text-white" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-3">{t('home.feature.import.title')}</h3>
                                    <p className="text-purple-100 flex-1">
                                        {t('home.feature.import.desc')}
                                    </p>
                                </div>
                            </motion.div>

                            {/* Feature 3: Auto Allocation */}
                            <motion.div variants={itemVariants} className="group relative overflow-hidden rounded-3xl bg-white p-8 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                                <div className="w-12 h-12 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center mb-6">
                                    <Network size={24} />
                                </div>
                                <h3 className="text-xl font-bold text-slate-800 mb-3">{t('home.feature.allocation.title')}</h3>
                                <p className="text-slate-500">
                                    {t('home.feature.allocation.desc')}
                                </p>
                            </motion.div>

                            {/* Feature 4: Visual Management */}
                            <motion.div variants={itemVariants} className="group relative overflow-hidden rounded-3xl bg-white p-8 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                                <div className="w-12 h-12 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center mb-6">
                                    <ImageIcon size={24} />
                                </div>
                                <h3 className="text-xl font-bold text-slate-800 mb-3">{t('home.feature.visual.title')}</h3>
                                <p className="text-slate-500">
                                    {t('home.feature.visual.desc')}
                                </p>
                            </motion.div>

                            {/* Feature 5: Multi-platform */}
                            <motion.div variants={itemVariants} className="group relative overflow-hidden rounded-3xl bg-slate-900 p-8 text-white shadow-xl">
                                <div className="absolute top-0 right-0 p-6 opacity-10">
                                    <Smartphone size={100} />
                                </div>
                                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-6">
                                    <BarChart3 size={24} />
                                </div>
                                <h3 className="text-xl font-bold mb-3">{t('home.feature.multi.title')}</h3>
                                <p className="text-slate-400">
                                    {t('home.feature.multi.desc')}
                                </p>
                            </motion.div>
                        </motion.div>

                    </div>
                </main>
            </div>
        </div>
    );
}
