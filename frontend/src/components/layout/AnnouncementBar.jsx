import * as React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, X, Sparkles } from 'lucide-react';
import { useProductStore } from '@/store/productStore';
export function AnnouncementBar() {
    const [isVisible, setIsVisible] = React.useState(true);
    const settings = useProductStore((state) => state.settings);
    const { enabled, text, linkText, linkUrl } = settings.announcement;
    if (!enabled || !isVisible)
        return null;
    return (<aside aria-label="Store announcement" className="relative z-40 bg-zinc-950 text-zinc-100 text-xs py-2 px-4 border-b border-zinc-800 transition-all dark:bg-zinc-900 dark:border-zinc-800">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex-1 flex items-center justify-center gap-2 text-center flex-wrap">
          <span className="inline-flex items-center gap-1.5 font-semibold text-zinc-200">
            <Sparkles className="h-3.5 w-3.5 shrink-0"/>
            <span className="hidden sm:inline">Special Offer:</span>
          </span>
          <span className="text-zinc-300">{text}</span>
          {linkText && linkUrl && (<Link to={linkUrl} className="inline-flex items-center gap-1 font-semibold text-white underline underline-offset-4 hover:text-zinc-300 transition-colors ml-1">
              {linkText}
              <ArrowRight className="h-3 w-3"/>
            </Link>)}
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button onClick={() => setIsVisible(false)} aria-label="Dismiss banner" className="p-1 text-zinc-400 hover:text-zinc-100 transition-colors rounded focus:outline-none focus:ring-1 focus:ring-zinc-400">
            <X className="h-3.5 w-3.5"/>
          </button>
        </div>
      </div>
    </aside>);
}
