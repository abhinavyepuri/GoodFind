import * as React from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
export function Sheet({ open, onOpenChange, side = 'right', className, children, }) {
    React.useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape')
                onOpenChange(false);
        };
        if (open) {
            document.body.style.overflow = 'hidden';
            window.addEventListener('keydown', handleKeyDown);
        }
        return () => {
            document.body.style.overflow = 'unset';
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [open, onOpenChange]);
    const initialX = side === 'right' ? '100%' : '-100%';
    return (<AnimatePresence>
      {open && (<div className="fixed inset-0 z-50 flex">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} onClick={() => onOpenChange(false)} className="fixed inset-0 bg-black/60 backdrop-blur-sm"/>
          <motion.div initial={{ x: initialX }} animate={{ x: 0 }} exit={{ x: initialX }} transition={{ type: 'spring', damping: 28, stiffness: 300 }} className={cn('fixed top-0 bottom-0 z-50 flex h-full w-full max-w-md flex-col bg-background p-6 shadow-2xl overflow-y-auto', side === 'right' ? 'right-0 border-l' : 'left-0 border-r', className)}>
            {children}
          </motion.div>
        </div>)}
    </AnimatePresence>);
}
export function SheetHeader({ className, ...props }) {
    return (<div className={cn('flex items-center justify-between border-b pb-4 mb-4', className)} {...props}/>);
}
export function SheetTitle({ className, ...props }) {
    return (<h3 className={cn('text-lg font-bold text-foreground', className)} {...props}/>);
}
export function SheetClose({ onClose }) {
    return (<button onClick={onClose} className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Close drawer">
      <X className="h-5 w-5"/>
    </button>);
}
