import * as React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
export const Select = React.forwardRef(({ className, error, children, ...props }, ref) => {
    return (<div className="relative w-full">
        <select ref={ref} className={cn('flex h-10 w-full appearance-none rounded-lg border border-input bg-background px-3.5 py-2 pr-9 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 transition-colors', error && 'border-destructive focus-visible:ring-destructive', className)} {...props}>
          {children}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-3 h-4 w-4 text-muted-foreground"/>
        {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
      </div>);
});
Select.displayName = 'Select';
