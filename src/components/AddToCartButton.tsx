'use client';

import { useCart } from '@/lib/CartContext';
import { Button } from '@/components/ui/Button';
import { Tree } from '@/data/mockData';
import { useState } from 'react';

export function AddToCartButton({ tree }: { tree: Tree }) {
    const { addItem, items } = useCart();
    const [isAdded, setIsAdded] = useState(false);

    // Find item count in cart
    const cartItem = items.find(item => item.id === tree.id);
    const count = cartItem ? cartItem.quantity : 0;

    const handleAdd = () => {
        addItem(tree);
        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 2000);
    };

    return (
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <Button
                fullWidth
                onClick={handleAdd}
                variant="primary"
            >
                {isAdded ? 'เพิ่มเรียบร้อย!' : 'เพิ่มลงตะกร้า'}
                {count > 0 && ` (${count})`}
            </Button>
        </div>
    );
}
