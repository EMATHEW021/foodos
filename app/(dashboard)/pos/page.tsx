"use client";

import { useState, useMemo } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────
type Category = "all" | "main" | "drinks" | "snacks" | "dessert";

interface MenuItem {
  id: string;
  name: string;
  subtitle: string;
  price: number;
  category: Category;
  emoji: string;
}

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

type PaymentModal = null | "cash" | "mobile" | "split" | "success";
type PaymentMethod = "cash" | "mpesa" | "tigopesa" | "airtelmoney";

// ─── Data ────────────────────────────────────────────────────────────────────
const categories: { key: Category; label: string; subtitle: string }[] = [
  { key: "all", label: "Vyote", subtitle: "All" },
  { key: "main", label: "Vyakula Vikuu", subtitle: "Main Dishes" },
  { key: "drinks", label: "Vinywaji", subtitle: "Drinks" },
  { key: "snacks", label: "Snacks", subtitle: "Snacks" },
  { key: "dessert", label: "Dessert", subtitle: "Dessert" },
];

const menuItems: MenuItem[] = [
  { id: "1", name: "Pilau ya Nyama", subtitle: "Spiced Rice with Meat", price: 5000, category: "main", emoji: "🍛" },
  { id: "2", name: "Wali Maharage", subtitle: "Rice & Beans", price: 2500, category: "main", emoji: "🍚" },
  { id: "3", name: "Chips Kuku", subtitle: "Chips & Chicken", price: 7000, category: "main", emoji: "🍗" },
  { id: "4", name: "Ugali Nyama", subtitle: "Ugali & Meat", price: 6000, category: "main", emoji: "🥩" },
  { id: "5", name: "Biriani", subtitle: "Biryani Rice", price: 8000, category: "main", emoji: "🍲" },
  { id: "6", name: "Chips Mayai", subtitle: "Chips Omelette", price: 4000, category: "main", emoji: "🍳" },
  { id: "7", name: "Mishkaki", subtitle: "Grilled Skewers", price: 3000, category: "snacks", emoji: "🍢" },
  { id: "8", name: "Sambusa", subtitle: "Samosa", price: 1000, category: "snacks", emoji: "🥟" },
  { id: "9", name: "Juice ya Embe", subtitle: "Mango Juice", price: 2000, category: "drinks", emoji: "🥭" },
  { id: "10", name: "Soda", subtitle: "Soft Drink", price: 1500, category: "drinks", emoji: "🥤" },
  { id: "11", name: "Chai", subtitle: "Tea", price: 500, category: "drinks", emoji: "🍵" },
  { id: "12", name: "Mandazi", subtitle: "Sweet Doughnut", price: 500, category: "dessert", emoji: "🍩" },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────
function formatTZS(amount: number): string {
  return `TZS ${amount.toLocaleString("en-US")}`;
}

function detectProvider(phone: string): { name: string; color: string } | null {
  const cleaned = phone.replace(/\s/g, "");
  if (/^(0?74|0?75|255?74|255?75)/.test(cleaned)) return { name: "M-Pesa", color: "#2D7A3A" };
  if (/^(0?71|0?65|255?71|255?65)/.test(cleaned)) return { name: "Tigo Pesa", color: "#1061AB" };
  if (/^(0?68|0?69|255?68|255?69)/.test(cleaned)) return { name: "Airtel Money", color: "#ED1C24" };
  if (/^(0?62|255?62)/.test(cleaned)) return { name: "Halotel", color: "#F7941D" };
  return null;
}

function generateOrderNumber(): string {
  return `#${String(Math.floor(Math.random() * 900) + 100).padStart(3, "0")}`;
}

// ─── Component ───────────────────────────────────────────────────────────────
export default function POSPage() {
  const [selectedCategory, setSelectedCategory] = useState<Category>("all");
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [paymentModal, setPaymentModal] = useState<PaymentModal>(null);
  const [cashReceived, setCashReceived] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [selectedMobileMethod, setSelectedMobileMethod] = useState<PaymentMethod>("mpesa");
  const [completedOrderNumber, setCompletedOrderNumber] = useState<string>("");
  const [completedPaymentMethod, setCompletedPaymentMethod] = useState<string>("");
  const [orderNumber] = useState<string>(generateOrderNumber);

  // Split payment state
  const [splitMethods, setSplitMethods] = useState<{ method: string; amount: string }[]>([
    { method: "cash", amount: "" },
    { method: "mpesa", amount: "" },
  ]);

  // Filtered menu
  const filteredItems = useMemo(
    () =>
      selectedCategory === "all"
        ? menuItems
        : menuItems.filter((item) => item.category === selectedCategory),
    [selectedCategory]
  );

  // Cart calculations
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = subtotal;

  // Cart actions
  function addToCart(item: MenuItem) {
    setCartItems((prev) => {
      const existing = prev.find((c) => c.id === item.id);
      if (existing) {
        return prev.map((c) => (c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c));
      }
      return [...prev, { id: item.id, name: item.name, price: item.price, quantity: 1 }];
    });
  }

  function updateQuantity(id: string, delta: number) {
    setCartItems((prev) =>
      prev
        .map((c) => (c.id === id ? { ...c, quantity: c.quantity + delta } : c))
        .filter((c) => c.quantity > 0)
    );
  }

  function removeFromCart(id: string) {
    setCartItems((prev) => prev.filter((c) => c.id !== id));
  }

  function clearCart() {
    setCartItems([]);
  }

  // Payment actions
  function handleCashPayment() {
    const received = parseInt(cashReceived, 10);
    if (!received || received < total) return;
    setCompletedOrderNumber(orderNumber);
    setCompletedPaymentMethod("Taslimu (Cash)");
    setPaymentModal("success");
  }

  function handleMobilePayment() {
    if (phoneNumber.replace(/\s/g, "").length < 10) return;
    const provider = detectProvider(phoneNumber);
    setCompletedOrderNumber(orderNumber);
    setCompletedPaymentMethod(provider?.name || "Mobile Money");
    setPaymentModal("success");
  }

  function handleSplitPayment() {
    const splitTotal = splitMethods.reduce((sum, s) => sum + (parseInt(s.amount, 10) || 0), 0);
    if (splitTotal < total) return;
    setCompletedOrderNumber(orderNumber);
    setCompletedPaymentMethod("Gawanya (Split)");
    setPaymentModal("success");
  }

  function handleSuccessClose() {
    setPaymentModal(null);
    setCashReceived("");
    setPhoneNumber("");
    setSplitMethods([
      { method: "cash", amount: "" },
      { method: "mpesa", amount: "" },
    ]);
    clearCart();
  }

  // Cash quick amounts
  const cashQuickAmounts = [1000, 2000, 5000, 10000, 20000, 50000];

  return (
    <div className="flex h-[calc(100vh-65px)] gap-0 -m-4 md:-m-6">
      {/* ================================================================= */}
      {/* LEFT SIDE — Menu (60-65%)                                         */}
      {/* ================================================================= */}
      <div className="flex w-[62%] flex-col border-r border-border bg-background">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-5 py-3">
          <div>
            <h1 className="text-lg font-bold text-foreground">POS - Karani</h1>
            <p className="text-xs text-muted-foreground">Cashier Mode</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 rounded-lg bg-brand-green/10 px-3 py-1.5">
              <span className="h-2 w-2 rounded-full bg-brand-green animate-pulse" />
              <span className="text-xs font-medium text-brand-green">Mtandaoni</span>
            </div>
            <div className="rounded-lg bg-muted px-3 py-1.5">
              <span className="text-xs text-muted-foreground">
                {new Date().toLocaleTimeString("sw-TZ", { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 overflow-x-auto border-b border-border px-5 py-3">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.key;
            return (
              <button
                key={cat.key}
                onClick={() => setSelectedCategory(cat.key)}
                className={`flex shrink-0 flex-col items-center rounded-xl px-4 py-2 transition ${
                  isActive
                    ? "bg-brand-green text-white shadow-md"
                    : "bg-card text-foreground hover:bg-brand-green/10 border border-border"
                }`}
              >
                <span className="text-sm font-semibold">{cat.label}</span>
                <span className={`text-[10px] ${isActive ? "text-white/70" : "text-muted-foreground"}`}>
                  {cat.subtitle}
                </span>
              </button>
            );
          })}
        </div>

        {/* Menu Grid */}
        <div className="flex-1 overflow-y-auto p-5">
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-4">
            {filteredItems.map((item) => {
              const inCart = cartItems.find((c) => c.id === item.id);
              return (
                <button
                  key={item.id}
                  onClick={() => addToCart(item)}
                  className={`group relative flex flex-col rounded-xl border-2 bg-card p-4 text-left transition hover:shadow-lg active:scale-[0.97] ${
                    inCart
                      ? "border-brand-green shadow-sm"
                      : "border-border hover:border-brand-green/40"
                  }`}
                >
                  {/* Quantity badge */}
                  {inCart && (
                    <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-brand-green text-xs font-bold text-white shadow">
                      {inCart.quantity}
                    </span>
                  )}

                  {/* Emoji */}
                  <span className="text-3xl">{item.emoji}</span>

                  {/* Name */}
                  <h3 className="mt-2 text-sm font-bold text-foreground leading-tight">
                    {item.name}
                  </h3>
                  <p className="text-[10px] text-muted-foreground">{item.subtitle}</p>

                  {/* Price */}
                  <p className="mt-auto pt-2 text-sm font-bold text-brand-green">
                    {formatTZS(item.price)}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ================================================================= */}
      {/* RIGHT SIDE — Order Cart (35-40%)                                  */}
      {/* ================================================================= */}
      <div className="flex w-[38%] flex-col bg-card">
        {/* Cart Header */}
        <div className="flex items-center justify-between border-b border-border px-5 py-3">
          <div>
            <h2 className="text-base font-bold text-foreground">Oda Mpya</h2>
            <p className="text-[10px] text-muted-foreground">New Order</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="rounded-lg bg-brand-orange/10 px-3 py-1.5 text-sm font-bold text-brand-orange">
              {orderNumber}
            </span>
            {cartItems.length > 0 && (
              <button
                onClick={clearCart}
                className="rounded-lg px-2 py-1.5 text-xs text-red-500 transition hover:bg-red-50"
                title="Futa yote"
              >
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto px-4 py-3">
          {cartItems.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" className="text-muted-foreground">
                  <path d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                </svg>
              </div>
              <p className="mt-4 text-sm font-medium text-foreground">Hakuna bidhaa</p>
              <p className="text-xs text-muted-foreground">No items yet</p>
              <p className="mt-2 text-xs text-muted-foreground">
                Bonyeza chakula kushoto kuongeza
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {cartItems.map((item, index) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 rounded-xl border border-border bg-background p-3"
                >
                  {/* Index */}
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted text-[10px] font-bold text-muted-foreground">
                    {index + 1}
                  </span>

                  {/* Info */}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{formatTZS(item.price)}</p>
                  </div>

                  {/* Quantity controls */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      className="flex h-7 w-7 items-center justify-center rounded-lg border border-border text-sm font-bold text-foreground transition hover:bg-muted"
                    >
                      -
                    </button>
                    <span className="w-7 text-center text-sm font-bold text-foreground">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, 1)}
                      className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-green text-sm font-bold text-white transition hover:bg-brand-green-dark"
                    >
                      +
                    </button>
                  </div>

                  {/* Line total */}
                  <p className="w-20 text-right text-sm font-bold text-foreground">
                    {formatTZS(item.price * item.quantity)}
                  </p>

                  {/* Remove */}
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-red-400 transition hover:bg-red-50 hover:text-red-600"
                  >
                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M18 6 6 18M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Cart Footer — Totals + Payment Buttons */}
        {cartItems.length > 0 && (
          <div className="border-t border-border bg-card px-5 py-4">
            {/* Subtotal */}
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Jumla ndogo</span>
              <span className="text-foreground">{formatTZS(subtotal)}</span>
            </div>
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Subtotal</span>
            </div>

            {/* Divider */}
            <div className="my-3 border-t border-dashed border-border" />

            {/* Total */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-base font-bold text-foreground">Jumla</p>
                <p className="text-[10px] text-muted-foreground">Total</p>
              </div>
              <p className="text-xl font-bold text-brand-green">{formatTZS(total)}</p>
            </div>

            {/* Items count */}
            <p className="mt-1 text-xs text-muted-foreground">
              Bidhaa {cartItems.reduce((sum, c) => sum + c.quantity, 0)} | Items
            </p>

            {/* Payment Buttons */}
            <div className="mt-4 grid grid-cols-2 gap-2">
              <button
                onClick={() => setPaymentModal("cash")}
                className="flex flex-col items-center rounded-xl bg-brand-green py-3 text-white transition hover:bg-brand-green-dark active:scale-[0.97]"
              >
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M2 7a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7Z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
                <span className="mt-1 text-xs font-bold">Taslimu</span>
                <span className="text-[10px] text-white/70">Cash</span>
              </button>

              <button
                onClick={() => {
                  setSelectedMobileMethod("mpesa");
                  setPaymentModal("mobile");
                }}
                className="flex flex-col items-center rounded-xl bg-brand-green py-3 text-white transition hover:bg-brand-green-dark active:scale-[0.97]"
              >
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <rect x="5" y="2" width="14" height="20" rx="2" />
                  <path d="M12 18h.01" />
                </svg>
                <span className="mt-1 text-xs font-bold">M-Pesa</span>
                <span className="text-[10px] text-white/70">Vodacom</span>
              </button>

              <button
                onClick={() => {
                  setSelectedMobileMethod("tigopesa");
                  setPaymentModal("mobile");
                }}
                className="flex flex-col items-center rounded-xl bg-brand-orange py-3 text-white transition hover:bg-brand-orange/90 active:scale-[0.97]"
              >
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <rect x="5" y="2" width="14" height="20" rx="2" />
                  <path d="M12 18h.01" />
                </svg>
                <span className="mt-1 text-xs font-bold">Tigo Pesa</span>
                <span className="text-[10px] text-white/70">Tigo</span>
              </button>

              <button
                onClick={() => {
                  setSelectedMobileMethod("airtelmoney");
                  setPaymentModal("mobile");
                }}
                className="flex flex-col items-center rounded-xl bg-red-600 py-3 text-white transition hover:bg-red-700 active:scale-[0.97]"
              >
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <rect x="5" y="2" width="14" height="20" rx="2" />
                  <path d="M12 18h.01" />
                </svg>
                <span className="mt-1 text-xs font-bold">Airtel Money</span>
                <span className="text-[10px] text-white/70">Airtel</span>
              </button>
            </div>

            {/* Split button */}
            <button
              onClick={() => setPaymentModal("split")}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-brand-gold py-2.5 text-sm font-bold text-brand-charcoal transition hover:bg-brand-gold/10 active:scale-[0.97]"
            >
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M16 3h5v5M4 20 21 3M21 16v5h-5M15 15l6 6M4 4l5 5" />
              </svg>
              Gawanya Malipo
              <span className="text-xs font-normal text-muted-foreground">Split Payment</span>
            </button>
          </div>
        )}
      </div>

      {/* ================================================================= */}
      {/* MODALS                                                            */}
      {/* ================================================================= */}

      {/* Overlay */}
      {paymentModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={() => paymentModal !== "success" && setPaymentModal(null)}
        >
          <div onClick={(e) => e.stopPropagation()}>
            {/* ─── Cash Modal ─────────────────────────────────────────── */}
            {paymentModal === "cash" && (
              <div className="w-[420px] rounded-2xl bg-card p-6 shadow-2xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-foreground">Malipo ya Taslimu</h3>
                    <p className="text-xs text-muted-foreground">Cash Payment</p>
                  </div>
                  <button
                    onClick={() => setPaymentModal(null)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-muted"
                  >
                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M18 6 6 18M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Total due */}
                <div className="mt-4 rounded-xl bg-brand-green/5 p-4 text-center">
                  <p className="text-xs text-muted-foreground">Kiasi cha kulipa / Amount Due</p>
                  <p className="text-2xl font-bold text-brand-green">{formatTZS(total)}</p>
                </div>

                {/* Amount received input */}
                <div className="mt-4">
                  <label className="text-sm font-medium text-foreground">
                    Kiasi Kilichopokelewa
                    <span className="ml-1 text-xs font-normal text-muted-foreground">Amount Received</span>
                  </label>
                  <input
                    type="number"
                    value={cashReceived}
                    onChange={(e) => setCashReceived(e.target.value)}
                    placeholder="0"
                    className="mt-1 w-full rounded-xl border border-border bg-background px-4 py-3 text-xl font-bold text-foreground placeholder:text-muted-foreground/40 focus:border-brand-green focus:outline-none focus:ring-2 focus:ring-brand-green/20"
                    autoFocus
                  />
                </div>

                {/* Quick amounts */}
                <div className="mt-3 grid grid-cols-3 gap-2">
                  {cashQuickAmounts.map((amt) => (
                    <button
                      key={amt}
                      onClick={() => setCashReceived(String(amt))}
                      className={`rounded-lg border py-2 text-xs font-medium transition ${
                        cashReceived === String(amt)
                          ? "border-brand-green bg-brand-green/10 text-brand-green"
                          : "border-border text-foreground hover:border-brand-green/40 hover:bg-muted"
                      }`}
                    >
                      {formatTZS(amt)}
                    </button>
                  ))}
                </div>

                {/* Exact amount shortcut */}
                <button
                  onClick={() => setCashReceived(String(total))}
                  className="mt-2 w-full rounded-lg border border-dashed border-brand-gold py-2 text-xs font-medium text-brand-charcoal transition hover:bg-brand-gold/10"
                >
                  Kiasi kamili / Exact Amount: {formatTZS(total)}
                </button>

                {/* Change */}
                {parseInt(cashReceived, 10) >= total && (
                  <div className="mt-4 rounded-xl bg-brand-gold/10 p-4 text-center">
                    <p className="text-xs text-muted-foreground">Chenji / Change</p>
                    <p className="text-2xl font-bold text-brand-orange">
                      {formatTZS(parseInt(cashReceived, 10) - total)}
                    </p>
                  </div>
                )}

                {/* Submit */}
                <button
                  onClick={handleCashPayment}
                  disabled={!cashReceived || parseInt(cashReceived, 10) < total}
                  className="mt-4 w-full rounded-xl bg-brand-green py-3 text-sm font-bold text-white transition hover:bg-brand-green-dark disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Thibitisha Malipo / Confirm Payment
                </button>
              </div>
            )}

            {/* ─── Mobile Money Modal ─────────────────────────────────── */}
            {paymentModal === "mobile" && (() => {
              const detectedProvider = detectProvider(phoneNumber);
              const methodLabels: Record<string, string> = {
                mpesa: "M-Pesa",
                tigopesa: "Tigo Pesa",
                airtelmoney: "Airtel Money",
              };
              return (
                <div className="w-[420px] rounded-2xl bg-card p-6 shadow-2xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-foreground">
                        Malipo ya {methodLabels[selectedMobileMethod]}
                      </h3>
                      <p className="text-xs text-muted-foreground">Mobile Money Payment</p>
                    </div>
                    <button
                      onClick={() => setPaymentModal(null)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-muted"
                    >
                      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M18 6 6 18M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  {/* Total due */}
                  <div className="mt-4 rounded-xl bg-brand-green/5 p-4 text-center">
                    <p className="text-xs text-muted-foreground">Kiasi cha kulipa / Amount Due</p>
                    <p className="text-2xl font-bold text-brand-green">{formatTZS(total)}</p>
                  </div>

                  {/* Phone input */}
                  <div className="mt-4">
                    <label className="text-sm font-medium text-foreground">
                      Nambari ya Simu
                      <span className="ml-1 text-xs font-normal text-muted-foreground">Phone Number</span>
                    </label>
                    <div className="relative mt-1">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                        +255
                      </span>
                      <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="07X XXX XXXX"
                        className="w-full rounded-xl border border-border bg-background py-3 pl-14 pr-4 text-lg font-medium text-foreground placeholder:text-muted-foreground/40 focus:border-brand-green focus:outline-none focus:ring-2 focus:ring-brand-green/20"
                        autoFocus
                      />
                    </div>
                  </div>

                  {/* Detected provider */}
                  {detectedProvider && (
                    <div
                      className="mt-3 flex items-center gap-2 rounded-xl px-4 py-3"
                      style={{ backgroundColor: detectedProvider.color + "10" }}
                    >
                      <span
                        className="flex h-8 w-8 items-center justify-center rounded-full text-white text-xs font-bold"
                        style={{ backgroundColor: detectedProvider.color }}
                      >
                        {detectedProvider.name.charAt(0)}
                      </span>
                      <div>
                        <p className="text-sm font-bold" style={{ color: detectedProvider.color }}>
                          {detectedProvider.name}
                        </p>
                        <p className="text-[10px] text-muted-foreground">Mtoa huduma amegunduliwa / Provider detected</p>
                      </div>
                      <svg
                        width="18"
                        height="18"
                        fill="none"
                        stroke={detectedProvider.color}
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        className="ml-auto"
                      >
                        <path d="M20 6 9 17l-5-5" />
                      </svg>
                    </div>
                  )}

                  {/* Prefix guide */}
                  <div className="mt-3 rounded-xl bg-muted p-3">
                    <p className="text-[10px] font-medium text-muted-foreground mb-1.5">Viambishi vya mtandao / Network prefixes:</p>
                    <div className="grid grid-cols-2 gap-1">
                      <span className="text-[10px] text-muted-foreground">074/075 = M-Pesa</span>
                      <span className="text-[10px] text-muted-foreground">071/065 = Tigo Pesa</span>
                      <span className="text-[10px] text-muted-foreground">068/069 = Airtel Money</span>
                      <span className="text-[10px] text-muted-foreground">062 = Halotel</span>
                    </div>
                  </div>

                  {/* Submit */}
                  <button
                    onClick={handleMobilePayment}
                    disabled={phoneNumber.replace(/\s/g, "").length < 10}
                    className="mt-4 w-full rounded-xl bg-brand-green py-3 text-sm font-bold text-white transition hover:bg-brand-green-dark disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <span className="flex items-center justify-center gap-2">
                      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7Z" />
                      </svg>
                      Tuma Ombi / Send Request
                    </span>
                  </button>
                </div>
              );
            })()}

            {/* ─── Split Payment Modal ────────────────────────────────── */}
            {paymentModal === "split" && (() => {
              const splitTotal = splitMethods.reduce((sum, s) => sum + (parseInt(s.amount, 10) || 0), 0);
              const remaining = total - splitTotal;

              const methodOptions = [
                { value: "cash", label: "Taslimu / Cash" },
                { value: "mpesa", label: "M-Pesa" },
                { value: "tigopesa", label: "Tigo Pesa" },
                { value: "airtelmoney", label: "Airtel Money" },
              ];

              return (
                <div className="w-[460px] rounded-2xl bg-card p-6 shadow-2xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-foreground">Gawanya Malipo</h3>
                      <p className="text-xs text-muted-foreground">Split Payment</p>
                    </div>
                    <button
                      onClick={() => setPaymentModal(null)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-muted"
                    >
                      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M18 6 6 18M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  {/* Total */}
                  <div className="mt-4 rounded-xl bg-brand-green/5 p-4 text-center">
                    <p className="text-xs text-muted-foreground">Jumla / Total</p>
                    <p className="text-2xl font-bold text-brand-green">{formatTZS(total)}</p>
                  </div>

                  {/* Split rows */}
                  <div className="mt-4 space-y-3">
                    {splitMethods.map((split, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <select
                          value={split.method}
                          onChange={(e) => {
                            const updated = [...splitMethods];
                            updated[i].method = e.target.value;
                            setSplitMethods(updated);
                          }}
                          className="w-36 rounded-lg border border-border bg-background px-2 py-2.5 text-xs text-foreground focus:border-brand-green focus:outline-none"
                        >
                          {methodOptions.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                        <input
                          type="number"
                          value={split.amount}
                          onChange={(e) => {
                            const updated = [...splitMethods];
                            updated[i].amount = e.target.value;
                            setSplitMethods(updated);
                          }}
                          placeholder="Kiasi / Amount"
                          className="flex-1 rounded-lg border border-border bg-background px-3 py-2.5 text-sm font-medium text-foreground placeholder:text-muted-foreground/40 focus:border-brand-green focus:outline-none"
                        />
                        {splitMethods.length > 2 && (
                          <button
                            onClick={() => setSplitMethods(splitMethods.filter((_, j) => j !== i))}
                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-red-400 transition hover:bg-red-50 hover:text-red-600"
                          >
                            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path d="M18 6 6 18M6 6l12 12" />
                            </svg>
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Add method */}
                  <button
                    onClick={() => setSplitMethods([...splitMethods, { method: "cash", amount: "" }])}
                    className="mt-2 flex w-full items-center justify-center gap-1 rounded-lg border border-dashed border-border py-2 text-xs text-muted-foreground transition hover:border-brand-green hover:text-brand-green"
                  >
                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                    Ongeza njia / Add method
                  </button>

                  {/* Remaining */}
                  <div className={`mt-4 rounded-xl p-3 text-center ${remaining > 0 ? "bg-brand-orange/10" : remaining === 0 ? "bg-brand-green/10" : "bg-red-50"}`}>
                    <p className="text-xs text-muted-foreground">
                      {remaining > 0 ? "Kiasi kilichobaki / Remaining" : remaining === 0 ? "Kiasi kimekamilika / Fully covered" : "Kiasi kimezidi / Overpaid"}
                    </p>
                    <p className={`text-lg font-bold ${remaining > 0 ? "text-brand-orange" : remaining === 0 ? "text-brand-green" : "text-red-600"}`}>
                      {formatTZS(Math.abs(remaining))}
                    </p>
                  </div>

                  {/* Submit */}
                  <button
                    onClick={handleSplitPayment}
                    disabled={remaining > 0}
                    className="mt-4 w-full rounded-xl bg-brand-green py-3 text-sm font-bold text-white transition hover:bg-brand-green-dark disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Thibitisha Malipo / Confirm Payment
                  </button>
                </div>
              );
            })()}

            {/* ─── Success Modal ───────────────────────────────────────── */}
            {paymentModal === "success" && (
              <div className="w-[400px] rounded-2xl bg-card p-8 text-center shadow-2xl">
                {/* Success icon */}
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-brand-green/10">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-green">
                    <svg width="28" height="28" fill="none" stroke="white" strokeWidth="3" viewBox="0 0 24 24">
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                  </div>
                </div>

                <h3 className="mt-5 text-xl font-bold text-foreground">Malipo Yamekamilika!</h3>
                <p className="text-sm text-muted-foreground">Payment Completed Successfully</p>

                {/* Details */}
                <div className="mt-5 rounded-xl bg-muted p-4 text-left">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Nambari ya Oda</span>
                    <span className="font-bold text-foreground">{completedOrderNumber}</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Njia ya Malipo</span>
                    <span className="font-bold text-foreground">{completedPaymentMethod}</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Jumla</span>
                    <span className="font-bold text-brand-green">{formatTZS(total)}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-5 flex gap-3">
                  <button
                    onClick={handleSuccessClose}
                    className="flex-1 rounded-xl bg-brand-green py-3 text-sm font-bold text-white transition hover:bg-brand-green-dark"
                  >
                    Oda Mpya / New Order
                  </button>
                  <button
                    onClick={handleSuccessClose}
                    className="flex-1 rounded-xl border-2 border-border py-3 text-sm font-bold text-foreground transition hover:bg-muted"
                  >
                    Chapisha Risiti / Print
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
