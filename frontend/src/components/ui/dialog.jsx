import * as React from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
export function Dialog({ open, onOpenChange, children }) {
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
    return (<AnimatePresence>
      {open && (<div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} onClick={() => onOpenChange(false)} className="fixed inset-0 bg-black/60 backdrop-blur-sm"/>
          <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }} transition={{ duration: 0.2, ease: 'easeOut' }} className="relative z-50 w-full max-w-lg rounded-2xl border bg-background p-6 shadow-2xl">
            {children}
          </motion.div>
        </div>)}
    </AnimatePresence>);
}
export function DialogHeader({ className, ...props }) {
    return (<div className={cn('flex flex-col space-y-1.5 text-left mb-4', className)} {...props}/>);
}
export function DialogTitle({ className, ...props }) {
    return (<h2 className={cn('text-xl font-bold leading-none tracking-tight text-foreground', className)} {...props}/>);
}
export function DialogDescription({ className, ...props }) {
    return (<p className={cn('text-sm text-muted-foreground mt-1.5', className)} {...props}/>);
}
export function DialogClose({ onClose }) {
    return (<button onClick={onClose} className="absolute right-4 top-4 rounded-lg p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Close dialog">
      <X className="h-5 w-5"/>
    </button>);
}
