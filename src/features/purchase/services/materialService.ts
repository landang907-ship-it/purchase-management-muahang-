import { supabase } from './supabaseClient';

export interface MaterialImageMap {
    material_code: string;
    thumb_url: string;
    orig_url: string;
}

/**
 * Lưu hoặc cập nhật URL ảnh của vật tư vào database
 */
export async function upsertMaterialImage(materialCode: string, thumbUrl: string, origUrl: string) {
    const { error } = await supabase
        .from('materials')
        .upsert({
            material_code: materialCode,
            thumb_url: thumbUrl,
            orig_url: origUrl,
            updated_at: new Date().toISOString()
        });

    if (error) {
        console.error('Error upserting material image:', error);
        throw error;
    }
}

/**
 * Lấy danh sách URL ảnh cho một tập hợp các mã vật tư
 * @returns Object map: { [materialCode]: MaterialImageMap }
 */
export async function fetchMaterialImages(materialCodes: string[]): Promise<Record<string, MaterialImageMap>> {
    const uniqueCodes = Array.from(new Set(materialCodes.filter(c => c && c.trim() !== '')));
    if (uniqueCodes.length === 0) return {};
    
    // Supabase có giới hạn số lượng item trong bộ lọc 'in', ta chia nhỏ (chunk) để an toàn
    const chunkSize = 100;
    const map: Record<string, MaterialImageMap> = {};
    
    try {
        for (let i = 0; i < uniqueCodes.length; i += chunkSize) {
            const chunk = uniqueCodes.slice(i, i + chunkSize);
            const { data, error } = await supabase
                .from('materials')
                .select('material_code, thumb_url, orig_url')
                .in('material_code', chunk);
                
            if (error) {
                console.error('Error fetching material images for chunk:', error);
                continue;
            }
            
            if (data) {
                for (const item of data) {
                    map[item.material_code] = item;
                }
            }
        }
    } catch (err) {
        console.error('Failed to fetch material images:', err);
    }
    
    return map;
}
