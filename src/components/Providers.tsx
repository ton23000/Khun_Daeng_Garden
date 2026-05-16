"use client";

import { AuthProvider } from "@/lib/AuthContext";
import { CartProvider } from "@/lib/CartContext";
import { NotificationProvider } from "@/lib/NotificationContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <NotificationProvider>
        <CartProvider>{children}</CartProvider>
      </NotificationProvider>
    </AuthProvider>
  );
}
