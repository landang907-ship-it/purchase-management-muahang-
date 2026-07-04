/**
 * registrationTranslations – VI/ZH translation map cho form đăng ký tài khoản.
 * Tách riêng để giảm kích thước LoginPage.tsx (đã vượt 300 dòng).
 */
export type SupportedLang = 'VI' | 'ZH';

export type RegistrationKey =
    | 'register.title'
    | 'register.show'
    | 'register.hide'
    | 'register.newUser'
    | 'register.newUserSub'
    | 'register.password'
    | 'register.passwordSub'
    | 'register.confirmPassword'
    | 'register.confirmPasswordSub'
    | 'register.submit'
    | 'register.userRequired'
    | 'register.passwordRequired'
    | 'register.passwordMismatch'
    | 'register.success'
    | 'register.successDetail'
    | 'register.close';

type TranslationMap = Record<RegistrationKey, string>;

const VI: TranslationMap = {
    'register.title': 'Đăng ký tài khoản mới',
    'register.show': 'Đăng ký',
    'register.hide': 'Ẩn',
    'register.newUser': 'USER MỚI :',
    'register.newUserSub': '新用户',
    'register.password': 'MẬT KHẨU :',
    'register.passwordSub': '密码',
    'register.confirmPassword': 'XÁC NHẬN MẬT KHẨU :',
    'register.confirmPasswordSub': '确认密码',
    'register.submit': 'ĐĂNG KÝ',
    'register.userRequired': 'Vui lòng nhập USER',
    'register.passwordRequired': 'Vui lòng nhập mật khẩu',
    'register.passwordMismatch': 'Mật khẩu không khớp',
    'register.success': 'Đăng ký thành công! Vui lòng đăng nhập.',
    'register.successDetail': 'Vui lòng sử dụng thông tin đã đăng ký để đăng nhập.',
    'register.close': 'Đóng',
};

const ZH: TranslationMap = {
    'register.title': '注册新账户',
    'register.show': '注册',
    'register.hide': '隐藏',
    'register.newUser': '新用户 :',
    'register.newUserSub': '新用户',
    'register.password': '密码 :',
    'register.passwordSub': '密码',
    'register.confirmPassword': '确认密码 :',
    'register.confirmPasswordSub': '确认密码',
    'register.submit': '注册',
    'register.userRequired': '请输入用户',
    'register.passwordRequired': '请输入密码',
    'register.passwordMismatch': '密码不匹配',
    'register.success': '注册成功！请登录。',
    'register.successDetail': '请使用注册的账户信息登录。',
    'register.close': '关闭',
};

const MAP: Record<SupportedLang, TranslationMap> = { VI, ZH };

/**
 * Translate a registration key.
 * @param key translation key
 * @param lang target language ('VI' | 'ZH')
 * @returns translated string, fallback to key if missing
 */
export function tRegistration(key: RegistrationKey, lang: SupportedLang): string {
    return MAP[lang]?.[key] ?? key;
}