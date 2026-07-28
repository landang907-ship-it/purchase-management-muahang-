/**
 * SiteFooter – auto-year copyright.
 */
import { getCurrentYear } from '@/features/purchase/lib/date';

export function SiteFooter() {
    const year = getCurrentYear();
    return (
        <footer className="anim-fade-up-300 text-center text-[11px] text-white/60">
            <p>© {year} Want Want Việt Nam</p>
        </footer>
    );
}
