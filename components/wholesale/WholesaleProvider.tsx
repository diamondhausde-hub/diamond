"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { ProductId } from "@/data/products";
import { useMessages } from "@/components/LocaleProvider";
import { WholesaleDrawer } from "@/components/wholesale/WholesaleDrawer";

export type EnquiryItem = {
  id: ProductId;
  size: string | null;
  quantity: number;
};

type WholesaleContextValue = {
  items: EnquiryItem[];
  count: number;
  addItem: (id: ProductId, size: string | null) => void;
  removeItem: (id: ProductId, size: string | null) => void;
  setQuantity: (id: ProductId, size: string | null, quantity: number) => void;
  clear: () => void;
  isOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  notice: string | null;
  dismissNotice: () => void;
};

const WholesaleContext = createContext<WholesaleContextValue | null>(null);
const STORAGE_KEY = "diamond.enquiry";

function sameLine(a: EnquiryItem, id: ProductId, size: string | null) {
  return a.id === id && (a.size ?? "") === (size ?? "");
}

export function WholesaleProvider({ children }: { children: ReactNode }) {
  const messages = useMessages();
  const [items, setItems] = useState<EnquiryItem[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [isOpen, setOpen] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as EnquiryItem[];
        if (Array.isArray(parsed)) setItems(parsed);
      }
    } catch {
      /* ignore malformed storage */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* ignore */
    }
  }, [items, hydrated]);

  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(null), 5000);
    return () => window.clearTimeout(timer);
  }, [notice]);

  const addItem = useCallback(
    (id: ProductId, size: string | null) => {
      setItems((current) => {
        const existing = current.find((line) => sameLine(line, id, size));
        if (existing) {
          return current.map((line) =>
            sameLine(line, id, size) ? { ...line, quantity: line.quantity + 1 } : line,
          );
        }
        return [...current, { id, size, quantity: 1 }];
      });
      setNotice(messages.common.addedToEnquiry);
    },
    [messages.common.addedToEnquiry],
  );

  const removeItem = useCallback((id: ProductId, size: string | null) => {
    setItems((current) => current.filter((line) => !sameLine(line, id, size)));
  }, []);

  const setQuantity = useCallback((id: ProductId, size: string | null, quantity: number) => {
    const next = Math.max(1, Math.min(99999, Math.round(quantity) || 1));
    setItems((current) =>
      current.map((line) => (sameLine(line, id, size) ? { ...line, quantity: next } : line)),
    );
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const count = useMemo(
    () => items.reduce((total, line) => total + line.quantity, 0),
    [items],
  );

  const value = useMemo<WholesaleContextValue>(
    () => ({
      items,
      count,
      addItem,
      removeItem,
      setQuantity,
      clear,
      isOpen,
      openDrawer: () => setOpen(true),
      closeDrawer: () => setOpen(false),
      notice,
      dismissNotice: () => setNotice(null),
    }),
    [items, count, addItem, removeItem, setQuantity, clear, isOpen, notice],
  );

  return (
    <WholesaleContext.Provider value={value}>
      {children}
      <WholesaleDrawer />
      {notice ? (
        <div className="toast" role="status" aria-live="polite">
          <span className="flex-1">{notice}</span>
          <button
            type="button"
            onClick={() => {
              setOpen(true);
              setNotice(null);
            }}
            className="shrink-0 border-b border-white/40 pb-0.5 text-[11px] font-medium text-white"
          >
            {messages.common.reviewEnquiry}
          </button>
        </div>
      ) : null}
    </WholesaleContext.Provider>
  );
}

export function useWholesale() {
  const context = useContext(WholesaleContext);
  if (!context) throw new Error("useWholesale must be used inside WholesaleProvider");
  return context;
}
