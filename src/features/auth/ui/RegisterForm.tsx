/**
 * RegisterForm – form đăng ký tài khoản mới (tách từ LoginPage).
 * Sử dụng hook useRegisterForm để quản lý state + logic.
 */
import { FormField } from './FormField';
import { tRegistration, type SupportedLang } from '@/features/auth/i18n/registrationTranslations';

interface RegisterFormProps {
    form: {
        user: string;
        password: string;
        confirmPassword: string;
    };
    errors: {
        user: string;
        password: string;
        confirmPassword: string;
    };
    lang: SupportedLang;
    isSubmitting: boolean;
    onChange: (key: 'user' | 'password' | 'confirmPassword', value: string) => void;
    onSubmit: (e: React.FormEvent) => void;
}

/**
 * The inner registration form (3 fields + submit button).
 * Caller controls open/close + success state.
 */
export function RegisterForm({ form, errors, lang, isSubmitting, onChange, onSubmit }: RegisterFormProps) {
    return (
        <form onSubmit={onSubmit} className="flex flex-col gap-3">
            <FormField
                label={tRegistration('register.newUser', lang)}
                subLabel={tRegistration('register.newUserSub', lang)}
                type="text"
                variant="secondary"
                value={form.user}
                onChange={(v) => onChange('user', v)}
                error={errors.user}
                autoComplete="username"
            />
            <FormField
                label={tRegistration('register.password', lang)}
                subLabel={tRegistration('register.passwordSub', lang)}
                type="password"
                variant="secondary"
                value={form.password}
                onChange={(v) => onChange('password', v)}
                error={errors.password}
                autoComplete="new-password"
            />
            <FormField
                label={tRegistration('register.confirmPassword', lang)}
                subLabel={tRegistration('register.confirmPasswordSub', lang)}
                type="password"
                variant="secondary"
                value={form.confirmPassword}
                onChange={(v) => onChange('confirmPassword', v)}
                error={errors.confirmPassword}
                autoComplete="new-password"
            />
            <button
                type="submit"
                disabled={isSubmitting}
                className="mt-2 w-full py-2.5 px-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition-colors text-sm disabled:opacity-60"
            >
                {tRegistration('register.submit', lang)}
            </button>
        </form>
    );
}

interface RegisterSectionProps {
    isOpen: boolean;
    isSuccess: boolean;
    lang: SupportedLang;
    form: RegisterFormProps['form'];
    errors: RegisterFormProps['errors'];
    isSubmitting: boolean;
    onToggle: () => void;
    onChange: RegisterFormProps['onChange'];
    onSubmit: (e: React.FormEvent) => void;
    onCloseSuccess: () => void;
}

/**
 * Full registration section (title + toggle button + form + success card).
 * Used in LoginPage.
 */
export function RegisterSection({
    isOpen,
    isSuccess,
    lang,
    form,
    errors,
    isSubmitting,
    onToggle,
    onChange,
    onSubmit,
    onCloseSuccess,
}: RegisterSectionProps) {
    if (isSuccess) {
        return (
            <div className="bg-green-50 border border-green-200 rounded-2xl p-5 text-center">
                <p className="text-green-800 font-medium">
                    ✓ {tRegistration('register.success', lang)}
                </p>
                <p className="text-green-600 text-sm mt-1">
                    {tRegistration('register.successDetail', lang)}
                </p>
                <button
                    type="button"
                    onClick={onCloseSuccess}
                    className="mt-3 text-sm text-green-700 hover:text-green-900 font-medium underline"
                >
                    {tRegistration('register.close', lang)}
                </button>
            </div>
        );
    }

    return (
        <div className="w-full">
            <div className="flex items-center justify-between mb-3 px-1">
                <h2 className="text-[14px] font-medium text-white/90 tracking-tight">
                    {tRegistration('register.title', lang)}
                </h2>
                <button
                    type="button"
                    onClick={onToggle}
                    className="text-[13px] text-white/80 hover:text-white bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-full font-medium transition-all duration-200"
                >
                    {isOpen
                        ? tRegistration('register.hide', lang)
                        : tRegistration('register.show', lang)}
                </button>
            </div>

            {isOpen && (
                <RegisterForm
                    form={form}
                    errors={errors}
                    lang={lang}
                    isSubmitting={isSubmitting}
                    onChange={onChange}
                    onSubmit={onSubmit}
                />
            )}
        </div>
    );
}