import { motion } from 'motion/react';
import { Filter, ListFilter, ImagePlus, CheckCircle } from 'lucide-react';
import { cn } from '@/shared/lib/cn';

export function WelcomeGuide() {

    const steps = [
        {
            icon: <Filter className="text-gray-900" size={22} strokeWidth={1.8} />,
            title: 'Chọn phân xưởng',
            description: 'Sử dụng menu thả xuống ở góc trên bên trái để chọn xưởng bạn muốn xem dữ liệu.',
        },
        {
            icon: <ListFilter className="text-gray-900" size={22} strokeWidth={1.8} />,
            title: 'Lọc & Tìm kiếm',
            description: 'Tìm kiếm nhanh hoặc lọc theo người yêu cầu, trạng thái xử lý và ngày tháng.',
        },
        {
            icon: <ImagePlus className="text-gray-900" size={22} strokeWidth={1.8} />,
            title: 'Cập nhật hình ảnh',
            description: 'Nhấn vào từng đơn hàng để xem chi tiết và tải lên hình ảnh thực tế của vật tư.',
        },
        {
            icon: <CheckCircle className="text-gray-900" size={22} strokeWidth={1.8} />,
            title: 'Theo dõi tiến độ',
            description: 'Quản lý trạng thái xử lý của từng yêu cầu mua hàng một cách trực quan.',
        }
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={cn(
                'flex-1 flex flex-col items-center justify-center relative',
                'px-4 py-12 overflow-y-auto overflow-x-hidden',
            )}
        >
            <div 
                className="absolute inset-0 z-0"
                style={{
                    backgroundImage: 'url(/login-bg.webp)',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                    backgroundSize: 'cover',
                    backgroundAttachment: 'fixed',
                    opacity: 0.15
                }}
            />
            
            <div className="max-w-3xl w-full mx-auto space-y-12 z-10">
                <div className="text-center space-y-4">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.1, duration: 0.5, type: 'spring', stiffness: 200, damping: 20 }}
                        className="inline-flex items-center justify-center w-16 h-16 rounded-[22px] bg-white shadow-[0_8px_30px_rgb(0,0,0,0.08)] mb-4"
                    >
                        <Filter className="text-[#007AFF]" size={32} strokeWidth={1.5} />
                    </motion.div>
                    <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 tracking-tight">
                        Vui lòng chọn xưởng
                    </h2>
                    <p className="text-gray-500 max-w-lg mx-auto text-base md:text-[17px] leading-relaxed tracking-normal">
                        Dữ liệu đã được tải lên thành công. Hãy làm theo các bước dưới đây để bắt đầu.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6 mt-8">
                    {steps.map((step, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 + index * 0.1, duration: 0.5, type: 'spring' }}
                            className={cn(
                                'flex flex-col gap-4 p-6 rounded-[24px]',
                                'bg-white/70 backdrop-blur-xl border border-white/80',
                                'shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300'
                            )}
                        >
                            <div className="w-10 h-10 rounded-full bg-gray-100/80 flex items-center justify-center">
                                {step.icon}
                            </div>
                            <div className="space-y-1.5">
                                <h3 className="font-semibold text-gray-900 text-[17px] tracking-tight">
                                    {step.title}
                                </h3>
                                <p className="text-gray-500 text-[15px] leading-relaxed">
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
