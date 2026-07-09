import { useState, useEffect } from 'react';
import type { PurchaseRow } from '@/features/purchase/services/excel';
import { fetchMaterialImages, type MaterialImageMap } from '@/features/purchase/services/materialService';

export function useMaterialImages(rows: PurchaseRow[]) {
    const [images, setImages] = useState<Record<string, MaterialImageMap>>({});

    useEffect(() => {
        // Extract unique material codes from current rows
        const codes = Array.from(new Set(rows.map(r => r['Vật tư']).filter(c => c && c.trim() !== '')));
        
        if (codes.length === 0) {
            setImages({});
            return;
        }

        // Fetch images for these codes
        fetchMaterialImages(codes).then(map => {
            setImages(map);
        }).catch(err => {
            console.error('Error fetching material images:', err);
        });

    }, [rows]);

    return { images, setImages };
}
