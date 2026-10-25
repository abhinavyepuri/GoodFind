import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ProductCard } from '@/components/product/ProductCard';
import { Button } from '@/components/ui/button';
import { mockProducts } from '@/data/mockData';
import { formatPrice } from '@/lib/utils';
describe('UI Components', () => {
    it('renders Button with variants and loading state', () => {
        const { rerender } = render(<Button>Click Me</Button>);
        expect(screen.getByRole('button', { name: /click me/i })).toBeTruthy();
        rerender(<Button isLoading>Loading State</Button>);
        const button = screen.getByRole('button', { name: /loading state/i });
        expect(button.disabled).toBe(true);
    });
    it('renders ProductCard with title, brand, and formatted price', () => {
        const product = mockProducts[0]; // Aero Sound Pro
        render(<BrowserRouter>
        <ProductCard product={product}/>
      </BrowserRouter>);
        expect(screen.getByText(product.name)).toBeTruthy();
        expect(screen.getByText(product.brand)).toBeTruthy();
        expect(screen.getByText(formatPrice(product.price))).toBeTruthy();
    });
});
