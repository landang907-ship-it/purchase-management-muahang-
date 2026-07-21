import imageCompression from 'browser-image-compression';
import { supabase } from './supabaseClient';

const BUCKET_NAME = 'material-images';

export interface UploadResult {
    thumbUrl: string;
    origUrl: string;
}

/**
 * Nén ảnh thành định dạng WebP và tải lên Supabase Storage
 * @param file File ảnh gốc do người dùng chọn
 * @param materialCode Mã vật tư để đặt tên file
 * @returns Đường dẫn công khai của ảnh thumbnail và ảnh gốc
 */
export async function compressAndUploadImage(file: File, materialCode: string): Promise<UploadResult> {
    // Cấu hình nén duy nhất (nhỏ, nhẹ, khoảng 50KB)
    const thumbOptions = {
        maxSizeMB: 0.05, // ~50KB max
        maxWidthOrHeight: 400, // Tăng kích thước chiều ngang lên một chút (từ 200 lên 400) để đảm bảo nhìn rõ chi tiết khi chỉ có 1 ảnh
        useWebWorker: true,
        fileType: 'image/webp',
        initialQuality: 0.7,
    };

    try {
        const thumbFile = await imageCompression(file, thumbOptions);

        const safeCode = materialCode.replace(/[^a-zA-Z0-9_-]/g, '_');
        const thumbPath = `thumbnails/${safeCode}.webp`;

        // Upload lên Supabase Storage
        const thumbUpload = await supabase.storage.from(BUCKET_NAME).upload(thumbPath, thumbFile, {
            contentType: 'image/webp',
            upsert: true, // Ghi đè nếu đã có ảnh cũ
        });

        if (thumbUpload.error) throw thumbUpload.error;

        // Lấy URL công khai
        const { data: thumbData } = supabase.storage.from(BUCKET_NAME).getPublicUrl(thumbPath);

        return {
            thumbUrl: thumbData.publicUrl,
            origUrl: thumbData.publicUrl, // Dùng chung link thumbnail cho cả 2 trường để tương thích DB
        };
    } catch (error) {
        console.error('Error during image compression or upload:', error);
        throw error;
    }
}

/**
 * Nén ảnh cực nhẹ và tải lên thư mục urgent/ trong bucket
 * Dùng cho tính năng Báo cáo Cần gấp (chụp từ điện thoại)
 */
export async function uploadUrgentImage(file: File, uniqueOrderKey: string): Promise<string> {
    const options = {
        maxSizeMB: 0.3, // ~300KB max, "cực nhẹ" như yêu cầu
        maxWidthOrHeight: 1024,
        useWebWorker: true,
        fileType: 'image/webp',
        initialQuality: 0.7,
    };

    try {
        const compressedFile = await imageCompression(file, options);
        const safeKey = uniqueOrderKey.replace(/[^a-zA-Z0-9_-]/g, '_');
        const fileName = `urgent/${safeKey}_${Date.now()}.webp`; // Thêm timestamp để tránh cache khi upload lại

        const { error } = await supabase.storage.from(BUCKET_NAME).upload(fileName, compressedFile, {
            contentType: 'image/webp',
            upsert: true,
        });

        if (error) throw error;

        const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(fileName);
        return data.publicUrl;
    } catch (error) {
        console.error('Error uploading urgent image:', error);
        throw error;
    }
}

/**
 * Xóa ảnh khẩn cấp khỏi Supabase Storage
 */
export async function deleteUrgentImage(publicUrl: string): Promise<void> {
    if (!publicUrl) return;
    try {
        const urlParts = publicUrl.split(`${BUCKET_NAME}/`);
        if (urlParts.length === 2) {
            const filePath = urlParts[1];
            const { error } = await supabase.storage.from(BUCKET_NAME).remove([filePath]);
            if (error) {
                console.error('[deleteUrgentImage] Error:', error);
            }
        }
    } catch (error) {
        console.error('[deleteUrgentImage] Unexpected error:', error);
    }
}
