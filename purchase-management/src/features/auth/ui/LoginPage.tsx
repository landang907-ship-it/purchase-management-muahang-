/**
 * LoginPage – SAP-style login form. Calls useAuth().login on success.
 * Đã được refactor: phần đăng ký tách sang RegisterForm/RegisterSection + useRegisterForm hook.
 */
import { useCallback, useRef, useState } from 'react';
import { Toast } from '@/shared/ui/Toast';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { validateCredentials } from '@/features/auth/services/authConfig';
import { useRegisterForm } from '@/features/auth/hooks/useRegisterForm';
import { RegisterSection } from '@/features/auth/ui/RegisterForm';
import type { SupportedLang } from '@/features/auth/i18n/registrationTranslations';
import type { SapFormErrors, SapFormState, ToastMessage } from '@/features/auth/model/sap';
import { FormField } from './FormField';
import { SapButton } from './SapButton';
import { SiteFooter } from './SiteFooter';
import { SiteHeader } from './SiteHeader';
import { verifyCredentialsFromDB } from '@/features/auth/services/authService';

const DEFAULT_LANGUAGE = 'VI';
const LANGUAGE_HINT = 'VI / ZH';

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

    return (
        <main
            className="min-h-screen w-full flex flex-col items-center justify-center px-4 py-8"
            style={{
                paddingTop: 'calc(env(safe-area-inset-top, 0px) + 80px)',
                paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 24px)',
            }}
        >
            {/* Background image (Highly optimized local WebP, ~131KB) */}
            <div
                className="fixed inset-0 -z-10"
                style={{
                    backgroundImage: 'url(/login-bg.webp)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                }}
            />
            {/* Dark overlay for better text readability */}
            <div className="fixed inset-0 -z-10 bg-black/50" />
            <SiteHeader />

            {/* Login Card */}
            <div className="w-full max-w-[420px] anim-fade-up-100">
                <section className="mb-5">
                    <form onSubmit={handleSubmit} noValidate>
                        <SapButton
                            label="SAP – TRUY XUẤT"
                            subLabel="SAP 登录"
                            loadingLabel="Đang xử lý…"
                            isLoading={isLoading}
                            ariaLabel="Đăng nhập SAP - Truy Xuất"
                        />
                    </form>
                </section>

                <section
                    className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-5 flex flex-col gap-3 border border-white/20"
                    aria-label="Thông tin đăng nhập SAP"
                >
                    <FormField
                        label="USER :"
                        subLabel="用户"
                        type="text"
                        variant="primary"
                        value={form.user}
                        onChange={(v) => updateField('user', v)}
                        autoComplete="username"
                        inputMode="text"
                        required
                        error={errors.user}
                    />
                    <FormField
                        label="PASS WORD :"
                        subLabel="密码"
                        type="password"
                        variant="secondary"
                        value={form.password}
                        onChange={(v) => updateField('password', v)}
                        autoComplete="current-password"
                        required
                        error={errors.password}
                    />
                    <FormField
                        label="LOGON LANGUAGE :"
                        subLabel="登录语言"
                        type="text"
                        variant="secondary"
                        value={form.language}
                        onChange={(v) => updateField('language', v)}
                        maxLength={3}
                        autoCapitalize="characters"
                        ariaDescribedBy="hint-lang"
                        hint={LANGUAGE_HINT}
                        error={errors.language}
                    />
                    {!errors.language ? (
                        <span id="hint-lang" className="sr-only">
                            {LANGUAGE_HINT}
                        </span>
                    ) : null}
                </section>
            </div>

            <div className="mt-6 anim-fade-up-200">
                <SiteFooter />
            </div>

            {/* Registration Section (refactored into separate component) */}
            <div className="mt-8 w-full max-w-[420px] anim-fade-up-300">
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

            <Toast toasts={toasts} />
        </main>
    );
}