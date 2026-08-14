'use client';

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

export interface CartItem {
  id: string;
  qty: number;
}

interface CartContextValue {
  items: CartItem[];
  itemCount: number;
  addItem: (id: string) => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [toast, setToast] = useState(false);
  const timerRef = useRef<number | null>(null);

  const addItem = useCallback((id: string) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === id);
      if (existing) {
        return prev.map((i) => (i.id === id ? { ...i, qty: i.qty + 1 } : i));
      }
      return [...prev, { id, qty: 1 }];
    });

    setToast(true);
    if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => setToast(false), 2600);
  }, []);

  const itemCount = useMemo(
    () => items.reduce((total, item) => total + item.qty, 0),
    [items]
  );

  return (
    <CartContext.Provider value={{ items, itemCount, addItem }}>
      {children}

      <AnimatePresence>
        {toast && (
          <motion.div
            role="status"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-6 right-6 z-[70] flex items-center gap-2.5 rounded-full bg-green-700 py-3 pl-3.5 pr-5 text-sm font-semibold text-white shadow-[0_18px_40px_-16px_rgba(27,77,50,0.65)]"
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/15">
              <CheckCircle2 className="h-4 w-4 text-gold-500" />
            </span>
            Ditambahkan ke keranjang
          </motion.div>
        )}
      </AnimatePresence>
    </CartContext.Provider>
  );
}
