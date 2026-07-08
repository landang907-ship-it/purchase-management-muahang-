/**
 * LoginPage – SAP-style login form. Calls useAuth().login on success.
 * Đã được refactor: phần đăng ký tách sang RegisterForm/RegisterSection + useRegisterForm hook.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { Toast } from '@/shared/ui/Toast';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { validateCredentials } from '@/features/auth/services/authConfig';
import { useRegisterForm } from '@/features/auth/hooks/useRegisterForm';
import { RegisterSection } from '@/features/auth/ui/RegisterForm';
import type { SupportedLang } from '@/features/auth/i18n/registrationTranslations';
import type { SapFormErrors, SapFormState, ToastMessage } from '@/features/auth/model/sap';

import { SiteFooter } from './SiteFooter';
import { verifyCredentialsFromDB } from '@/features/auth/services/authService';
import { cn } from '@/shared/lib/cn';
import { Fingerprint, Key } from 'lucide-react';

const DEFAULT_LANGUAGE = 'VI';

function tryVibrate(pattern: number | number[] = 10): void {
    if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
        try {
            navigator.vibrate(pattern);
        } catch {
            /* noop */
        }
    }
}

function validate(form: SapFormState): SapFormErrors {
    const errors: SapFormErrors = {};
    if (!form.user.trim()) errors.user = 'Vui lòng nhập USER';
    if (!form.password) errors.password = 'Vui lòng nhập mật khẩu';
    if (!form.language || form.language.trim().length < 2) {
        errors.language = 'Ngôn ngữ không hợp lệ';
    }
    return errors;
}

export function LoginPage() {
    const { login } = useAuth();
    const reg = useRegisterForm();

    const [form, setForm] = useState<SapFormState>({
        user: '',
        password: '',
        language: DEFAULT_LANGUAGE,
    });
    const [errors, setErrors] = useState<SapFormErrors>({});
    const [isLoading, setIsLoading] = useState(false);
    const [toasts, setToasts] = useState<ToastMessage[]>([]);
    const toastIdRef = useRef(0);

    // Language derived from login form (user not logged in yet)
    const regLang: SupportedLang = form.language === 'ZH' ? 'ZH' : 'VI';

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

    const updateField = useCallback(<K extends keyof SapFormState>(key: K, value: string) => {
        setForm((prev) => {
            const next = { ...prev, [key]: value };
            if (key === 'language') next.language = value.toUpperCase();
            return next;
        });
        setErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev));
    }, []);

    const handleSubmit = useCallback(
        async (e?: React.FormEvent) => {
            e?.preventDefault();
            tryVibrate(8);

            const nextErrors = validate(form);
            if (Object.values(nextErrors).some(Boolean)) {
                setErrors(nextErrors);
                showToast('Vui lòng điền đầy đủ thông tin', 'error');
                tryVibrate([10, 30, 20]);
                return;
            }

            setErrors({});
            setIsLoading(true);
            try {
                await new Promise((resolve) => setTimeout(resolve, 600));

                // 1. Check hardcoded credentials (admin123)
                const credentialsCheck = validateCredentials(form.user, form.password);

                if (credentialsCheck.ok) {
                    const trimmedUser = form.user.trim();
                    login({ user: trimmedUser, language: form.language.trim().toUpperCase() });
                    showToast(`Đăng nhập thành công (${trimmedUser})`, 'success');
                    return;
                }

                // 2. Fallback: Supabase registered users
                const dbResult = await verifyCredentialsFromDB(form.user, form.password);

                if (dbResult.success && dbResult.user) {
                    login({
                        user: dbResult.user.user,
                        language: dbResult.user.language || form.language.trim().toUpperCase(),
                    });
                    showToast(`Đăng nhập thành công (${dbResult.user.user})`, 'success');
                    return;
                }

                // Both failed
                const errorMsg = dbResult.error || credentialsCheck.error;
                const isUserError =
                    errorMsg.includes('Tài khoản') || errorMsg.includes('không tồn tại');
                setErrors(isUserError ? { user: errorMsg } : { password: errorMsg });
                showToast(errorMsg, 'error');
                tryVibrate([10, 30, 20]);
            } catch (err) {
                // eslint-disable-next-line no-console
                console.error('[SAP] Login error:', err);
                showToast('Đăng nhập thất bại. Vui lòng thử lại.', 'error');
            } finally {
                setIsLoading(false);
            }
        },
        [form, showToast, login],
    );

    const handleRegisterSubmit = useCallback(
        async (e: React.FormEvent) => {
            e.preventDefault();
            await reg.submit(form.language, showToast);
        },
        [reg, form.language, showToast],
    );

    const handleCloseRegisterSuccess = useCallback(() => {
        reg.reset();
    }, [reg]);

    // Auto-login effect (silently checks credentials when user stops typing)
    useEffect(() => {
        const checkAutoLogin = async () => {
            if (!form.user.trim() || !form.password) return;

            // 1. Check hardcoded
            const credentialsCheck = validateCredentials(form.user, form.password);
            if (credentialsCheck.ok) {
                login({ user: form.user.trim(), language: form.language.trim().toUpperCase() });
                showToast(`Đăng nhập thành công (${form.user.trim()})`, 'success');
                return;
            }

            // 2. Check DB silently
            const dbResult = await verifyCredentialsFromDB(form.user, form.password);
            if (dbResult.success && dbResult.user) {
                login({
                    user: dbResult.user.user,
                    language: dbResult.user.language || form.language.trim().toUpperCase(),
                });
                showToast(`Đăng nhập thành công (${dbResult.user.user})`, 'success');
                return;
            }
        };

        const timer = setTimeout(() => {
            checkAutoLogin();
        }, 800); // 800ms debounce

        return () => clearTimeout(timer);
    }, [form.user, form.password, form.language, login, showToast]);

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
                    backgroundImage: 'url(/login-bg-new.webp)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                }}
            />
            {/* Header Text */}
            <div className="absolute top-10 left-0 right-0 flex flex-col items-center text-white drop-shadow-md z-10">
                <h1 className="text-xl md:text-2xl font-extrabold tracking-wide">Want Want Việt Nam</h1>
                <h2 className="text-xs md:text-sm font-semibold tracking-widest mt-1">旺旺集团越南</h2>
                <p className="text-[10px] md:text-xs opacity-80 mt-1 md:mt-2">Ngày 8 tháng 7 năm 2026</p>
            </div>

            {/* Login Card & Button Container */}
            <div className="w-full max-w-[600px] flex flex-col md:flex-row items-center justify-center gap-8 anim-fade-up-100 mt-16 relative">
                
                {/* Login Button (Left on desktop, bottom on mobile) */}
                <div className="order-2 md:order-1 flex-shrink-0 z-10 mt-4 md:mt-0">
                    <button
                        type="submit"
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className={cn(
                            "w-28 h-28 md:w-36 md:h-36 rounded-full",
                            "bg-gradient-to-br from-[#3bcf79] to-[#1e8a4a]",
                            "shadow-[0_0_30px_rgba(59,207,121,0.5)]",
                            "flex flex-col items-center justify-center text-white",
                            "border-2 border-white/40 backdrop-blur-sm hover:scale-105 active:scale-95 transition-all duration-300",
                            isLoading && "opacity-70 pointer-events-none"
                        )}
                    >
                        <span className="font-extrabold text-[15px] md:text-[17px] tracking-wider drop-shadow-sm">{isLoading ? '...' : 'LOGIN'}</span>
                        <span className="text-[9px] md:text-[11px] font-bold uppercase opacity-90 drop-shadow-sm mt-0.5">(ĐĂNG NHẬP)</span>
                        <span className="text-[12px] md:text-[14px] mt-1 md:mt-2 drop-shadow-sm font-semibold">登录</span>
                    </button>
                </div>

                {/* Glass Card & Register Wrapper */}
                <div className="order-1 md:order-2 w-full max-w-[380px] flex flex-col gap-4 relative">
                    <form onSubmit={handleSubmit} noValidate className="w-full relative">
                    {/* Floating Icons */}
                    <div className="absolute -top-12 -right-4 md:-right-10 flex flex-col gap-3 z-20 pointer-events-none">
                        <div className="w-12 h-12 rounded-[16px] bg-white/30 backdrop-blur-md border border-white/50 flex items-center justify-center shadow-lg transform rotate-6">
                            <Fingerprint size={28} className="text-[#0f2c59]/80" />
                        </div>
                        <div className="w-10 h-10 rounded-[12px] bg-white/30 backdrop-blur-md border border-white/50 flex items-center justify-center shadow-lg transform -rotate-12 ml-4">
                            <Key size={22} className="text-[#0f2c59]/80" />
                        </div>
                    </div>

                    <section
                        className={cn(
                            "bg-white/10 backdrop-blur-md rounded-[32px]",
                            "shadow-[0_8px_32px_0_rgba(31,38,135,0.25)]",
                            "p-5 md:p-6 flex flex-col gap-4 border border-white/30"
                        )}
                        aria-label="Thông tin đăng nhập SAP"
                    >
                        {/* Language Toggle */}
                        <div className="flex flex-col bg-[#d0eefb]/80 backdrop-blur-md rounded-[24px] px-5 py-3 border border-white/50 text-[#0f2c59] shadow-[inset_0_1px_4px_rgba(255,255,255,0.6)]">
                            <span className="text-[11px] md:text-[12px] font-extrabold tracking-wide mb-2 opacity-90">LOGON LANGUAGE : (登录语言)</span>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className={cn('text-[12px] md:text-[13px] font-bold transition-colors', form.language === 'VI' ? 'text-[#0f2c59]' : 'text-[#0f2c59]/50')}>
                                        TIẾNG VIỆT (VI)
                                    </span>
                                    
                                    <button
                                        type="button"
                                        onClick={() => updateField('language', form.language === 'VI' ? 'ZH' : 'VI')}
                                        className={cn(
                                            "relative w-10 h-6 rounded-full transition-colors focus:outline-none shadow-inner border border-black/10",
                                            form.language === 'ZH' ? 'bg-[#5eaee5]' : 'bg-gray-300'
                                        )}
                                        aria-label="Toggle language"
                                    >
                                        <span 
                                            className={cn(
                                                "absolute top-[2px] left-[2px] bg-white w-4 h-4 rounded-full transition-transform shadow-md",
                                                form.language === 'ZH' ? 'translate-x-5' : 'translate-x-0'
                                            )}
                                        />
                                    </button>

                                    <span className={cn('text-[12px] md:text-[13px] font-bold transition-colors', form.language === 'ZH' ? 'text-[#0f2c59]' : 'text-[#0f2c59]/50')}>
                                        中文 (ZH)
                                    </span>
                                </div>
                                
                                {/* Flag representation */}
                                <div className="w-8 h-[22px] bg-[#da251d] rounded-sm flex items-center justify-center shadow-md overflow-hidden border border-black/10 relative ml-2">
                                    {form.language === 'VI' ? (
                                        <span className="text-[#ffff00] text-[20px] leading-none absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 mt-[-1px]">★</span>
                                    ) : (
                                        <span className="text-[#ffff00] text-[14px] leading-none">★</span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* User Input */}
                        <div className="flex flex-col bg-[#fad5a5]/80 backdrop-blur-md rounded-[24px] px-5 py-3 border border-white/50 text-[#593d0f] shadow-[inset_0_1px_4px_rgba(255,255,255,0.6)] mt-1">
                            <label className="text-[11px] md:text-[12px] font-extrabold tracking-wide mb-1 opacity-90">
                                USER : (用户) <span>*</span>
                            </label>
                            <input
                                type="text"
                                value={form.user}
                                onChange={(e) => updateField('user', e.target.value)}
                                className="w-full bg-transparent border-0 outline-none text-[15px] md:text-[16px] font-bold placeholder:text-[#593d0f]/40"
                                required
                            />
                            {errors.user && <span className="text-red-600 text-[11px] mt-1 font-bold">{errors.user}</span>}
                        </div>

                        {/* Password Input */}
                        <div className="flex flex-col bg-[#c1c6ff]/80 backdrop-blur-md rounded-[24px] px-5 py-3 border border-white/50 text-[#211f59] shadow-[inset_0_1px_4px_rgba(255,255,255,0.6)] mt-1">
                            <label className="text-[11px] md:text-[12px] font-extrabold tracking-wide mb-1 opacity-90">
                                PASS WORD : (密码) <span>*</span>
                            </label>
                            <input
                                type="password"
                                value={form.password}
                                onChange={(e) => updateField('password', e.target.value)}
                                className="w-full bg-transparent border-0 outline-none text-[15px] md:text-[16px] font-bold placeholder:text-[#211f59]/40"
                                required
                            />
                            {errors.password && <span className="text-red-600 text-[11px] mt-1 font-bold">{errors.password}</span>}
                        </div>
                    </section>
                </form>

                {/* Registration Section */}
                <div className="w-full mt-2">
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
                        onCloseSuccess={handleCloseRegisterSuccess}
                    />
                </div>
            </div>

            <div className="mt-6 anim-fade-up-200">
                <SiteFooter />
            </div>

            <Toast toasts={toasts} />
        </main>
    );
}