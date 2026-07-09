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
    // 1. Cấu hình nén cho Thumbnail (nhỏ, nhẹ, để hiện danh sách)
    const thumbOptions = {
        maxSizeMB: 0.05, // ~50KB max
        maxWidthOrHeight: 200,
        useWebWorker: true,
        fileType: 'image/webp',
        initialQuality: 0.6,
    };

    // 2. Cấu hình nén cho Original (chất lượng cao, xem chi tiết)
    const origOptions = {
        maxSizeMB: 1, // ~1MB max
        maxWidthOrHeight: 1200,
        useWebWorker: true,
        fileType: 'image/webp',
        initialQuality: 0.8,
    };

    try {
        // Nén song song 2 phiên bản
        const [thumbFile, origFile] = await Promise.all([
            imageCompression(file, thumbOptions),
            imageCompression(file, origOptions),
        ]);

        const safeCode = materialCode.replace(/[^a-zA-Z0-9_-]/g, '_');
        const thumbPath = `thumbnails/${safeCode}.webp`;
        const origPath = `originals/${safeCode}.webp`;

        // Upload song song lên Supabase Storage
        const [thumbUpload, origUpload] = await Promise.all([
            supabase.storage.from(BUCKET_NAME).upload(thumbPath, thumbFile, {
                contentType: 'image/webp',
                upsert: true, // Ghi đè nếu đã có ảnh cũ
            }),
            supabase.storage.from(BUCKET_NAME).upload(origPath, origFile, {
                contentType: 'image/webp',
                upsert: true,
            })
        ]);

        if (thumbUpload.error) throw thumbUpload.error;
        if (origUpload.error) throw origUpload.error;

        // Lấy URL công khai
        const { data: thumbData } = supabase.storage.from(BUCKET_NAME).getPublicUrl(thumbPath);
        const { data: origData } = supabase.storage.from(BUCKET_NAME).getPublicUrl(origPath);

        return {
            thumbUrl: thumbData.publicUrl,
            origUrl: origData.publicUrl,
        };
    } catch (error) {
        console.error('Error during image compression or upload:', error);
        throw error;
    }
}
