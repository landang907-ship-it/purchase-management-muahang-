/**
 * LoginPage – SAP-style login form. Calls useAuth().login on success.
 */
import { useCallback, useRef, useState } from 'react';
import { Toast } from '@/shared/ui/Toast';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { validateCredentials } from '@/features/auth/services/authConfig';
import type {
    SapFormErrors,
    SapFormState,
    ToastMessage,
} from '@/features/auth/model/sap';
import { FormField } from './FormField';
import { SapButton } from './SapButton';
import { SiteFooter } from './SiteFooter';
import { SiteHeader } from './SiteHeader';
import { verifyCredentialsFromDB, registerUser } from '@/features/auth/services/authService';

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
    const [form, setForm] = useState<SapFormState>({
        user: '',
        password: '',
        language: DEFAULT_LANGUAGE,
    });
    const [errors, setErrors] = useState<SapFormErrors>({});
    const [isLoading, setIsLoading] = useState(false);
    const [toasts, setToasts] = useState<ToastMessage[]>([]);
    const toastIdRef = useRef(0);
    const [isRegisterMode, setIsRegisterMode] = useState(false);
    const [regForm, setRegForm] = useState({ user: '', password: '', confirmPassword: '' });
    const [regErrors, setRegErrors] = useState({ user: '', password: '', confirmPassword: '' });
    const [regSuccess, setRegSuccess] = useState(false);

    // Get language from form state for registration (since user is not logged in yet)
    const regLang = form.language === 'ZH' ? 'ZH' : 'VI';

    // Translation function for registration form
    const regT = (key: string): string => {
        const translations: Record<string, Record<string, string>> = {
            'VI': {
                'register.title': 'Đăng ký tài khoản mới',
                'register.show': 'Đăng ký',
                'register.hide': 'Ẩn',
                'register.newUser': 'USER MỚI :',
                'register.newUserSub': '新用户',
                'register.password': 'MẬT KHẨU :',
                'register.confirmPassword': 'XÁC NHẬN MẬT KHẨU :',
                'register.confirmPasswordSub': '确认密码',
                'register.submit': 'ĐĂNG KÝ',
                'register.userRequired': 'Vui lòng nhập USER',
                'register.passwordRequired': 'Vui lòng nhập mật khẩu',
                'register.passwordMismatch': 'Mật khẩu không khớp',
                'register.success': 'Đăng ký thành công! Vui lòng đăng nhập.',
                'register.successDetail': 'Vui lòng sử dụng thông tin đã đăng ký để đăng nhập.',
                'register.close': 'Đóng',
            },
            'ZH': {
                'register.title': '注册新账户',
                'register.show': '注册',
                'register.hide': '隐藏',
                'register.newUser': '新用户 :',
                'register.newUserSub': '新用户',
                'register.password': '密码 :',
                'register.confirmPassword': '确认密码 :',
                'register.confirmPasswordSub': '确认密码',
                'register.submit': '注册',
                'register.userRequired': '请输入用户',
                'register.passwordRequired': '请输入密码',
                'register.passwordMismatch': '密码不匹配',
                'register.success': '注册成功！请登录。',
                'register.successDetail': '请使用注册的账户信息登录。',
                'register.close': '关闭',
            },
        };
        return translations[regLang]?.[key] ?? key;
    };

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

                // First check hardcoded credentials (admin123)
                const credentialsCheck = validateCredentials(
                    form.user,
                    form.password,
                );

                if (credentialsCheck.ok) {
                    // Hardcoded credentials match (e.g., admin123)
                    const trimmedUser = form.user.trim();
                    login({ user: trimmedUser, language: form.language.trim().toUpperCase() });
                    showToast(`Đăng nhập thành công (${trimmedUser})`, 'success');
                } else {
                    // Try to verify against Supabase database for registered users
                    const dbResult = await verifyCredentialsFromDB(
                        form.user,
                        form.password,
                    );

                    if (dbResult.success && dbResult.user) {
                        login({
                            user: dbResult.user.user,
                            language: dbResult.user.language || form.language.trim().toUpperCase(),
                        });
                        showToast(`Đăng nhập thành công (${dbResult.user.user})`, 'success');
                    } else {
                        // Both checks failed
                        const errorMsg = dbResult.error || credentialsCheck.error;
                        const isUserError = errorMsg.includes('Tài khoản') || errorMsg.includes('không tồn tại');
                        setErrors(
                            isUserError
                                ? { user: errorMsg }
                                : { password: errorMsg },
                        );
                        showToast(errorMsg, 'error');
                        tryVibrate([10, 30, 20]);
                        return;
                    }
                }
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
            <div
                className="fixed inset-0 -z-10 bg-black/50"
            />
            <SiteHeader />

            {/* Login Card */}
            <div
                className="w-full max-w-[420px] anim-fade-up-100"
            >
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

            {/* Registration Section */}
            <div className="mt-8 w-full max-w-[420px] anim-fade-up-300">
                {!regSuccess ? (
                    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-5 border border-white/20">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-base font-bold text-blue-900">
                                {regT('register.title')}
                            </h2>
                            <button
                                type="button"
                                onClick={() => setIsRegisterMode(!isRegisterMode)}
                                className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                            >
                                {isRegisterMode ? regT('register.hide') : regT('register.show')}
                            </button>
                        </div>

                        {isRegisterMode && (
                            <form
                                onSubmit={async (e) => {
                                    e.preventDefault();
                                    const newErrors = {
                                        user: regForm.user.trim() ? '' : regT('register.userRequired'),
                                        password: regForm.password.trim() ? '' : regT('register.passwordRequired'),
                                        confirmPassword: regForm.password !== regForm.confirmPassword ? regT('register.passwordMismatch') : '',
                                    };
                                    setRegErrors(newErrors);
                                    if (!Object.values(newErrors).some(Boolean)) {
                                        // Call registration API
                                        setIsLoading(true);
                                        const result = await registerUser(
                                            regForm.user,
                                            regForm.password,
                                            form.language,
                                        );
                                        setIsLoading(false);

                                        if (result.success) {
                                            setRegSuccess(true);
                                            showToast(regT('register.success'), 'success');
                                        } else {
                                            // Show error
                                            setRegErrors({
                                                user: result.error?.includes('USER') || result.error?.includes('tài khoản') ? result.error! : '',
                                                password: !result.error?.includes('USER') && !result.error?.includes('tài khoản') ? result.error! : '',
                                                confirmPassword: '',
                                            });
                                            showToast(result.error || 'Đăng ký thất bại', 'error');
                                        }
                                    }
                                }}
                                className="flex flex-col gap-3"
                            >
                                <FormField
                                    label={regT('register.newUser')}
                                    subLabel={regT('register.newUserSub')}
                                    type="text"
                                    variant="secondary"
                                    value={regForm.user}
                                    onChange={(v) => setRegForm((p) => ({ ...p, user: v }))}
                                    error={regErrors.user}
                                    autoComplete="username"
                                />
                                <FormField
                                    label={regT('register.password')}
                                    subLabel=""
                                    type="password"
                                    variant="secondary"
                                    value={regForm.password}
                                    onChange={(v) => setRegForm((p) => ({ ...p, password: v }))}
                                    error={regErrors.password}
                                    autoComplete="new-password"
                                />
                                <FormField
                                    label={regT('register.confirmPassword')}
                                    subLabel={regT('register.confirmPasswordSub')}
                                    type="password"
                                    variant="secondary"
                                    value={regForm.confirmPassword}
                                    onChange={(v) => setRegForm((p) => ({ ...p, confirmPassword: v }))}
                                    error={regErrors.confirmPassword}
                                    autoComplete="new-password"
                                />
                                <button
                                    type="submit"
                                    className="mt-2 w-full py-2.5 px-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition-colors text-sm"
                                >
                                    {regT('register.submit')}
                                </button>
                            </form>
                        )}
                    </div>
                ) : (
                    <div className="bg-green-50 border border-green-200 rounded-2xl p-5 text-center">
                        <p className="text-green-800 font-medium">✓ {regT('register.success')}</p>
                        <p className="text-green-600 text-sm mt-1">{regT('register.successDetail')}</p>
                        <button
                            onClick={() => {
                                setRegSuccess(false);
                                setRegForm({ user: '', password: '', confirmPassword: '' });
                                setIsRegisterMode(false);
                            }}
                            className="mt-3 text-sm text-green-700 hover:text-green-900 font-medium underline"
                        >
                            {regT('register.close')}
                        </button>
                    </div>
                )}
            </div>

            <Toast toasts={toasts} />
        </main>
    );
}
