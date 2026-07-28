/**
 * useWorkshopConfig ΓÇô quß║ún l├╜ cß║Ñu h├¼nh Ph├ón X╞░ß╗ƒng & TAG-NAME
 * L╞░u v├áo localStorage ─æß╗â nhß╗¢ khi reload trang.
 */
import { useCallback, useEffect, useMemo, useState } from 'react';

export interface Workshop {
    id: string;
    name: string;
    tagValues: string[]; // C├íc TAG-NAME thuß╗Öc ph├ón x╞░ß╗ƒng n├áy
}

const STORAGE_KEY = 'purchase_workshop_config';

const DEFAULT_WORKSHOP: Workshop = {
    id: 'default',
    name: 'Want-Want Viß╗çt Nam',
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
    tagOptions: string[]; // Tß║Ñt cß║ú TAG-NAME tß╗½ tß║Ñt cß║ú ph├ón x╞░ß╗ƒng
    orphanedTags: string[]; // TAG-NAME ch╞░a ─æ╞░ß╗úc g├ín v├áo ph├ón x╞░ß╗ƒng n├áo
    workshopOptions: string[]; // T├¬n c├íc ph├ón x╞░ß╗ƒng ─æß╗â hiß╗ân thß╗ï trong filter

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

    // L╞░u v├áo storage khi thay ─æß╗òi
    useEffect(() => {
        saveToStorage(workshops);
    }, [workshops]);

    // Tß║Ñt cß║ú TAG-NAME tß╗½ tß║Ñt cß║ú ph├ón x╞░ß╗ƒng
    const tagOptions = useMemo(() => {
        const set = new Set<string>();
        for (const w of workshops) {
            for (const tag of w.tagValues) {
                set.add(tag);
            }
        }
        return Array.from(set).sort();
    }, [workshops]);

    // Workshop options cho filter (t├¬n ph├ón x╞░ß╗ƒng)
    const workshopOptions = useMemo(() => {
        return workshops.map((w) => w.name);
    }, [workshops]);

    // Th├¬m ph├ón x╞░ß╗ƒng mß╗¢i
    const addWorkshop = useCallback((name: string, tagValues: string[] = []) => {
        const id = `ws_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
        setWorkshops((prev) => [...prev, { id, name, tagValues }]);
    }, []);

    // Cß║¡p nhß║¡t ph├ón x╞░ß╗ƒng
    const updateWorkshop = useCallback((id: string, name: string, tagValues: string[]) => {
        setWorkshops((prev) =>
            prev.map((w) => (w.id === id ? { ...w, name, tagValues } : w))
        );
    }, []);

    // X├│a ph├ón x╞░ß╗ƒng
    const deleteWorkshop = useCallback((id: string) => {
        setWorkshops((prev) => prev.filter((w) => w.id !== id));
        setSelectedWorkshopIds((prev) => prev.filter((wid) => wid !== id));
    }, []);

    // G├ín TAG-NAME v├áo ph├ón x╞░ß╗ƒng
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
        // X├│a khß╗Åi orphaned
        setOrphanedTagsState((prev) => prev.filter((t) => !tagValues.includes(t)));
    }, []);

    // Cß║¡p nhß║¡t orphaned tags (tß╗½ import file)
    const setOrphanedTags = useCallback((tags: string[]) => {
        setOrphanedTagsState(tags);
    }, []);

    // ─É─âng k├╜ tags mß╗¢i tß╗½ file import (loß║íi bß╗Å tags ─æ├ú c├│ trong config)
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
