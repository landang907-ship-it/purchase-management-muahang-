/**
 * RegisterForm – form đăng ký tài khoản mới (tách từ LoginPage).
 * Sử dụng hook useRegisterForm để quản lý state + logic.
 */
import { FormField } from './FormField';
import { tRegistration, type SupportedLang } from '@/features/auth/i18n/registrationTranslations';
import { User } from 'lucide-react';

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
            <div className="flex items-center justify-between w-full bg-[#1e293b]/90 backdrop-blur-md border border-white/10 rounded-xl p-3 shadow-lg mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full border-[1.5px] border-white/40 flex items-center justify-center shrink-0">
                        <User className="text-white/80 w-5 h-5" strokeWidth={2} />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-white font-bold text-[13px] md:text-[14px] leading-tight tracking-wide">
                            ĐĂNG KÝ TÀI KHOẢN MỚI
                        </span>
                        <span className="text-blue-200/80 italic text-[12px] md:text-[13px] leading-tight mt-0.5">
                            注册新账户
                        </span>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={onToggle}
                    className="flex flex-col items-center justify-center shrink-0 px-3 py-1.5 md:px-4 md:py-1.5 rounded-lg bg-gradient-to-b from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 border-t border-orange-300 shadow-[0_2px_10px_rgba(249,115,22,0.3)] transition-all active:scale-95"
                >
                    <span className="text-white font-bold text-[11px] md:text-[12px] leading-tight drop-shadow-sm uppercase">
                        {isOpen ? tRegistration('register.hide', lang) : 'Đăng ký ngay'}
                    </span>
                    <span className="text-white/90 text-[10px] md:text-[11px] leading-tight">
                        {isOpen ? '' : '注册'}
                    </span>
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