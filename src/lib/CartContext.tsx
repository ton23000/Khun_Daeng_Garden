'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Tree {
    id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    status: string;
    images: string[];
    tags: string[];
    growthTime?: string | null;
}

export interface CartItem extends Tree {
    instanceId: string;
    quantity: number;
    pickupDate: string;
}

interface CartContextType {
    items: CartItem[];
    addItem: (tree: Tree, quantity?: number) => void;
    removeItem: (instanceId: string) => void;
    updateQuantity: (instanceId: string, delta: number) => void;
    updateDate: (instanceId: string, date: string) => void;
    clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);

    // Load cart from localStorage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem('khun_daeng_cart');
        if (savedCart) {
            try {
                setItems(JSON.parse(savedCart));
            } catch (e) {
                console.error('Failed to parse cart', e);
            }
        }
    }, []);

    // Save cart to localStorage on change
    useEffect(() => {
        localStorage.setItem('khun_daeng_cart', JSON.stringify(items));
    }, [items]);

    const addItem = (tree: Tree, quantity: number = 1) => {
        setItems((prev) => {
            // Check if item with same ID exists
            const existingItemIndex = prev.findIndex(item => item.id === tree.id);

            if (existingItemIndex !== -1) {
                // Update existing item quantity
                const updatedItems = [...prev];
                updatedItems[existingItemIndex] = {
                    ...updatedItems[existingItemIndex],
                    quantity: updatedItems[existingItemIndex].quantity + quantity
                };
                return updatedItems;
            }

            // Add new item
            const newItem: CartItem = {
                ...tree,
                instanceId: Math.random().toString(36).substring(7),
                quantity: quantity,
                pickupDate: ''
            };
            return [...prev, newItem];
        });
    };

    const removeItem = (instanceId: string) => {
        setItems((prev) => prev.filter((item) => item.instanceId !== instanceId));
    };

    const updateQuantity = (instanceId: string, delta: number) => {
        setItems((prev) => {
            return prev.map((item) => {
                if (item.instanceId === instanceId) {
                    const newQuantity = item.quantity + delta;
                    return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
                }
                return item;
            });
        });
    };

    const updateDate = (instanceId: string, date: string) => {
        setItems((prev) => prev.map(item => item.instanceId === instanceId ? { ...item, pickupDate: date } : item));
    };

    const clearCart = () => {
        setItems([]);
    };

    return (
        <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, updateDate, clearCart }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
