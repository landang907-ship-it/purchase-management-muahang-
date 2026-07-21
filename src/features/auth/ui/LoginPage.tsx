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
import { Fingerprint } from 'lucide-react';

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
    if (!form.user.trim()) errors.user = 'Vui lòng nhập USER (请输入账号)';
    if (!form.password) errors.password = 'Vui lòng nhập mật khẩu (请输入密码)';
    if (!form.language || form.language.trim().length < 2) {
        errors.language = 'Ngôn ngữ không hợp lệ (无效语言)';
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
                showToast('Vui lòng điền đầy đủ thông tin (请填写完整信息)', 'error');
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
                    login({ 
                        user: trimmedUser, 
                        language: form.language.trim().toUpperCase(),
                        role: trimmedUser === 'admin123' ? 'admin' : 'user'
                    });
                    showToast(`Đăng nhập thành công / 登录成功 (${trimmedUser})`, 'success');
                    return;
                }

                // 2. Fallback: Supabase registered users
                const dbResult = await verifyCredentialsFromDB(form.user, form.password);

                if (dbResult.success && dbResult.user) {
                    login({
                        user: dbResult.user.user,
                        language: dbResult.user.language || form.language.trim().toUpperCase(),
                        role: dbResult.user.role,
                    });
                    showToast(`Đăng nhập thành công / 登录成功 (${dbResult.user.user})`, 'success');
                    return;
                }

                // Both failed
                const errorMsg = dbResult.error || credentialsCheck.error;
                const isUserError =
                    errorMsg.includes('Tài khoản') || errorMsg.includes('không tồn tại') || errorMsg.includes('账号');
                setErrors(isUserError ? { user: errorMsg } : { password: errorMsg });
                showToast(errorMsg, 'error');
                tryVibrate([10, 30, 20]);
            } catch (err) {
                // eslint-disable-next-line no-console
                console.error('[SAP] Login error:', err);
                showToast('Đăng nhập thất bại. Vui lòng thử lại. (登录失败，请重试)', 'error');
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
                login({ 
                    user: form.user.trim(), 
                    language: form.language.trim().toUpperCase(),
                    role: form.user.trim() === 'admin123' ? 'admin' : 'user'
                });
                showToast(`Đăng nhập thành công / 登录成功 (${form.user.trim()})`, 'success');
                return;
            }

            // 2. Check DB silently
            const dbResult = await verifyCredentialsFromDB(form.user, form.password);
            if (dbResult.success && dbResult.user) {
                login({
                    user: dbResult.user.user,
                    language: dbResult.user.language || form.language.trim().toUpperCase(),
                    role: dbResult.user.role,
                });
                showToast(`Đăng nhập thành công / 登录成功 (${dbResult.user.user})`, 'success');
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
            className="min-h-[100dvh] w-full flex flex-col items-center justify-center px-4 py-8 overflow-x-hidden relative"
            style={{
                paddingTop: 'env(safe-area-inset-top, 0px)',
                paddingBottom: 'env(safe-area-inset-bottom, 0px)',
            }}
        >
            {/* Background image */}
            <div
                className="fixed inset-0 -z-10 bg-slate-900"
                style={{
                    backgroundImage: 'url(/login-bg-new.webp)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                }}
            />

            {/* Apple-style Central Glass Card */}
            <div className="w-full max-w-[420px] flex flex-col items-center relative z-10 py-4 anim-fade-up-100 mb-8">
                
                {/* Header inside the card area to keep it grouped */}
                <div className="flex flex-col items-center text-white drop-shadow-lg mb-4 md:mb-6 text-center shrink-0">
                    <div className="w-14 h-14 md:w-20 md:h-20 bg-white/20 backdrop-blur-xl rounded-[20px] md:rounded-[24px] border border-white/40 flex items-center justify-center mb-3 md:mb-5 shadow-xl">
                        <Fingerprint className="text-white w-8 h-8 md:w-10 md:h-10" strokeWidth={1.5} />
                    </div>
                    <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Want Want Việt Nam</h1>
                    <h2 className="text-sm md:text-base font-medium tracking-widest mt-1 opacity-90">旺旺集团越南</h2>
                </div>

                <section
                    className={cn(
                        "w-full bg-white/20 backdrop-blur-2xl rounded-[28px] md:rounded-[32px] shrink-0",
                        "shadow-[0_8px_32px_0_rgba(0,0,0,0.15)]",
                        "p-5 md:p-8 flex flex-col gap-4 md:gap-6 border border-white/40"
                    )}
                    aria-label="Thông tin đăng nhập"
                >
                    <form onSubmit={handleSubmit} noValidate className="w-full flex flex-col gap-3 md:gap-5">
                        
                        {/* Language Toggle (Apple style segment control) */}
                        <div className="flex flex-col gap-2">
                            <span className="text-[12px] font-semibold tracking-wide text-white/90 ml-1">NGÔN NGỮ (语言)</span>
                            <div className="flex items-center p-1 bg-black/20 backdrop-blur-md rounded-xl border border-white/10 shadow-inner">
                                <button
                                    type="button"
                                    onClick={() => updateField('language', 'VI')}
                                    className={cn(
                                        "flex-1 py-2 text-sm font-semibold rounded-lg transition-all duration-300",
                                        form.language === 'VI' ? "bg-white text-slate-800 shadow-sm" : "text-white/70 hover:text-white"
                                    )}
                                >
                                    Tiếng Việt
                                </button>
                                <button
                                    type="button"
                                    onClick={() => updateField('language', 'ZH')}
                                    className={cn(
                                        "flex-1 py-2 text-sm font-semibold rounded-lg transition-all duration-300",
                                        form.language === 'ZH' ? "bg-white text-slate-800 shadow-sm" : "text-white/70 hover:text-white"
                                    )}
                                >
                                    中文
                                </button>
                            </div>
                        </div>

                        {/* User Input */}
                        <div className="flex flex-col gap-2 relative">
                            <label className="text-[12px] font-semibold tracking-wide text-white/90 ml-1">
                                TÀI KHOẢN (账号)
                            </label>
                            <input
                                type="text"
                                value={form.user}
                                onChange={(e) => updateField('user', e.target.value)}
                                className={cn(
                                    "w-full bg-white/50 backdrop-blur-md border border-white/50 rounded-xl px-4 py-3",
                                    "text-slate-900 text-[16px] font-medium outline-none transition-all",
                                    "placeholder:text-slate-500/70",
                                    "focus:bg-white/80 focus:ring-2 focus:ring-blue-500/50"
                                )}
                                placeholder="Nhập tài khoản của bạn..."
                                required
                            />
                            {errors.user && <span className="text-red-300 text-[12px] mt-1 ml-1 font-medium">{errors.user}</span>}
                        </div>

                        {/* Password Input */}
                        <div className="flex flex-col gap-2 relative">
                            <label className="text-[12px] font-semibold tracking-wide text-white/90 ml-1">
                                MẬT KHẨU (密码)
                            </label>
                            <input
                                type="password"
                                value={form.password}
                                onChange={(e) => updateField('password', e.target.value)}
                                className={cn(
                                    "w-full bg-white/50 backdrop-blur-md border border-white/50 rounded-xl px-4 py-3",
                                    "text-slate-900 text-[16px] font-medium outline-none transition-all",
                                    "placeholder:text-slate-500/70",
                                    "focus:bg-white/80 focus:ring-2 focus:ring-blue-500/50"
                                )}
                                placeholder="••••••••"
                                required
                            />
                            {errors.password && <span className="text-red-300 text-[12px] mt-1 ml-1 font-medium">{errors.password}</span>}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={cn(
                                "w-full mt-2 h-12 rounded-xl flex items-center justify-center gap-2",
                                "bg-blue-600 text-white font-semibold text-[16px]",
                                "shadow-[0_4px_14px_0_rgba(37,99,235,0.39)]",
                                "hover:bg-blue-500 hover:shadow-[0_6px_20px_rgba(37,99,235,0.23)]",
                                "active:scale-[0.98] transition-all duration-200",
                                isLoading && "opacity-70 pointer-events-none"
                            )}
                        >
                            {isLoading ? (
                                <span className="animate-pulse">Đang đăng nhập...</span>
                            ) : (
                                <>
                                    <span>Đăng nhập</span>
                                    <span className="opacity-70 text-[14px]">/ 登录</span>
                                </>
                            )}
                        </button>
                    </form>

                    {/* Registration Section */}
                    <div className="w-full border-t border-white/20 pt-4 mt-2">
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
                </section>
            </div>

            <div className="absolute bottom-2 md:bottom-6 left-0 right-0 anim-fade-up-200">
                <SiteFooter />
            </div>

            <Toast toasts={toasts} />
        </main>
    );
}