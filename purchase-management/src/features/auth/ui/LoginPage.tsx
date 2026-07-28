/**
 * LoginPage – Giao diện đăng nhập hiện đại với kính mờ glassmorphism.
 * Ngôn ngữ: Tiếng Việt / 中文 (chọn bằng nút bấm).
 * Đăng nhập: Nút xanh gradient "Đăng nhập / 登录".
 */
import { useCallback, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Toast } from '@/shared/ui/Toast';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { validateCredentials } from '@/features/auth/services/authConfig';
import { useRegisterForm } from '@/features/auth/hooks/useRegisterForm';
import { RegisterSection } from '@/features/auth/ui/RegisterForm';
import type { SupportedLang } from '@/features/auth/i18n/registrationTranslations';
import type { ToastMessage } from '@/features/auth/model/sap';
import { SiteHeader } from './SiteHeader';
import { SiteFooter } from './SiteFooter';
import { verifyCredentialsFromDB } from '@/features/auth/services/authService';

type Lang = 'VI' | 'ZH';

function tryVibrate(pattern: number | number[] = 10): void {
    if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
        try { navigator.vibrate(pattern); } catch { /* noop */ }
    }
}

const LABELS = {
    VI: {
        account: 'TÀI KHOẢN',
        accountSub: '(账号)',
        accountPlaceholder: 'Nhập tài khoản của bạn...',
        password: 'MẬT KHẨU',
        passwordSub: '(密码)',
        loginBtn: 'Đăng nhập / 登录',
        loading: 'Đang xử lý…',
        errAccount: 'Vui lòng nhập tài khoản',
        errPassword: 'Vui lòng nhập mật khẩu',
        errFill: 'Vui lòng điền đầy đủ thông tin',
        successMsg: (u: string) => `Đăng nhập thành công (${u})`,
        failMsg: 'Đăng nhập thất bại. Vui lòng thử lại.',
    },
    ZH: {
        account: '账号',
        accountSub: '(Tài khoản)',
        accountPlaceholder: '请输入账号...',
        password: '密码',
        passwordSub: '(Mật khẩu)',
        loginBtn: '登录 / Đăng nhập',
        loading: '处理中…',
        errAccount: '请输入账号',
        errPassword: '请输入密码',
        errFill: '请填写完整信息',
        successMsg: (u: string) => `登录成功 (${u})`,
        failMsg: '登录失败，请重试。',
    },
} as const;

export function LoginPage() {
    const { login } = useAuth();
    const reg = useRegisterForm();

    const [lang, setLang] = useState<Lang>('VI');
    const [user, setUser] = useState('');
    const [password, setPassword] = useState('');
    const [userError, setUserError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [toasts, setToasts] = useState<ToastMessage[]>([]);
    const toastIdRef = useRef(0);

    const L = LABELS[lang];
    const regLang: SupportedLang = lang === 'ZH' ? 'ZH' : 'VI';

    const showToast = useCallback(
        (text: string, variant: ToastMessage['variant'] = 'default', duration = 2400) => {
            const id = ++toastIdRef.current;
            setToasts((prev) => [...prev, { id, text, variant, duration }]);
            window.setTimeout(() => {
                setToasts((prev) => prev.filter((t) => t.id !== id));
            }, duration);
        },
        [],
    );

    const handleSubmit = useCallback(
        async (e?: React.FormEvent) => {
            e?.preventDefault();
            tryVibrate(8);

            let hasError = false;
            if (!user.trim()) { setUserError(L.errAccount); hasError = true; }
            if (!password) { setPasswordError(L.errPassword); hasError = true; }
            if (hasError) {
                showToast(L.errFill, 'error');
                tryVibrate([10, 30, 20]);
                return;
            }

            setUserError('');
            setPasswordError('');
            setIsLoading(true);
            try {
                await new Promise((resolve) => setTimeout(resolve, 600));

                // 1. Hardcoded credentials (admin123)
                const credCheck = validateCredentials(user, password);
                if (credCheck.ok) {
                    login({ user: user.trim(), language: lang });
                    showToast(L.successMsg(user.trim()), 'success');
                    return;
                }

                // 2. Supabase users
                const dbResult = await verifyCredentialsFromDB(user, password);
                if (dbResult.success && dbResult.user) {
                    login({
                        user: dbResult.user.user,
                        language: dbResult.user.language || lang,
                    });
                    showToast(L.successMsg(dbResult.user.user), 'success');
                    return;
                }

                const errorMsg = dbResult.error || credCheck.error;
                const isUserErr = errorMsg.includes('Tài khoản') || errorMsg.includes('không tồn tại');
                if (isUserErr) setUserError(errorMsg); else setPasswordError(errorMsg);
                showToast(errorMsg, 'error');
                tryVibrate([10, 30, 20]);
            } catch (err) {
                console.error('[Login] error:', err);
                showToast(L.failMsg, 'error');
            } finally {
                setIsLoading(false);
            }
        },
        [user, password, lang, L, showToast, login],
    );

    const handleRegisterSubmit = useCallback(
        async (e: React.FormEvent) => {
            e.preventDefault();
            await reg.submit(lang, showToast);
        },
        [reg, lang, showToast],
    );

    return (
        <main
            className="min-h-screen w-full flex flex-col items-center justify-center px-4 py-8"
            style={{
                paddingTop: 'calc(env(safe-area-inset-top, 0px) + 80px)',
                paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 24px)',
            }}
        >
            {/* Background image */}
            <div
                className="fixed inset-0 -z-10"
                style={{
                    backgroundImage: 'url(/login-bg.webp)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                }}
            />
            {/* Dark overlay */}
            <div className="fixed inset-0 -z-10 bg-black/50" />

            <SiteHeader />

            <motion.div
                className="w-full max-w-[420px]"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, ease: 'easeOut' }}
            >
                {/* Language Toggle */}
                <div className="flex justify-center mb-5">
                    <div className="flex rounded-xl overflow-hidden border border-white/30 shadow-lg">
                        <button
                            type="button"
                            onClick={() => setLang('VI')}
                            className={`px-7 py-2 text-sm font-semibold transition-all duration-200 ${
                                lang === 'VI'
                                    ? 'bg-white text-blue-700 shadow-inner'
                                    : 'bg-white/15 text-white hover:bg-white/25'
                            }`}
                        >
                            Tiếng Việt
                        </button>
                        <div className="w-px bg-white/30" />
                        <button
                            type="button"
                            onClick={() => setLang('ZH')}
                            className={`px-7 py-2 text-sm font-semibold transition-all duration-200 ${
                                lang === 'ZH'
                                    ? 'bg-white text-blue-700 shadow-inner'
                                    : 'bg-white/15 text-white hover:bg-white/25'
                            }`}
                        >
                            中文
                        </button>
                    </div>
                </div>

                {/* Login Card */}
                <form
                    onSubmit={handleSubmit}
                    noValidate
                    className="bg-white/15 backdrop-blur-lg rounded-2xl shadow-2xl p-6 flex flex-col gap-4 border border-white/25"
                >
                    {/* TÀI KHOẢN / 账号 */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-white/90 text-[11px] font-bold tracking-widest uppercase">
                            {L.account}
                            <span className="ml-1 text-white/55 normal-case tracking-normal font-normal text-[10px]">
                                {L.accountSub}
                            </span>
                        </label>
                        <input
                            type="text"
                            value={user}
                            onChange={(e) => { setUser(e.target.value); setUserError(''); }}
                            placeholder={L.accountPlaceholder}
                            autoComplete="username"
                            autoCapitalize="none"
                            className={`w-full px-4 py-3 rounded-xl bg-white/90 text-gray-800 placeholder-gray-400
                                text-sm outline-none transition-all duration-150
                                focus:ring-2 focus:ring-blue-400 focus:bg-white
                                border ${userError ? 'border-red-400' : 'border-white/40'}`}
                        />
                        {userError && (
                            <p className="text-red-300 text-[11px] pl-1">{userError}</p>
                        )}
                    </div>

                    {/* MẬT KHẨU / 密码 */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-white/90 text-[11px] font-bold tracking-widest uppercase">
                            {L.password}
                            <span className="ml-1 text-white/55 normal-case tracking-normal font-normal text-[10px]">
                                {L.passwordSub}
                            </span>
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => { setPassword(e.target.value); setPasswordError(''); }}
                            placeholder="••••••••"
                            autoComplete="current-password"
                            className={`w-full px-4 py-3 rounded-xl bg-white/90 text-gray-800 placeholder-gray-400
                                text-sm outline-none transition-all duration-150
                                focus:ring-2 focus:ring-blue-400 focus:bg-white
                                border ${passwordError ? 'border-red-400' : 'border-white/40'}`}
                        />
                        {passwordError && (
                            <p className="text-red-300 text-[11px] pl-1">{passwordError}</p>
                        )}
                    </div>

                    {/* Login Button */}
                    <motion.button
                        type="submit"
                        disabled={isLoading}
                        whileTap={isLoading ? undefined : { scale: 0.97 }}
                        whileHover={isLoading ? undefined : { scale: 1.01 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                        className="w-full py-3.5 px-6 rounded-xl font-bold text-white text-sm tracking-wide
                            bg-gradient-to-r from-blue-500 to-blue-700
                            hover:from-blue-600 hover:to-blue-800
                            shadow-lg shadow-blue-900/30
                            disabled:opacity-70 disabled:cursor-not-allowed
                            transition-colors duration-200"
                    >
                        {isLoading ? L.loading : L.loginBtn}
                    </motion.button>
                </form>
            </motion.div>

            <div className="mt-6">
                <SiteFooter />
            </div>

            {/* Registration Section */}
            <div className="mt-6 w-full max-w-[420px]">
                <RegisterSection
                    isOpen={reg.isRegisterMode}
                    isSuccess={reg.isSuccess}
                    lang={regLang}
                    form={reg.form}
                    errors={reg.errors}
                    isSubmitting={reg.isSubmitting}
                    onToggle={reg.toggleMode}
                    onChange={reg.setField}
                    onSubmit={handleRegisterSubmit}
                    onCloseSuccess={reg.reset}
                />
            </div>

            <Toast toasts={toasts} />
        </main>
    );
}