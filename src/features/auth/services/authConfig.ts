/**
 * authConfig – mock auth config for SAP login (no backend yet).
 * Replace with API call to SAP backend when ready.
 */

export interface AuthConfig {
    /** Map user → password. */
    validUsers: Readonly<Record<string, string>>;
}

/**
 * Test accounts (mock).
 * In production, replace with API call: `POST /sap/login` → returns token.
 */
export const DEFAULT_AUTH_CONFIG: AuthConfig = {
    validUsers: Object.freeze({
        admin123: '13071997',
    }),
};

export type CredentialsCheckResult =
    | { ok: true }
    | { ok: false; error: string };

/**
 * Validate user/password.
 */
export function validateCredentials(
    user: string,
    password: string,
    config: AuthConfig = DEFAULT_AUTH_CONFIG,
): CredentialsCheckResult {
    const trimmed = user.trim();
    if (!trimmed) {
        return { ok: false, error: 'Vui lòng nhập USER (请输入账号)' };
    }
    const expectedPassword = config.validUsers[trimmed];
    if (expectedPassword === undefined) {
        return { ok: false, error: 'Tài khoản không tồn tại (账号不存在)' };
    }
    if (expectedPassword !== password) {
        return { ok: false, error: 'Mật khẩu không đúng (密码错误)' };
    }
    return { ok: true };
}
