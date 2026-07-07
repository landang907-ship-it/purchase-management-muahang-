/**
 * useRegisterForm – custom hook quản lý state + logic cho form đăng ký tài khoản.
 * Tách ra từ LoginPage để giảm kích thước component.
 */
import { useCallback, useState } from 'react';
import { registerUser } from '@/features/auth/services/authService';
import { tRegistration, type SupportedLang } from '@/features/auth/i18n/registrationTranslations';

export interface RegisterFormState {
    user: string;
    password: string;
    confirmPassword: string;
}

export interface RegisterFormErrors {
    user: string;
    password: string;
    confirmPassword: string;
}

const EMPTY_FORM: RegisterFormState = { user: '', password: '', confirmPassword: '' };
const EMPTY_ERRORS: RegisterFormErrors = { user: '', password: '', confirmPassword: '' };

export type RegisterSubmitStatus = 'idle' | 'submitting' | 'success' | 'error';

export interface UseRegisterFormResult {
    form: RegisterFormState;
    errors: RegisterFormErrors;
    isRegisterMode: boolean;
    isSuccess: boolean;
    isSubmitting: boolean;
    lang: SupportedLang;
    setField: (key: keyof RegisterFormState, value: string) => void;
    toggleMode: () => void;
    reset: () => void;
    submit: (
        loginLang: string,
        showToast: (text: string, variant: 'default' | 'info' | 'success' | 'warning' | 'error') => void,
    ) => Promise<RegisterSubmitStatus>;
}

/**
 * Hook for the registration form. Language is derived from the parent's
 * login form language (since the user is not logged in yet).
 */
export function useRegisterForm(): UseRegisterFormResult {
    const [form, setForm] = useState<RegisterFormState>(EMPTY_FORM);
    const [errors, setErrors] = useState<RegisterFormErrors>(EMPTY_ERRORS);
    const [isRegisterMode, setIsRegisterMode] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const setField = useCallback((key: keyof RegisterFormState, value: string) => {
        setForm((prev) => ({ ...prev, [key]: value }));
        setErrors((prev) => (prev[key] ? { ...prev, [key]: '' } : prev));
    }, []);

    const toggleMode = useCallback(() => {
        setIsRegisterMode((prev) => !prev);
    }, []);

    const reset = useCallback(() => {
        setForm(EMPTY_FORM);
        setErrors(EMPTY_ERRORS);
        setIsSuccess(false);
        setIsRegisterMode(false);
    }, []);

    const submit = useCallback(
        async (
            loginLang: string,
            showToast: (text: string, variant: 'default' | 'info' | 'success' | 'warning' | 'error') => void,
        ): Promise<RegisterSubmitStatus> => {
            const lang: SupportedLang = loginLang === 'ZH' ? 'ZH' : 'VI';

            const nextErrors: RegisterFormErrors = {
                user: form.user.trim() ? '' : tRegistration('register.userRequired', lang),
                password: form.password.trim()
                    ? ''
                    : tRegistration('register.passwordRequired', lang),
                confirmPassword:
                    form.password !== form.confirmPassword
                        ? tRegistration('register.passwordMismatch', lang)
                        : '',
            };
            setErrors(nextErrors);
            if (Object.values(nextErrors).some(Boolean)) return 'error';

            setIsSubmitting(true);
            const result = await registerUser(form.user, form.password, loginLang);
            setIsSubmitting(false);

            if (result.success) {
                setIsSuccess(true);
                showToast(tRegistration('register.success', lang), 'success');
                return 'success';
            }

            const errMsg = result.error ?? 'Đăng ký thất bại';
            const isUserField = /USER|tài khoản/i.test(errMsg);
            setErrors({
                user: isUserField ? errMsg : '',
                password: isUserField ? '' : errMsg,
                confirmPassword: '',
            });
            showToast(errMsg, 'error');
            return 'error';
        },
        [form],
    );

    return {
        form,
        errors,
        isRegisterMode,
        isSuccess,
        isSubmitting,
        lang: 'VI', // lang is recomputed inside submit() because we need parent's loginLang
        setField,
        toggleMode,
        reset,
        submit,
    };
}