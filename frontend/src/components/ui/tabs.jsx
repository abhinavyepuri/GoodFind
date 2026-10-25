import * as React from 'react';
import { cn } from '@/lib/utils';
const TabsContext = React.createContext(null);
export function Tabs({ value, onValueChange, children, className, }) {
    return (<TabsContext.Provider value={{ value, onValueChange }}>
      <div className={cn('w-full', className)}>{children}</div>
    </TabsContext.Provider>);
}
export function TabsList({ children, className, }) {
    return (<div className={cn('inline-flex h-11 items-center justify-start rounded-xl bg-muted/60 p-1 text-muted-foreground border', className)}>
      {children}
    </div>);
}
export function TabsTrigger({ value, children, className, }) {
    const context = React.useContext(TabsContext);
    if (!context)
        throw new Error('TabsTrigger must be used within Tabs');
    const isActive = context.value === value;
    return (<button type="button" onClick={() => context.onValueChange(value)} className={cn('inline-flex items-center justify-center whitespace-nowrap rounded-lg px-3.5 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50', isActive
            ? 'bg-background text-foreground shadow-sm font-semibold'
            : 'text-muted-foreground hover:text-foreground', className)}>
      {children}
    </button>);
}
export function TabsContent({ value, children, className, }) {
    const context = React.useContext(TabsContext);
    if (!context)
        throw new Error('TabsContent must be used within Tabs');
    if (context.value !== value)
        return null;
    return (<div className={cn('mt-4 ring-offset-background focus-visible:outline-none animate-fade-in', className)}>
      {children}
    </div>);
}
