import * as React from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
export function AccordionItem({ title, children, defaultOpen = false, className, }) {
    const [isOpen, setIsOpen] = React.useState(defaultOpen);
    return (<div className={cn('border-b border-border/80 py-3', className)}>
      <button type="button" onClick={() => setIsOpen(!isOpen)} className="flex w-full items-center justify-between py-2 text-left text-sm font-semibold text-foreground transition-all hover:text-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" aria-expanded={isOpen}>
        <span>{title}</span>
        <ChevronDown className={cn('h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200', isOpen && 'rotate-180 text-primary')}/>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (<motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25, ease: 'easeInOut' }} className="overflow-hidden">
            <div className="pb-3 pt-1 text-sm text-muted-foreground leading-relaxed">
              {children}
            </div>
          </motion.div>)}
      </AnimatePresence>
    </div>);
}
