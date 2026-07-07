/**
 * useWorkshopConfig – quản lý cấu hình Phân Xưởng & TAG-NAME
 * Lưu vào localStorage để nhớ khi reload trang.
 */
import { useCallback, useEffect, useMemo, useState } from 'react';

export interface Workshop {
    id: string;
    name: string;
    tagValues: string[]; // Các TAG-NAME thuộc phân xưởng này
}

const STORAGE_KEY = 'purchase_workshop_config';

const DEFAULT_WORKSHOP: Workshop = {
    id: 'default',
    name: 'Want-Want Việt Nam',
    tagValues: ['VN005922'],
};

function loadFromStorage(): Workshop[] {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
            const parsed = JSON.parse(raw) as Workshop[];
            if (Array.isArray(parsed) && parsed.length > 0) {
                return parsed;
            }
        }
    } catch {
        // ignore
    }
    return [DEFAULT_WORKSHOP];
}

function saveToStorage(workshops: Workshop[]) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(workshops));
    } catch {
        // ignore
    }
}

export interface UseWorkshopConfigResult {
    workshops: Workshop[];
    selectedWorkshopIds: string[];
    tagOptions: string[]; // Tất cả TAG-NAME từ tất cả phân xưởng
    orphanedTags: string[]; // TAG-NAME chưa được gán vào phân xưởng nào
    workshopOptions: string[]; // Tên các phân xưởng để hiển thị trong filter

    // Filter
    setSelectedWorkshopIds: (ids: string[]) => void;

    // CRUD
    addWorkshop: (name: string, tagValues?: string[]) => void;
    updateWorkshop: (id: string, name: string, tagValues: string[]) => void;
    deleteWorkshop: (id: string) => void;
    assignTagsToWorkshop: (tagValues: string[], workshopId: string) => void;

    // Import
    setOrphanedTags: (tags: string[]) => void;
    registerNewTags: (tags: string[]) => void;
}

export function useWorkshopConfig(): UseWorkshopConfigResult {
    const [workshops, setWorkshops] = useState<Workshop[]>(loadFromStorage);
    const [selectedWorkshopIds, setSelectedWorkshopIds] = useState<string[]>([]);
    const [orphanedTags, setOrphanedTagsState] = useState<string[]>([]);

    // Lưu vào storage khi thay đổi
    useEffect(() => {
        saveToStorage(workshops);
    }, [workshops]);

    // Tất cả TAG-NAME từ tất cả phân xưởng
    const tagOptions = useMemo(() => {
        const set = new Set<string>();
        for (const w of workshops) {
            for (const tag of w.tagValues) {
                set.add(tag);
            }
        }
        return Array.from(set).sort();
    }, [workshops]);

    // Workshop options cho filter (tên phân xưởng)
    const workshopOptions = useMemo(() => {
        return workshops.map((w) => w.name);
    }, [workshops]);

    // Thêm phân xưởng mới
    const addWorkshop = useCallback((name: string, tagValues: string[] = []) => {
        const id = `ws_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
        setWorkshops((prev) => [...prev, { id, name, tagValues }]);
    }, []);

    // Cập nhật phân xưởng
    const updateWorkshop = useCallback((id: string, name: string, tagValues: string[]) => {
        setWorkshops((prev) =>
            prev.map((w) => (w.id === id ? { ...w, name, tagValues } : w))
        );
    }, []);

    // Xóa phân xưởng
    const deleteWorkshop = useCallback((id: string) => {
        setWorkshops((prev) => prev.filter((w) => w.id !== id));
        setSelectedWorkshopIds((prev) => prev.filter((wid) => wid !== id));
    }, []);

    // Gán TAG-NAME vào phân xưởng
    const assignTagsToWorkshop = useCallback((tagValues: string[], workshopId: string) => {
        setWorkshops((prev) =>
            prev.map((w) => {
                if (w.id !== workshopId) return w;
                const existingTags = new Set(w.tagValues);
                for (const tag of tagValues) {
                    existingTags.add(tag);
                }
                return { ...w, tagValues: Array.from(existingTags) };
            })
        );
        // Xóa khỏi orphaned
        setOrphanedTagsState((prev) => prev.filter((t) => !tagValues.includes(t)));
    }, []);

    // Cập nhật orphaned tags (từ import file)
    const setOrphanedTags = useCallback((tags: string[]) => {
        setOrphanedTagsState(tags);
    }, []);

    // Đăng ký tags mới từ file import (loại bỏ tags đã có trong config)
    const registerNewTags = useCallback((tags: string[]) => {
        const existingTags = new Set(tagOptions);
        const newTags = tags.filter((t) => !existingTags.has(t));
        if (newTags.length > 0) {
            setOrphanedTagsState((prev) => {
                const current = new Set(prev);
                for (const t of newTags) {
                    current.add(t);
                }
                return Array.from(current).sort();
            });
        }
    }, [tagOptions]);

    return {
        workshops,
        selectedWorkshopIds,
        tagOptions,
        orphanedTags,
        workshopOptions,
        setSelectedWorkshopIds,
        addWorkshop,
        updateWorkshop,
        deleteWorkshop,
        assignTagsToWorkshop,
        setOrphanedTags,
        registerNewTags,
    };
}
