/**
 * authService – handles user registration and authentication with Supabase.
 */
import { supabase } from '@/lib/supabase';

// Types
export interface UserAccount {
    id: string;
    user: string;
    password: string; // Will be stored as SHA-256 hash
    language: string;
    created_at: string;
}

export interface RegisterResult {
    success: boolean;
    error?: string;
}

export interface LoginResult {
    success: boolean;
    user?: {
        user: string;
        language: string;
    };
    error?: string;
}

/**
 * Hash password using simple SHA-256
 */
async function hashPassword(password: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Check if user exists in database
 */
export async function checkUserExists(userName: string): Promise<boolean> {
    try {
        const { data, error } = await supabase
            .from('accounts')
            .select('id')
            .eq('user', userName.trim())
            .single();

        if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
            console.error('[authService] checkUserExists error:', error);
            return false;
        }

        return data !== null;
    } catch (err) {
        console.error('[authService] checkUserExists error:', err);
        return false;
    }
}

/**
 * Register a new user account in Supabase
 */
export async function registerUser(
    userName: string,
    password: string,
    language: string = 'VI'
): Promise<RegisterResult> {
    try {
        const trimmedUser = userName.trim();

        if (!trimmedUser) {
            return { success: false, error: 'Vui lòng nhập USER' };
        }

        if (trimmedUser.length < 3) {
            return { success: false, error: 'USER phải có ít nhất 3 ký tự' };
        }

        if (!password || password.length < 4) {
            return { success: false, error: 'Mật khẩu phải có ít nhất 4 ký tự' };
        }

        // Check if user already exists
        const exists = await checkUserExists(trimmedUser);
        if (exists) {
            return { success: false, error: 'Tài khoản đã tồn tại' };
        }

        // Hash password before storing
        const hashedPassword = await hashPassword(password);

        // Insert new user
        const { error } = await supabase
            .from('accounts')
            .insert({
                user: trimmedUser,
                password: hashedPassword,
                language: language.toUpperCase(),
            });

        if (error) {
            console.error('[authService] registerUser insert error:', error);

            // Check for unique constraint violation
            if (error.code === '23505') {
                return { success: false, error: 'Tài khoản đã tồn tại' };
            }

            return { success: false, error: 'Đăng ký thất bại. Vui lòng thử lại.' };
        }

        return { success: true };
    } catch (err) {
        console.error('[authService] registerUser error:', err);
        return { success: false, error: 'Lỗi kết nối. Vui lòng thử lại.' };
    }
}

/**
 * Verify user credentials from Supabase
 */
export async function verifyCredentialsFromDB(
    userName: string,
    password: string
): Promise<LoginResult> {
    try {
        const trimmedUser = userName.trim();

        if (!trimmedUser || !password) {
            return { success: false, error: 'Vui lòng nhập đầy đủ thông tin' };
        }

        // Query user from database
        const { data, error } = await supabase
            .from('accounts')
            .select('user, password, language')
            .eq('user', trimmedUser)
            .single();

        if (error) {
            if (error.code === 'PGRST116') {
                return { success: false, error: 'Tài khoản không tồn tại' };
            }
            console.error('[authService] verifyCredentialsFromDB error:', error);
            return { success: false, error: 'Lỗi xác thực' };
        }

        // Verify password
        const hashedPassword = await hashPassword(password);
        if (data.password !== hashedPassword) {
            return { success: false, error: 'Mật khẩu không đúng' };
        }

        return {
            success: true,
            user: {
                user: data.user,
                language: data.language || 'VI',
            },
        };
    } catch (err) {
        console.error('[authService] verifyCredentialsFromDB error:', err);
        return { success: false, error: 'Lỗi kết nối' };
    }
}
