/**
 * WorkshopPanel – Slide-over panel để quản lý Phân Xưởng & TAG-NAME
 */
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, X, Plus, Pencil, Trash2, ChevronDown, ChevronRight } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { cn } from '@/shared/lib/cn';
import { useTranslation } from '@/i18n/useTranslation';
import type { Workshop } from '@/features/purchase/hooks/useWorkshopConfig';

interface WorkshopPanelProps {
    open: boolean;
    onClose: () => void;
    allTagsFromFile?: string[]; // TAG-NAME từ file import
    tagRowCounts?: Record<string, number>; // Số rows cho mỗi TAG-NAME
    workshops?: Workshop[];
    orphanedTags?: string[];
    onAddWorkshop?: (name: string, tagValues?: string[]) => void;
    onUpdateWorkshop?: (id: string, name: string, tagValues: string[]) => void;
    onDeleteWorkshop?: (id: string) => void;
    onAssignTags?: (tagValues: string[], workshopId: string) => void;
    onRegisterTags?: (tags: string[]) => void;
}

export function WorkshopPanel({
    open,
    onClose,
    allTagsFromFile = [],
    tagRowCounts = {},
    workshops = [],
    orphanedTags = [],
    onAddWorkshop,
    onUpdateWorkshop,
    onDeleteWorkshop,
    onAssignTags,
    onRegisterTags,
}: WorkshopPanelProps) {
    const { t } = useTranslation();

    const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editName, setEditName] = useState('');
    const [editTags, setEditTags] = useState('');
    const [newWorkshopName, setNewWorkshopName] = useState('');
    const [selectedOrphanedTags, setSelectedOrphanedTags] = useState<Set<string>>(new Set());
    const [assignToWorkshop, setAssignToWorkshop] = useState<string>('');
    const [addingNew, setAddingNew] = useState(false);
    const panelRef = useRef<HTMLDivElement>(null);

    // Đăng ký tags mới từ file
    useEffect(() => {
        if (allTagsFromFile.length > 0 && onRegisterTags) {
            onRegisterTags(allTagsFromFile);
        }
    }, [allTagsFromFile, onRegisterTags]);

    // Toggle expand/collapse
    const toggleExpand = (id: string) => {
        setExpandedIds((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    // Bắt đầu sửa
    const startEdit = (ws: Workshop) => {
        setEditingId(ws.id);
        setEditName(ws.name);
        setEditTags(ws.tagValues.join(', '));
    };

    // Lưu sửa
    const saveEdit = () => {
        if (editingId && editName.trim() && onUpdateWorkshop) {
            const tags = editTags.split(',').map((t) => t.trim()).filter(Boolean);
            onUpdateWorkshop(editingId, editName.trim(), tags);
        }
        setEditingId(null);
        setEditName('');
        setEditTags('');
    };

    // Hủy sửa
    const cancelEdit = () => {
        setEditingId(null);
        setEditName('');
        setEditTags('');
    };

    // Thêm phân xưởng mới
    const handleAddWorkshop = () => {
        if (newWorkshopName.trim() && onAddWorkshop) {
            onAddWorkshop(newWorkshopName.trim());
            setNewWorkshopName('');
            setAddingNew(false);
        }
    };

    // Toggle chọn orphaned tag
    const toggleOrphanedTag = (tag: string) => {
        setSelectedOrphanedTags((prev) => {
            const next = new Set(prev);
            if (next.has(tag)) next.delete(tag);
            else next.add(tag);
            return next;
        });
    };

    // Gán tags đã chọn vào phân xưởng
    const handleAssign = () => {
        if (selectedOrphanedTags.size > 0 && assignToWorkshop && onAssignTags) {
            onAssignTags(Array.from(selectedOrphanedTags), assignToWorkshop);
            setSelectedOrphanedTags(new Set());
        }
    };

    // Đếm rows cho mỗi phân xưởng
    const workshopRowCounts = useMemo(() => {
        const counts: Record<string, number> = {};
        for (const ws of workshops) {
            let count = 0;
            for (const tag of ws.tagValues) {
                count += tagRowCounts[tag] || 0;
            }
            counts[ws.id] = count;
        }
        return counts;
    }, [workshops, tagRowCounts]);

    return (
        <AnimatePresence>
            {open && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/30 z-[9998]"
                    />

                    {/* Panel */}
                    <motion.div
                        ref={panelRef}
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl z-[9999] flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-blue-dark text-white">
                            <div className="flex items-center gap-2">
                                <Settings size={18} />
                                <span className="font-semibold text-sm">{t('workshop.panelTitle')}</span>
                            </div>
                            <button
                                type="button"
                                onClick={onClose}
                                className="p-1 hover:bg-white/20 rounded transition-colors"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {/* Workshop List */}
                            <div className="space-y-2">
                                <h3 className="text-xs font-semibold text-text-dark uppercase tracking-wide flex items-center gap-1">
                                    <span>🔧</span> {t('workshop.listTitle')}
                                </h3>

                                {workshops.map((ws) => {
                                    const isEditing = editingId === ws.id;
                                    const isExpanded = expandedIds.has(ws.id);
                                    const rowCount = workshopRowCounts[ws.id] || 0;

                                    return (
                                        <div
                                            key={ws.id}
                                            className="border border-border rounded-lg overflow-hidden bg-white"
                                        >
                                            {isEditing ? (
                                                // Edit mode
                                                <div className="p-3 space-y-2">
                                                    <input
                                                        type="text"
                                                        value={editName}
                                                        onChange={(e) => setEditName(e.target.value)}
                                                        placeholder={t('workshop.namePlaceholder')}
                                                        className="w-full px-2 py-1 border border-border rounded text-sm"
                                                    />
                                                    <input
                                                        type="text"
                                                        value={editTags}
                                                        onChange={(e) => setEditTags(e.target.value)}
                                                        placeholder={t('workshop.tagsPlaceholder')}
                                                        className="w-full px-2 py-1 border border-border rounded text-sm text-xs"
                                                    />
                                                    <div className="flex gap-2 justify-end">
                                                        <button
                                                            type="button"
                                                            onClick={cancelEdit}
                                                            className="px-3 py-1 text-xs text-text-dark hover:bg-gray-100 rounded"
                                                        >
                                                            {t('filter.close')}
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={saveEdit}
                                                            className="px-3 py-1 text-xs bg-blue-mid text-white rounded hover:brightness-110"
                                                        >
                                                            {t('filter.confirm')}
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                // View mode
                                                <>
                                                    <div
                                                        className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-gray-50"
                                                        onClick={() => toggleExpand(ws.id)}
                                                    >
                                                        <button
                                                            type="button"
                                                            className="p-0.5 text-neutral-500"
                                                        >
                                                            {isExpanded ? (
                                                                <ChevronDown size={14} />
                                                            ) : (
                                                                <ChevronRight size={14} />
                                                            )}
                                                        </button>
                                                        <span className="flex-1 font-medium text-sm">{ws.name}</span>
                                                        <span className="text-xs text-neutral-500">
                                                            ({rowCount} rows)
                                                        </span>
                                                        <button
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                startEdit(ws);
                                                            }}
                                                            className="p-1 text-blue-mid hover:bg-blue-mid/10 rounded"
                                                        >
                                                            <Pencil size={13} />
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                if (onDeleteWorkshop) onDeleteWorkshop(ws.id);
                                                            }}
                                                            className="p-1 text-red hover:bg-red/10 rounded"
                                                        >
                                                            <Trash2 size={13} />
                                                        </button>
                                                    </div>

                                                    {isExpanded && (
                                                        <div className="px-3 pb-2 text-xs text-neutral-600">
                                                            <div className="bg-gray-50 rounded p-2">
                                                                <span className="font-semibold">TAG-NAME:</span>{' '}
                                                                {ws.tagValues.join(', ') || (
                                                                    <span className="text-neutral-400 italic">
                                                                        {t('workshop.noTags')}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    );
                                })}

                                {/* Add new workshop */}
                                {addingNew ? (
                                    <div className="border border-blue-mid rounded-lg p-3 space-y-2 bg-blue-mid/5">
                                        <input
                                            type="text"
                                            value={newWorkshopName}
                                            onChange={(e) => setNewWorkshopName(e.target.value)}
                                            placeholder={t('workshop.namePlaceholder')}
                                            className="w-full px-2 py-1 border border-border rounded text-sm"
                                            autoFocus
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') handleAddWorkshop();
                                                if (e.key === 'Escape') setAddingNew(false);
                                            }}
                                        />
                                        <div className="flex gap-2 justify-end">
                                            <button
                                                type="button"
                                                onClick={() => setAddingNew(false)}
                                                className="px-3 py-1 text-xs text-text-dark hover:bg-gray-100 rounded"
                                            >
                                                {t('filter.close')}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={handleAddWorkshop}
                                                className="px-3 py-1 text-xs bg-blue-mid text-white rounded hover:brightness-110"
                                            >
                                                {t('filter.confirm')}
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => setAddingNew(true)}
                                        className="w-full flex items-center justify-center gap-1 py-2 border border-dashed border-border rounded-lg text-sm text-blue-mid hover:bg-blue-mid/5 transition-colors"
                                    >
                                        <Plus size={14} />
                                        {t('workshop.addNew')}
                                    </button>
                                )}
                            </div>

                            {/* Orphaned Tags Section */}
                            {orphanedTags.length > 0 && (
                                <div className="space-y-2">
                                    <h3 className="text-xs font-semibold text-text-dark uppercase tracking-wide flex items-center gap-1">
                                        <span>🏷️</span> {t('workshop.orphanedTitle')} ({orphanedTags.length})
                                    </h3>

                                    <div className="border border-border rounded-lg p-3 space-y-2 bg-gray-50">
                                        <div className="flex flex-wrap gap-1">
                                            {orphanedTags.map((tag) => {
                                                const isSelected = selectedOrphanedTags.has(tag);
                                                const rowCount = tagRowCounts[tag] || 0;
                                                return (
                                                    <button
                                                        key={tag}
                                                        type="button"
                                                        onClick={() => toggleOrphanedTag(tag)}
                                                        className={cn(
                                                            'flex items-center gap-1 px-2 py-1 rounded text-xs border transition-colors',
                                                            isSelected
                                                                ? 'bg-blue-mid text-white border-blue-mid'
                                                                : 'bg-white text-text-dark border-border hover:border-blue-mid',
                                                        )}
                                                    >
                                                        <span>{isSelected ? '✓' : ''}</span>
                                                        <span>{tag}</span>
                                                        <span className="text-[10px] opacity-70">({rowCount})</span>
                                                    </button>
                                                );
                                            })}
                                        </div>

                                        {selectedOrphanedTags.size > 0 && (
                                            <div className="flex items-center gap-2 pt-2 border-t border-border">
                                                <select
                                                    value={assignToWorkshop}
                                                    onChange={(e) => setAssignToWorkshop(e.target.value)}
                                                    className="flex-1 px-2 py-1 border border-border rounded text-xs"
                                                >
                                                    <option value="">{t('workshop.selectWorkshop')}</option>
                                                    {workshops.map((ws) => (
                                                        <option key={ws.id} value={ws.id}>
                                                            {ws.name}
                                                        </option>
                                                    ))}
                                                </select>
                                                <button
                                                    type="button"
                                                    onClick={handleAssign}
                                                    disabled={!assignToWorkshop}
                                                    className="px-3 py-1 text-xs bg-blue-mid text-white rounded hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    {t('workshop.assign')}
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="px-4 py-3 border-t border-border">
                            <button
                                type="button"
                                onClick={onClose}
                                className="w-full py-2 bg-blue-dark text-white rounded-md hover:brightness-110 transition-[filter] text-sm font-semibold"
                            >
                                {t('filter.close')}
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

// Settings icon button for header
export function SettingsButton({ onClick }: { onClick: () => void }) {
    const { t } = useTranslation();
    return (
        <button
            type="button"
            onClick={onClick}
            title={t('workshop.panelTitle')}
            className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-md transition-colors"
        >
            <Settings size={18} />
        </button>
    );
}
