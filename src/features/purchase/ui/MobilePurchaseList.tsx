import { Filter, Lock, Settings, Disc, Paperclip, Check } from 'lucide-react';
import { cn } from '@/shared/lib/cn';

// Mock data matching the user's screenshot
const MOCK_DATA = [
    {
        id: '10015947',
        code: '420000000515',
        name: 'Cắt thép không gỉ 1.2mm',
        status: 'ĐÃ DUYỆT',
        icon: Settings,
    },
    {
        id: '10015947',
        code: '420000001154',
        name: 'Đĩa chà nhám 100*16*12mm',
        status: 'ĐANG XỬ LÝ',
        icon: Disc,
    },
    {
        id: '10015946',
        code: '420000003075',
        name: 'Xích đơn RS40-1',
        status: 'ĐÃ DUYỆT',
        icon: Paperclip,
    },
    {
        id: '10015946',
        code: '420000004011',
        name: 'Bộ lọc khí & điều áp',
        status: 'ĐÃ DUYỆT',
        icon: Settings, // generic
    },
    {
        id: '10015946',
        code: '420000004022',
        name: 'Rung điện từ GZV3',
        status: 'ĐANG XỬ LÝ',
        icon: Settings, // generic
    },
    {
        id: '10015948',
        code: '420000005011',
        name: 'Tấm inox 304 1200*2400mm',
        status: 'ĐÃ DUYỆT',
        icon: Settings, // generic
    },
];

export function MobilePurchaseList() {
    return (
        <div className="flex flex-col h-full bg-[#f4f7ff] font-sans overflow-hidden">
            {/* Header: Phân xưởng & Bộ lọc */}
            <div className="flex flex-col bg-white border-b border-gray-200 shrink-0">
                <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100">
                    <button className="flex items-center gap-1.5 text-sm font-medium text-gray-700">
                        <Lock size={16} className="text-gray-500" />
                        <span>Phân xưởng</span>
                    </button>
                    <div className="text-sm font-semibold text-gray-800">
                        element-muahang...
                    </div>
                    <div className="w-4" /> {/* Spacer for centering */}
                </div>
                <div className="px-4 py-2">
                    <button className="flex items-center gap-2 bg-[#3b5998] hover:bg-[#2d4373] text-white text-sm font-medium px-4 py-2 rounded-md shadow-sm transition-colors">
                        <Filter size={16} />
                        Sử dụng bộ lọc
                    </button>
                </div>
            </div>

            {/* List of Cards */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 relative pb-20">
                {MOCK_DATA.map((item, index) => {
                    const isApproved = item.status === 'ĐÃ DUYỆT';
                    const Icon = item.icon;
                    return (
                        <div
                            key={`${item.id}-${index}`}
                            className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col p-4"
                        >
                            {/* Card Header: Yc# and Status */}
                            <div className="flex justify-between items-start mb-1">
                                <div className="text-sm font-bold text-[#2d4373]">
                                    Yc# {item.id}
                                </div>
                                <span
                                    className={cn(
                                        "px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider text-white",
                                        isApproved ? "bg-[#529b55]" : "bg-[#4a89dc]"
                                    )}
                                >
                                    {item.status}
                                </span>
                            </div>

                            {/* Card Content: Code and Name */}
                            <div className="text-xs text-gray-400 mb-2 font-mono">
                                {item.code}
                            </div>
                            
                            <div className="flex items-start gap-2 mb-3">
                                <Icon size={20} className="text-gray-500 mt-0.5 shrink-0" />
                                <div className="text-[15px] font-medium text-gray-800 leading-snug">
                                    {item.name}
                                </div>
                            </div>

                            {/* Card Footer: Action Button */}
                            <div className="flex justify-end mt-auto pt-2 border-t border-gray-50">
                                <button className="px-4 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                                    Chi tiết
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Floating Toast Notification */}
            <div className="absolute bottom-6 left-0 right-0 flex justify-center pointer-events-none">
                <div className="bg-[#488d61] text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 text-sm font-medium opacity-95">
                    <Check size={16} />
                    <span>Đã tải 2390 dòng</span>
                </div>
            </div>
        </div>
    );
}
