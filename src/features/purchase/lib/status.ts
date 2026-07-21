export function formatStatusText(status: string): string {
    const s = status.trim();
    if (s === '3' || s === '03') return 'Chờ duyệt';
    if (s === '5' || s === '05') return 'Đã duyệt';
    if (s === '8' || s === '08') return 'Từ chối';
    return status.toUpperCase();
}

export function getStatusColorClass(status: string, isApproved?: boolean): string {
    const s = status.trim();
    if (s === '3' || s === '03') return 'bg-yellow-500';
    if (s === '5' || s === '05') return 'bg-green-500';
    if (s === '8' || s === '08') return 'bg-red-500';
    if (isApproved || s.toUpperCase().includes('ĐÃ DUYỆT')) return 'bg-[#529b55]';
    return 'bg-[#4a89dc]';
}
