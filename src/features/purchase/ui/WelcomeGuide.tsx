import { motion } from 'motion/react';
import { Filter, ListFilter, ImagePlus, CheckCircle } from 'lucide-react';
import { cn } from '@/shared/lib/cn';
import { useTranslation } from '@/i18n/useTranslation';

export function WelcomeGuide() {
    const { t } = useTranslation();

    const steps = [
        {
            icon: <Filter className="text-blue-500" size={24} />,
            title: '1. Chọn phân xưởng',
            description: 'Sử dụng menu thả xuống ở góc trên bên trái để chọn xưởng bạn muốn xem dữ liệu.',
            bg: 'bg-blue-50',
            border: 'border-blue-100'
        },
        {
            icon: <ListFilter className="text-purple-500" size={24} />,
            title: '2. Lọc & Tìm kiếm',
            description: 'Tìm kiếm nhanh hoặc lọc theo người yêu cầu, trạng thái xử lý và ngày tháng.',
            bg: 'bg-purple-50',
            border: 'border-purple-100'
        },
        {
            icon: <ImagePlus className="text-pink-500" size={24} />,
            title: '3. Cập nhật hình ảnh',
            description: 'Nhấn vào từng đơn hàng để xem chi tiết và tải lên hình ảnh thực tế của vật tư.',
            bg: 'bg-pink-50',
            border: 'border-pink-100'
        },
        {
            icon: <CheckCircle className="text-emerald-500" size={24} />,
            title: '4. Theo dõi tiến độ',
            description: 'Quản lý trạng thái xử lý của từng yêu cầu mua hàng một cách trực quan.',
            bg: 'bg-emerald-50',
            border: 'border-emerald-100'
        }
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={cn(
                'flex-1 flex flex-col items-center justify-center',
                'px-4 py-8 overflow-y-auto overflow-x-hidden',
            )}
            style={{
                backgroundImage: 'linear-gradient(rgba(244, 247, 255, 0.85), rgba(244, 247, 255, 0.95)), url(/login-bg.webp)',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                backgroundSize: 'cover',
                backgroundAttachment: 'fixed'
            }}
        >
            <div className="max-w-4xl w-full mx-auto space-y-8">
                <div className="text-center space-y-3">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.1, duration: 0.4 }}
                        className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white shadow-sm border border-gray-100 mb-2"
                    >
                        <Filter className="text-blue-600" size={32} />
                    </motion.div>
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-800 tracking-tight">
                        Vui lòng chọn xưởng để bắt đầu
                    </h2>
                    <p className="text-gray-500 max-w-lg mx-auto text-sm md:text-base leading-relaxed">
                        Dữ liệu đã được tải lên thành công. Hãy làm theo các bước dưới đây để quản lý và theo dõi các yêu cầu mua hàng.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mt-8">
                    {steps.map((step, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 + index * 0.1, duration: 0.4 }}
                            className={cn(
                                'flex items-start gap-4 p-5 rounded-2xl',
                                'bg-white/60 backdrop-blur-md border shadow-sm hover:shadow-md transition-shadow',
                                step.border
                            )}
                        >
                            <div className={cn('p-3 rounded-xl shrink-0', step.bg)}>
                                {step.icon}
                            </div>
                            <div className="space-y-1">
                                <h3 className="font-semibold text-gray-800 text-base">
                                    {step.title}
                                </h3>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    {step.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
}
