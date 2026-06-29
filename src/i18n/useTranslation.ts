/**
 * useTranslation – hook to get translation function based on user's language.
 * Falls back to 'VI' if user.language is not 'ZH'.
 */
import { useAuth } from '@/features/auth/hooks/useAuth';
import { t, type Lang } from '@/i18n';

export function useTranslation() {
    const { user } = useAuth();
    const lang: Lang = user?.language === 'ZH' ? 'ZH' : 'VI';
    // Return a bound version of t so callers only pass the key (+ optional params)
    const translate = (key: string, params?: Record<string, string | number>) => t(key, lang, params);
    return { t: translate, lang };
}
