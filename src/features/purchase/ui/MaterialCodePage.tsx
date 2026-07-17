import { Header } from './Header';
import { RightTaskBar } from '@/features/layout/ui/RightTaskBar';
import { Upload } from 'lucide-react';
import { useTranslation } from '@/i18n/useTranslation';
import { useRef } from 'react';
import { useToastQueue } from '@/shared/hooks/useToastQueue';

export function MaterialCodePage() {
    const { t } = useTranslation();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { addToast } = useToastQueue();

    const openFilePicker = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // TODO: implement material code file upload logic
            console.log('Import material code file:', file.name);
            addToast(`Đã chọn file: ${file.name}`, 'info');
        }
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="flex flex-col h-[100dvh] bg-slate-50 overflow-hidden">
            <Header
                actions={
                    <div className="flex items-center gap-1 sm:gap-2 shrink-0 overflow-x-auto scrollbar-hide">
                        <button onClick={openFilePicker} className="flex items-center gap-1.5 px-2 py-1.5 text-white/90 hover:text-white hover:bg-white/10 rounded-md transition-colors shrink-0">
                            <Upload size={15} strokeWidth={2.5} />
                            <span className="hidden sm:block text-[12px] font-semibold whitespace-nowrap">{t('header.import')}</span>
                        </button>
                    </div>
                }
            />
            
            <div
                className="absolute inset-x-0 bottom-0 flex"
                style={{ top: 'calc(env(safe-area-inset-top, 0px) + 56px)' }}
            >
                <RightTaskBar />
                
                <main className="flex-1 overflow-auto bg-gradient-to-br from-slate-50 to-blue-50/50 p-4 md:p-8 lg:p-12" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 2rem)' }}>
                    <div className="max-w-6xl mx-auto w-full flex items-center justify-center h-full text-slate-400">
                        {/* Empty state for material code page */}
                        <p className="text-sm">Trang quản lý mã vật tư</p>
                    </div>
                </main>
            </div>
            
            <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept=".xlsx, .xls, .csv" 
                onChange={handleFileChange} 
            />
        </div>
    );
}
