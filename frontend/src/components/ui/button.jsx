import * as React from 'react';
import { cva } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
const buttonVariants = cva('inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]', {
    variants: {
        variant: {
            default: 'bg-primary text-primary-foreground shadow hover:bg-primary/90 hover:shadow-md',
            destructive: 'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90',
            outline: 'border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground',
            secondary: 'bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80',
            ghost: 'hover:bg-accent hover:text-accent-foreground',
            link: 'text-primary underline-offset-4 hover:underline',
            brand: 'bg-zinc-950 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-100 shadow-sm font-semibold tracking-wide transition-all active:scale-[0.99]',
        },
        size: {
            default: 'h-10 px-4 py-2',
            sm: 'h-8 rounded-md px-3 text-xs',
            lg: 'h-12 rounded-xl px-6 text-base',
            icon: 'h-10 w-10',
            'icon-sm': 'h-8 w-8',
        },
    },
    defaultVariants: {
        variant: 'default',
        size: 'default',
    },
});
const Button = React.forwardRef(({ className, variant, size, isLoading, children, disabled, ...props }, ref) => {
    return (<button className={cn(buttonVariants({ variant, size, className }))} ref={ref} disabled={disabled || isLoading} {...props}>
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
        {children}
      </button>);
});
Button.displayName = 'Button';
export { Button, buttonVariants };
