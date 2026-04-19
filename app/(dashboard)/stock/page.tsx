"use client";

import { useState } from "react";

/* ──────────────────────────── TYPES ──────────────────────────── */
type Unit = "kg" | "lita" | "kipande";
type Category = "Protini" | "Mboga" | "Nafaka" | "Viungo";
type Status = "Nzuri" | "Chini";
type MovementType = "IN" | "OUT" | "EDIT" | "DELETE";
type ApprovalStatus = "Imekubaliwa" | "Imekataliwa" | "Inasubiri";
type DeductReason = "Imeharibika" | "Matumizi binafsi" | "Nyingine";
type ModalType =
  | "add-stock"
  | "deduct-stock"
  | "edit"
  | "delete"
  | "add-new"
  | null;
type StockFilter = "all" | "low" | "pending" | "out-today";
type TabId = "stoku-sasa" | "imeingizwa" | "imetolewa" | "historia";

interface Ingredient {
  id: number;
  name: string;
  nameEn: string;
  unit: Unit;
  quantity: number;
  costPerUnit: number;
  minStock: number;
  category: Category;
  status: Status;
}

interface HistoryEntry {
  id: number;
  date: string;
  ingredient: string;
  type: MovementType;
  quantity: number | string;
  unit: string;
  requestedBy: string;
  approvalStatus: ApprovalStatus;
}

/* ──────────────────────────── INITIAL DATA ──────────────────────────── */
const initialIngredients: Ingredient[] = [
  { id: 1, name: "Mchele", nameEn: "Rice", unit: "kg", quantity: 3, costPerUnit: 2000, minStock: 10, category: "Nafaka", status: "Chini" },
  { id: 2, name: "Nyama", nameEn: "Meat", unit: "kg", quantity: 2, costPerUnit: 12000, minStock: 8, category: "Protini", status: "Chini" },
  { id: 3, name: "Mafuta", nameEn: "Oil", unit: "lita", quantity: 1, costPerUnit: 5000, minStock: 5, category: "Viungo", status: "Chini" },
  { id: 4, name: "Vitunguu", nameEn: "Onions", unit: "kg", quantity: 1.5, costPerUnit: 3000, minStock: 5, category: "Mboga", status: "Chini" },
  { id: 5, name: "Nyanya", nameEn: "Tomatoes", unit: "kg", quantity: 8, costPerUnit: 2500, minStock: 5, category: "Mboga", status: "Nzuri" },
  { id: 6, name: "Pilipili", nameEn: "Spices", unit: "kg", quantity: 2, costPerUnit: 15000, minStock: 1, category: "Viungo", status: "Nzuri" },
  { id: 7, name: "Unga", nameEn: "Flour", unit: "kg", quantity: 15, costPerUnit: 2800, minStock: 5, category: "Nafaka", status: "Nzuri" },
  { id: 8, name: "Sukari", nameEn: "Sugar", unit: "kg", quantity: 5, costPerUnit: 3200, minStock: 3, category: "Viungo", status: "Nzuri" },
];

const initialHistory: HistoryEntry[] = [
  { id: 1, date: "2026-04-19 08:30", ingredient: "Mchele", type: "IN", quantity: 20, unit: "kg", requestedBy: "Hassan", approvalStatus: "Inasubiri" },
  { id: 2, date: "2026-04-19 09:15", ingredient: "Nyama", type: "OUT", quantity: 3, unit: "kg", requestedBy: "Hassan", approvalStatus: "Inasubiri" },
  { id: 3, date: "2026-04-19 07:00", ingredient: "Pilipili", type: "EDIT", quantity: "-", unit: "kg", requestedBy: "Hassan", approvalStatus: "Inasubiri" },
  { id: 4, date: "2026-04-18 14:20", ingredient: "Unga", type: "IN", quantity: 25, unit: "kg", requestedBy: "Amina", approvalStatus: "Imekubaliwa" },
  { id: 5, date: "2026-04-18 11:45", ingredient: "Nyanya", type: "IN", quantity: 10, unit: "kg", requestedBy: "Hassan", approvalStatus: "Imekubaliwa" },
  { id: 6, date: "2026-04-18 10:00", ingredient: "Sukari", type: "OUT", quantity: 2, unit: "kg", requestedBy: "Hassan", approvalStatus: "Imekubaliwa" },
  { id: 7, date: "2026-04-17 16:30", ingredient: "Mafuta", type: "IN", quantity: 5, unit: "lita", requestedBy: "Amina", approvalStatus: "Imekubaliwa" },
  { id: 8, date: "2026-04-17 09:00", ingredient: "Vitunguu", type: "DELETE", quantity: "-", unit: "kg", requestedBy: "Hassan", approvalStatus: "Imekataliwa" },
  { id: 9, date: "2026-04-19 10:30", ingredient: "Mchele", type: "OUT", quantity: 5, unit: "kg", requestedBy: "Amina", approvalStatus: "Imekubaliwa" },
  { id: 10, date: "2026-04-19 11:00", ingredient: "Nyanya", type: "OUT", quantity: 2, unit: "kg", requestedBy: "Hassan", approvalStatus: "Imekubaliwa" },
  { id: 11, date: "2026-04-19 12:00", ingredient: "Unga", type: "OUT", quantity: 3, unit: "kg", requestedBy: "Hassan", approvalStatus: "Imekubaliwa" },
  { id: 12, date: "2026-04-19 12:30", ingredient: "Sukari", type: "OUT", quantity: 1, unit: "kg", requestedBy: "Amina", approvalStatus: "Imekubaliwa" },
  { id: 13, date: "2026-04-19 13:00", ingredient: "Pilipili", type: "OUT", quantity: 0.5, unit: "kg", requestedBy: "Hassan", approvalStatus: "Imekubaliwa" },
  { id: 14, date: "2026-04-19 13:30", ingredient: "Vitunguu", type: "OUT", quantity: 1, unit: "kg", requestedBy: "Amina", approvalStatus: "Imekubaliwa" },
];

/* ──────────────────────────── HELPERS ──────────────────────────── */
function formatTZS(amount: number): string {
  return `TZS ${amount.toLocaleString("en-US")}`;
}

/* ──────────────────────────── ICONS (inline SVG) ──────────────────────────── */
function PlusIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
  );
}

function MinusIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
    </svg>
  );
}

function PencilIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}

function TrashIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0 1 16.138 21H7.862a2 2 0 0 1-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v3M4 7h16" />
    </svg>
  );
}

function XIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

function SearchIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  );
}

function ShieldIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

/* ──────────────────────────── PAGE COMPONENT ──────────────────────────── */
export default function StockPage() {
  /* ── State ── */
  const [activeTab, setActiveTab] = useState<TabId>("stoku-sasa");
  const [stockFilter, setStockFilter] = useState<StockFilter>("all");
  const [selectedIngredient, setSelectedIngredient] = useState<Ingredient | null>(null);
  const [modalType, setModalType] = useState<ModalType>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [ingredients, setIngredients] = useState<Ingredient[]>(initialIngredients);
  const [history, setHistory] = useState<HistoryEntry[]>(initialHistory);

  /* form data for modals */
  const [formData, setFormData] = useState({
    quantity: "",
    totalCost: "",
    supplier: "",
    reason: "Imeharibika" as DeductReason,
    customReason: "",
    name: "",
    nameEn: "",
    unit: "kg" as Unit,
    minStock: "",
    category: "Nafaka" as Category,
    deleteReason: "",
  });

  /* ── Derived data ── */
  const totalItems = ingredients.length;
  const lowStockItems = ingredients.filter((i) => i.status === "Chini");
  const pendingApprovals = history.filter((h) => h.approvalStatus === "Inasubiri");
  const outToday = history.filter(
    (h) => h.date.startsWith("2026-04-19") && h.type === "OUT" && h.approvalStatus === "Imekubaliwa"
  );

  /* ── Filtered ingredients for display ── */
  const getFilteredIngredients = () => {
    let filtered = ingredients;

    if (stockFilter === "low") {
      filtered = filtered.filter((i) => i.status === "Chini");
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (i) =>
          i.name.toLowerCase().includes(q) ||
          i.nameEn.toLowerCase().includes(q) ||
          i.category.toLowerCase().includes(q)
      );
    }

    return filtered;
  };

  /* ── History filtered by tab ── */
  const getFilteredHistory = () => {
    if (activeTab === "imeingizwa") return history.filter((h) => h.type === "IN");
    if (activeTab === "imetolewa") return history.filter((h) => h.type === "OUT");
    return history; // "historia" shows all
  };

  /* ── Open modal ── */
  const openModal = (type: ModalType, ingredient?: Ingredient) => {
    setModalType(type);
    setSelectedIngredient(ingredient || null);
    setFormData({
      quantity: "",
      totalCost: "",
      supplier: "",
      reason: "Imeharibika",
      customReason: "",
      name: ingredient?.name || "",
      nameEn: ingredient?.nameEn || "",
      unit: ingredient?.unit || "kg",
      minStock: ingredient?.minStock?.toString() || "",
      category: ingredient?.category || "Nafaka",
      deleteReason: "",
    });
  };

  const closeModal = () => {
    setModalType(null);
    setSelectedIngredient(null);
  };

  /* ── Handle form submission ── */
  const handleAddStock = () => {
    if (!selectedIngredient || !formData.quantity || !formData.totalCost) return;
    const qty = parseFloat(formData.quantity);
    const cost = parseFloat(formData.totalCost);
    if (isNaN(qty) || isNaN(cost) || qty <= 0) return;

    setIngredients((prev) =>
      prev.map((ing) => {
        if (ing.id === selectedIngredient.id) {
          const newQty = ing.quantity + qty;
          const newCostPerUnit = Math.round(cost / qty);
          return {
            ...ing,
            quantity: newQty,
            costPerUnit: newCostPerUnit,
            status: newQty >= ing.minStock ? "Nzuri" : "Chini",
          };
        }
        return ing;
      })
    );

    setHistory((prev) => [
      {
        id: prev.length + 1,
        date: "2026-04-19 " + new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }),
        ingredient: selectedIngredient.name,
        type: "IN",
        quantity: qty,
        unit: selectedIngredient.unit,
        requestedBy: "Hassan",
        approvalStatus: "Inasubiri",
      },
      ...prev,
    ]);

    closeModal();
  };

  const handleDeductStock = () => {
    if (!selectedIngredient || !formData.quantity) return;
    const qty = parseFloat(formData.quantity);
    if (isNaN(qty) || qty <= 0 || qty > selectedIngredient.quantity) return;

    setIngredients((prev) =>
      prev.map((ing) => {
        if (ing.id === selectedIngredient.id) {
          const newQty = ing.quantity - qty;
          return {
            ...ing,
            quantity: newQty,
            status: newQty >= ing.minStock ? "Nzuri" : "Chini",
          };
        }
        return ing;
      })
    );

    setHistory((prev) => [
      {
        id: prev.length + 1,
        date: "2026-04-19 " + new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }),
        ingredient: selectedIngredient.name,
        type: "OUT",
        quantity: qty,
        unit: selectedIngredient.unit,
        requestedBy: "Hassan",
        approvalStatus: "Inasubiri",
      },
      ...prev,
    ]);

    closeModal();
  };

  const handleEditIngredient = () => {
    if (!selectedIngredient || !formData.name) return;

    setIngredients((prev) =>
      prev.map((ing) => {
        if (ing.id === selectedIngredient.id) {
          const newMinStock = parseFloat(formData.minStock) || ing.minStock;
          return {
            ...ing,
            name: formData.name,
            nameEn: formData.nameEn || ing.nameEn,
            unit: formData.unit,
            minStock: newMinStock,
            status: ing.quantity >= newMinStock ? "Nzuri" : "Chini",
          };
        }
        return ing;
      })
    );

    setHistory((prev) => [
      {
        id: prev.length + 1,
        date: "2026-04-19 " + new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }),
        ingredient: formData.name,
        type: "EDIT",
        quantity: "-",
        unit: formData.unit,
        requestedBy: "Hassan",
        approvalStatus: "Inasubiri",
      },
      ...prev,
    ]);

    closeModal();
  };

  const handleDeleteIngredient = () => {
    if (!selectedIngredient || !formData.deleteReason) return;

    setIngredients((prev) => prev.filter((ing) => ing.id !== selectedIngredient.id));

    setHistory((prev) => [
      {
        id: prev.length + 1,
        date: "2026-04-19 " + new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }),
        ingredient: selectedIngredient.name,
        type: "DELETE",
        quantity: "-",
        unit: selectedIngredient.unit,
        requestedBy: "Hassan",
        approvalStatus: "Inasubiri",
      },
      ...prev,
    ]);

    closeModal();
  };

  const handleAddNewIngredient = () => {
    if (!formData.name || !formData.quantity || !formData.totalCost) return;
    const qty = parseFloat(formData.quantity);
    const cost = parseFloat(formData.totalCost);
    const minStk = parseFloat(formData.minStock) || 5;
    if (isNaN(qty) || isNaN(cost) || qty <= 0) return;

    const newIngredient: Ingredient = {
      id: Math.max(...ingredients.map((i) => i.id)) + 1,
      name: formData.name,
      nameEn: formData.nameEn || formData.name,
      unit: formData.unit,
      quantity: qty,
      costPerUnit: Math.round(cost / qty),
      minStock: minStk,
      category: formData.category,
      status: qty >= minStk ? "Nzuri" : "Chini",
    };

    setIngredients((prev) => [...prev, newIngredient]);

    setHistory((prev) => [
      {
        id: prev.length + 1,
        date: "2026-04-19 " + new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }),
        ingredient: formData.name,
        type: "IN",
        quantity: qty,
        unit: formData.unit,
        requestedBy: "Hassan",
        approvalStatus: "Inasubiri",
      },
      ...prev,
    ]);

    closeModal();
  };

  /* ── Auto-calc cost per unit in add-stock modal ── */
  const calcCostPerUnit = () => {
    const qty = parseFloat(formData.quantity);
    const cost = parseFloat(formData.totalCost);
    if (!isNaN(qty) && !isNaN(cost) && qty > 0) {
      return formatTZS(Math.round(cost / qty));
    }
    return "---";
  };

  /* ── Tabs config ── */
  const tabs: { id: TabId; label: string; labelEn: string }[] = [
    { id: "stoku-sasa", label: "Stoku Sasa", labelEn: "Current Stock" },
    { id: "imeingizwa", label: "Imeingizwa", labelEn: "Stock In" },
    { id: "imetolewa", label: "Imetolewa", labelEn: "Stock Out" },
    { id: "historia", label: "Historia", labelEn: "History" },
  ];

  /* ── Summary cards config ── */
  const summaryCards: {
    filter: StockFilter;
    label: string;
    labelEn: string;
    value: number;
    color: string;
    bgColor: string;
    borderColor: string;
    iconBg: string;
  }[] = [
    {
      filter: "all",
      label: "Bidhaa Zote",
      labelEn: "Total Items",
      value: totalItems,
      color: "text-brand-green",
      bgColor: "bg-brand-green/5",
      borderColor: "border-brand-green/20",
      iconBg: "bg-brand-green/10",
    },
    {
      filter: "low",
      label: "Stoku Chini",
      labelEn: "Low Stock",
      value: lowStockItems.length,
      color: "text-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
      iconBg: "bg-red-100",
    },
    {
      filter: "pending",
      label: "Zinasubiri Idhini",
      labelEn: "Pending Approval",
      value: pendingApprovals.length,
      color: "text-brand-orange",
      bgColor: "bg-brand-orange/5",
      borderColor: "border-brand-orange/20",
      iconBg: "bg-brand-orange/10",
    },
    {
      filter: "out-today",
      label: "Zimetoka Leo",
      labelEn: "Out Today",
      value: outToday.length,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      iconBg: "bg-blue-100",
    },
  ];

  /* ── Movement type badge ── */
  const typeBadge = (type: MovementType) => {
    const map: Record<MovementType, { label: string; cls: string }> = {
      IN: { label: "INGIZO", cls: "bg-green-100 text-green-700" },
      OUT: { label: "TOLEWO", cls: "bg-red-100 text-red-700" },
      EDIT: { label: "HARIRI", cls: "bg-blue-100 text-blue-700" },
      DELETE: { label: "FUTA", cls: "bg-gray-200 text-gray-700" },
    };
    const b = map[type];
    return (
      <span className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${b.cls}`}>
        {b.label}
      </span>
    );
  };

  /* ── Approval badge ── */
  const approvalBadge = (status: ApprovalStatus) => {
    const map: Record<ApprovalStatus, { cls: string }> = {
      Imekubaliwa: { cls: "bg-green-100 text-green-700" },
      Imekataliwa: { cls: "bg-red-100 text-red-700" },
      Inasubiri: { cls: "bg-brand-orange/10 text-brand-orange" },
    };
    const b = map[status];
    return (
      <span className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold ${b.cls}`}>
        {status}
      </span>
    );
  };

  /* ──────────────────────────── RENDER ──────────────────────────── */
  return (
    <div className="space-y-6">
      {/* ── Page header ── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Stoku</h1>
          <p className="text-sm text-muted-foreground">Stock Manager — Dhibiti bidhaa zako zote</p>
        </div>
        <button
          onClick={() => openModal("add-new")}
          className="flex items-center gap-2 rounded-xl bg-brand-green px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-green-dark active:scale-[0.98]"
        >
          <PlusIcon className="h-4 w-4" />
          Ongeza Bidhaa Mpya
        </button>
      </div>

      {/* ── Summary Cards ── */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {summaryCards.map((card) => (
          <button
            key={card.filter}
            onClick={() => {
              setStockFilter(card.filter);
              if (card.filter === "pending") {
                setActiveTab("historia");
              } else if (card.filter === "out-today") {
                setActiveTab("imetolewa");
              } else {
                setActiveTab("stoku-sasa");
              }
            }}
            className={`group relative overflow-hidden rounded-xl border-2 p-4 text-left transition-all hover:shadow-md active:scale-[0.98] ${
              stockFilter === card.filter
                ? `${card.borderColor} ${card.bgColor} shadow-sm`
                : "border-border bg-card hover:border-gray-300"
            }`}
          >
            <div className={`mb-2 flex h-9 w-9 items-center justify-center rounded-lg ${card.iconBg}`}>
              {card.filter === "all" && (
                <svg className={`h-4 w-4 ${card.color}`} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              )}
              {card.filter === "low" && (
                <svg className={`h-4 w-4 ${card.color}`} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              )}
              {card.filter === "pending" && (
                <svg className={`h-4 w-4 ${card.color}`} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
              {card.filter === "out-today" && (
                <svg className={`h-4 w-4 ${card.color}`} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              )}
            </div>
            <p className="text-xs font-medium text-muted-foreground">{card.labelEn}</p>
            <p className="text-sm font-bold text-foreground">{card.label}</p>
            <p className={`mt-1 text-2xl font-extrabold ${card.color}`}>{card.value}</p>
          </button>
        ))}
      </div>

      {/* ── Tabs ── */}
      <div className="flex items-center gap-1 rounded-xl border border-border bg-card p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              if (tab.id === "stoku-sasa") setStockFilter("all");
            }}
            className={`flex-1 rounded-lg px-3 py-2 text-center text-sm font-medium transition ${
              activeTab === tab.id
                ? "bg-brand-green text-white shadow-sm"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <span className="block">{tab.label}</span>
            <span className="block text-[10px] opacity-70">{tab.labelEn}</span>
          </button>
        ))}
      </div>

      {/* ── Search bar (only on stock tab) ── */}
      {activeTab === "stoku-sasa" && (
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Tafuta bidhaa... (Search ingredients)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-border bg-card py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-brand-green focus:outline-none focus:ring-2 focus:ring-brand-green/20"
          />
        </div>
      )}

      {/* ══════════════════════ STOKU SASA TAB ══════════════════════ */}
      {activeTab === "stoku-sasa" && (
        <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-4 py-3 text-left font-semibold text-foreground">
                    Bidhaa
                    <span className="block text-[10px] font-normal text-muted-foreground">Ingredient</span>
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-foreground">
                    Kitengo
                    <span className="block text-[10px] font-normal text-muted-foreground">Unit</span>
                  </th>
                  <th className="px-4 py-3 text-right font-semibold text-foreground">
                    Kiasi
                    <span className="block text-[10px] font-normal text-muted-foreground">Quantity</span>
                  </th>
                  <th className="px-4 py-3 text-right font-semibold text-foreground">
                    Gharama/Kitengo
                    <span className="block text-[10px] font-normal text-muted-foreground">Cost/Unit</span>
                  </th>
                  <th className="px-4 py-3 text-right font-semibold text-foreground">
                    Thamani
                    <span className="block text-[10px] font-normal text-muted-foreground">Value</span>
                  </th>
                  <th className="px-4 py-3 text-center font-semibold text-foreground">
                    Hali
                    <span className="block text-[10px] font-normal text-muted-foreground">Status</span>
                  </th>
                  <th className="px-4 py-3 text-center font-semibold text-foreground">
                    Vitendo
                    <span className="block text-[10px] font-normal text-muted-foreground">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {getFilteredIngredients().map((ing) => (
                  <tr key={ing.id} className="border-b border-border transition hover:bg-muted/30">
                    <td className="px-4 py-3">
                      <p className="font-medium text-foreground">{ing.name}</p>
                      <p className="text-[11px] text-muted-foreground">{ing.nameEn}</p>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{ing.unit}</td>
                    <td className="px-4 py-3 text-right font-semibold text-foreground">{ing.quantity}</td>
                    <td className="px-4 py-3 text-right text-muted-foreground">{formatTZS(ing.costPerUnit)}</td>
                    <td className="px-4 py-3 text-right font-semibold text-foreground">
                      {formatTZS(ing.quantity * ing.costPerUnit)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {ing.status === "Chini" ? (
                        <span className="inline-block rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-bold text-red-600">
                          Chini
                        </span>
                      ) : (
                        <span className="inline-block rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-bold text-green-700">
                          Nzuri
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => openModal("add-stock", ing)}
                          title="Ongeza stoku"
                          className="rounded-lg p-1.5 text-brand-green transition hover:bg-brand-green/10"
                        >
                          <PlusIcon />
                        </button>
                        <button
                          onClick={() => openModal("deduct-stock", ing)}
                          title="Punguza stoku"
                          className="rounded-lg p-1.5 text-brand-orange transition hover:bg-brand-orange/10"
                        >
                          <MinusIcon />
                        </button>
                        <button
                          onClick={() => openModal("edit", ing)}
                          title="Hariri"
                          className="rounded-lg p-1.5 text-blue-600 transition hover:bg-blue-50"
                        >
                          <PencilIcon />
                        </button>
                        <button
                          onClick={() => openModal("delete", ing)}
                          title="Futa"
                          className="rounded-lg p-1.5 text-red-500 transition hover:bg-red-50"
                        >
                          <TrashIcon />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="space-y-3 p-3 md:hidden">
            {getFilteredIngredients().map((ing) => (
              <div key={ing.id} className="rounded-xl border border-border bg-card p-4 shadow-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-foreground">{ing.name}</p>
                    <p className="text-xs text-muted-foreground">{ing.nameEn}</p>
                  </div>
                  {ing.status === "Chini" ? (
                    <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-bold text-red-600">Chini</span>
                  ) : (
                    <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-bold text-green-700">Nzuri</span>
                  )}
                </div>
                <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                  <div className="rounded-lg bg-muted/50 p-2">
                    <p className="text-[10px] text-muted-foreground">Kiasi</p>
                    <p className="text-sm font-bold text-foreground">
                      {ing.quantity} {ing.unit}
                    </p>
                  </div>
                  <div className="rounded-lg bg-muted/50 p-2">
                    <p className="text-[10px] text-muted-foreground">Gharama</p>
                    <p className="text-sm font-bold text-foreground">{formatTZS(ing.costPerUnit)}</p>
                  </div>
                  <div className="rounded-lg bg-muted/50 p-2">
                    <p className="text-[10px] text-muted-foreground">Thamani</p>
                    <p className="text-sm font-bold text-brand-green">{formatTZS(ing.quantity * ing.costPerUnit)}</p>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-end gap-1.5">
                  <button
                    onClick={() => openModal("add-stock", ing)}
                    className="rounded-lg bg-brand-green/10 p-2 text-brand-green transition hover:bg-brand-green/20"
                  >
                    <PlusIcon />
                  </button>
                  <button
                    onClick={() => openModal("deduct-stock", ing)}
                    className="rounded-lg bg-brand-orange/10 p-2 text-brand-orange transition hover:bg-brand-orange/20"
                  >
                    <MinusIcon />
                  </button>
                  <button
                    onClick={() => openModal("edit", ing)}
                    className="rounded-lg bg-blue-50 p-2 text-blue-600 transition hover:bg-blue-100"
                  >
                    <PencilIcon />
                  </button>
                  <button
                    onClick={() => openModal("delete", ing)}
                    className="rounded-lg bg-red-50 p-2 text-red-500 transition hover:bg-red-100"
                  >
                    <TrashIcon />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {getFilteredIngredients().length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <SearchIcon className="mb-3 h-8 w-8 text-muted-foreground/40" />
              <p className="text-sm font-medium text-muted-foreground">Hakuna bidhaa zilizopatikana</p>
              <p className="text-xs text-muted-foreground">No ingredients found</p>
            </div>
          )}

          {/* Total value footer */}
          {getFilteredIngredients().length > 0 && (
            <div className="border-t border-border bg-muted/30 px-4 py-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-foreground">
                  Thamani ya Jumla
                  <span className="ml-1 text-xs font-normal text-muted-foreground">(Total Value)</span>
                </p>
                <p className="text-lg font-extrabold text-brand-green">
                  {formatTZS(
                    getFilteredIngredients().reduce((sum, ing) => sum + ing.quantity * ing.costPerUnit, 0)
                  )}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ══════════════════════ HISTORY / IN / OUT TABS ══════════════════════ */}
      {(activeTab === "historia" || activeTab === "imeingizwa" || activeTab === "imetolewa") && (
        <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-4 py-3 text-left font-semibold text-foreground">
                    Tarehe
                    <span className="block text-[10px] font-normal text-muted-foreground">Date</span>
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-foreground">
                    Bidhaa
                    <span className="block text-[10px] font-normal text-muted-foreground">Ingredient</span>
                  </th>
                  <th className="px-4 py-3 text-center font-semibold text-foreground">
                    Aina
                    <span className="block text-[10px] font-normal text-muted-foreground">Type</span>
                  </th>
                  <th className="px-4 py-3 text-right font-semibold text-foreground">
                    Kiasi
                    <span className="block text-[10px] font-normal text-muted-foreground">Quantity</span>
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-foreground">
                    Aliyeomba
                    <span className="block text-[10px] font-normal text-muted-foreground">Requested By</span>
                  </th>
                  <th className="px-4 py-3 text-center font-semibold text-foreground">
                    Hali ya Idhini
                    <span className="block text-[10px] font-normal text-muted-foreground">Approval Status</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {getFilteredHistory()
                  .filter((h) => {
                    if (stockFilter === "pending") return h.approvalStatus === "Inasubiri";
                    if (stockFilter === "out-today")
                      return h.date.startsWith("2026-04-19") && h.type === "OUT" && h.approvalStatus === "Imekubaliwa";
                    return true;
                  })
                  .map((entry) => (
                    <tr key={entry.id} className="border-b border-border transition hover:bg-muted/30">
                      <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{entry.date}</td>
                      <td className="px-4 py-3 font-medium text-foreground">{entry.ingredient}</td>
                      <td className="px-4 py-3 text-center">{typeBadge(entry.type)}</td>
                      <td className="px-4 py-3 text-right font-semibold text-foreground">
                        {entry.quantity !== "-" ? `${entry.quantity} ${entry.unit}` : "-"}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{entry.requestedBy}</td>
                      <td className="px-4 py-3 text-center">{approvalBadge(entry.approvalStatus)}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards for history */}
          <div className="space-y-3 p-3 md:hidden">
            {getFilteredHistory()
              .filter((h) => {
                if (stockFilter === "pending") return h.approvalStatus === "Inasubiri";
                if (stockFilter === "out-today")
                  return h.date.startsWith("2026-04-19") && h.type === "OUT" && h.approvalStatus === "Imekubaliwa";
                return true;
              })
              .map((entry) => (
                <div key={entry.id} className="rounded-xl border border-border p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold text-foreground">{entry.ingredient}</p>
                      <p className="text-[11px] text-muted-foreground">{entry.date}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      {typeBadge(entry.type)}
                      {approvalBadge(entry.approvalStatus)}
                    </div>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">
                      Kiasi: <span className="font-semibold text-foreground">{entry.quantity !== "-" ? `${entry.quantity} ${entry.unit}` : "-"}</span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Na: <span className="font-medium text-foreground">{entry.requestedBy}</span>
                    </p>
                  </div>
                </div>
              ))}
          </div>

          {getFilteredHistory().filter((h) => {
            if (stockFilter === "pending") return h.approvalStatus === "Inasubiri";
            if (stockFilter === "out-today")
              return h.date.startsWith("2026-04-19") && h.type === "OUT" && h.approvalStatus === "Imekubaliwa";
            return true;
          }).length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-sm font-medium text-muted-foreground">Hakuna historia</p>
              <p className="text-xs text-muted-foreground">No history records found</p>
            </div>
          )}
        </div>
      )}

      {/* ══════════════════════ MODALS ══════════════════════ */}
      {modalType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={closeModal} />

          {/* Modal content */}
          <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-card shadow-2xl">
            {/* Approval banner */}
            <div className="flex items-center gap-2 bg-brand-orange/10 px-5 py-2.5">
              <ShieldIcon className="h-4 w-4 text-brand-orange" />
              <p className="text-xs font-semibold text-brand-orange">
                Idhini inahitajika
                <span className="ml-1 font-normal text-brand-orange/70">— Approval required</span>
              </p>
            </div>

            {/* Header */}
            <div className="flex items-center justify-between border-b border-border px-5 py-3">
              <h2 className="text-base font-bold text-foreground">
                {modalType === "add-stock" && "Ongeza Stoku"}
                {modalType === "deduct-stock" && "Punguza Stoku"}
                {modalType === "edit" && "Hariri Bidhaa"}
                {modalType === "delete" && "Futa Bidhaa"}
                {modalType === "add-new" && "Ongeza Bidhaa Mpya"}
              </h2>
              <button onClick={closeModal} className="rounded-lg p-1 text-muted-foreground transition hover:bg-muted">
                <XIcon />
              </button>
            </div>

            <div className="p-5">
              {/* ── ADD STOCK MODAL ── */}
              {modalType === "add-stock" && selectedIngredient && (
                <div className="space-y-4">
                  <div className="rounded-lg bg-muted/50 p-3">
                    <p className="text-sm font-semibold text-foreground">{selectedIngredient.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Sasa: {selectedIngredient.quantity} {selectedIngredient.unit}
                    </p>
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-semibold text-foreground">
                      Kiasi <span className="font-normal text-muted-foreground">(Quantity in {selectedIngredient.unit})</span>
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      value={formData.quantity}
                      onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                      className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground focus:border-brand-green focus:outline-none focus:ring-2 focus:ring-brand-green/20"
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-semibold text-foreground">
                      Gharama ya Jumla <span className="font-normal text-muted-foreground">(Total Cost)</span>
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.totalCost}
                      onChange={(e) => setFormData({ ...formData, totalCost: e.target.value })}
                      className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground focus:border-brand-green focus:outline-none focus:ring-2 focus:ring-brand-green/20"
                      placeholder="0"
                    />
                  </div>

                  <div className="rounded-lg bg-brand-gold/10 p-3">
                    <p className="text-xs text-muted-foreground">Gharama kwa kitengo (Cost per unit)</p>
                    <p className="text-sm font-bold text-brand-charcoal">{calcCostPerUnit()}</p>
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-semibold text-foreground">
                      Msambazaji <span className="font-normal text-muted-foreground">(Supplier)</span>
                    </label>
                    <input
                      type="text"
                      value={formData.supplier}
                      onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                      className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground focus:border-brand-green focus:outline-none focus:ring-2 focus:ring-brand-green/20"
                      placeholder="Jina la msambazaji"
                    />
                  </div>

                  <button
                    onClick={handleAddStock}
                    className="w-full rounded-xl bg-brand-green py-2.5 text-sm font-semibold text-white transition hover:bg-brand-green-dark active:scale-[0.98]"
                  >
                    Wasilisha kwa Idhini
                  </button>
                </div>
              )}

              {/* ── DEDUCT STOCK MODAL ── */}
              {modalType === "deduct-stock" && selectedIngredient && (
                <div className="space-y-4">
                  <div className="rounded-lg bg-muted/50 p-3">
                    <p className="text-sm font-semibold text-foreground">{selectedIngredient.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Sasa: {selectedIngredient.quantity} {selectedIngredient.unit}
                    </p>
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-semibold text-foreground">
                      Kiasi <span className="font-normal text-muted-foreground">(Quantity to deduct)</span>
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max={selectedIngredient.quantity}
                      value={formData.quantity}
                      onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                      className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground focus:border-brand-green focus:outline-none focus:ring-2 focus:ring-brand-green/20"
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-semibold text-foreground">
                      Sababu <span className="font-normal text-muted-foreground">(Reason)</span>
                    </label>
                    <select
                      value={formData.reason}
                      onChange={(e) => setFormData({ ...formData, reason: e.target.value as DeductReason })}
                      className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground focus:border-brand-green focus:outline-none focus:ring-2 focus:ring-brand-green/20"
                    >
                      <option value="Imeharibika">Imeharibika (Spoiled)</option>
                      <option value="Matumizi binafsi">Matumizi binafsi (Personal use)</option>
                      <option value="Nyingine">Nyingine (Other)</option>
                    </select>
                  </div>

                  {formData.reason === "Nyingine" && (
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-foreground">
                        Eleza sababu <span className="font-normal text-muted-foreground">(Explain)</span>
                      </label>
                      <input
                        type="text"
                        value={formData.customReason}
                        onChange={(e) => setFormData({ ...formData, customReason: e.target.value })}
                        className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground focus:border-brand-green focus:outline-none focus:ring-2 focus:ring-brand-green/20"
                        placeholder="Andika sababu"
                      />
                    </div>
                  )}

                  <button
                    onClick={handleDeductStock}
                    className="w-full rounded-xl bg-brand-orange py-2.5 text-sm font-semibold text-white transition hover:bg-brand-orange-light active:scale-[0.98]"
                  >
                    Wasilisha kwa Idhini
                  </button>
                </div>
              )}

              {/* ── EDIT MODAL ── */}
              {modalType === "edit" && selectedIngredient && (
                <div className="space-y-4">
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-foreground">
                      Jina <span className="font-normal text-muted-foreground">(Name)</span>
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground focus:border-brand-green focus:outline-none focus:ring-2 focus:ring-brand-green/20"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-semibold text-foreground">
                      Jina kwa Kiingereza <span className="font-normal text-muted-foreground">(English Name)</span>
                    </label>
                    <input
                      type="text"
                      value={formData.nameEn}
                      onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                      className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground focus:border-brand-green focus:outline-none focus:ring-2 focus:ring-brand-green/20"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-semibold text-foreground">
                      Kitengo <span className="font-normal text-muted-foreground">(Unit)</span>
                    </label>
                    <select
                      value={formData.unit}
                      onChange={(e) => setFormData({ ...formData, unit: e.target.value as Unit })}
                      className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground focus:border-brand-green focus:outline-none focus:ring-2 focus:ring-brand-green/20"
                    >
                      <option value="kg">kg</option>
                      <option value="lita">lita</option>
                      <option value="kipande">kipande</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-semibold text-foreground">
                      Kiwango cha Chini <span className="font-normal text-muted-foreground">(Min Stock Level)</span>
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      value={formData.minStock}
                      onChange={(e) => setFormData({ ...formData, minStock: e.target.value })}
                      className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground focus:border-brand-green focus:outline-none focus:ring-2 focus:ring-brand-green/20"
                    />
                  </div>

                  <button
                    onClick={handleEditIngredient}
                    className="w-full rounded-xl bg-brand-green py-2.5 text-sm font-semibold text-white transition hover:bg-brand-green-dark active:scale-[0.98]"
                  >
                    Wasilisha Mabadiliko
                  </button>
                </div>
              )}

              {/* ── DELETE MODAL ── */}
              {modalType === "delete" && selectedIngredient && (
                <div className="space-y-4">
                  <div className="rounded-lg border-2 border-red-200 bg-red-50 p-4 text-center">
                    <TrashIcon className="mx-auto mb-2 h-8 w-8 text-red-400" />
                    <p className="text-sm font-semibold text-red-700">
                      Una uhakika unataka kufuta &quot;{selectedIngredient.name}&quot;?
                    </p>
                    <p className="text-xs text-red-500">Are you sure you want to delete this ingredient?</p>
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-semibold text-foreground">
                      Sababu ya Kufuta <span className="font-normal text-muted-foreground">(Reason for deletion)</span>
                    </label>
                    <input
                      type="text"
                      value={formData.deleteReason}
                      onChange={(e) => setFormData({ ...formData, deleteReason: e.target.value })}
                      className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground focus:border-brand-green focus:outline-none focus:ring-2 focus:ring-brand-green/20"
                      placeholder="Andika sababu ya kufuta"
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={closeModal}
                      className="flex-1 rounded-xl border border-border py-2.5 text-sm font-semibold text-foreground transition hover:bg-muted active:scale-[0.98]"
                    >
                      Ghairi
                    </button>
                    <button
                      onClick={handleDeleteIngredient}
                      disabled={!formData.deleteReason.trim()}
                      className="flex-1 rounded-xl bg-red-600 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Futa
                    </button>
                  </div>
                </div>
              )}

              {/* ── ADD NEW INGREDIENT MODAL ── */}
              {modalType === "add-new" && (
                <div className="space-y-4">
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-foreground">
                      Jina <span className="font-normal text-muted-foreground">(Name in Swahili)</span>
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground focus:border-brand-green focus:outline-none focus:ring-2 focus:ring-brand-green/20"
                      placeholder="Mfano: Wali"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-semibold text-foreground">
                      Jina kwa Kiingereza <span className="font-normal text-muted-foreground">(English Name)</span>
                    </label>
                    <input
                      type="text"
                      value={formData.nameEn}
                      onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                      className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground focus:border-brand-green focus:outline-none focus:ring-2 focus:ring-brand-green/20"
                      placeholder="e.g. Rice"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-foreground">
                        Kitengo <span className="font-normal text-muted-foreground">(Unit)</span>
                      </label>
                      <select
                        value={formData.unit}
                        onChange={(e) => setFormData({ ...formData, unit: e.target.value as Unit })}
                        className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground focus:border-brand-green focus:outline-none focus:ring-2 focus:ring-brand-green/20"
                      >
                        <option value="kg">kg</option>
                        <option value="lita">lita</option>
                        <option value="kipande">kipande (piece)</option>
                      </select>
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-foreground">
                        Aina <span className="font-normal text-muted-foreground">(Category)</span>
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value as Category })}
                        className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground focus:border-brand-green focus:outline-none focus:ring-2 focus:ring-brand-green/20"
                      >
                        <option value="Protini">Protini (Protein)</option>
                        <option value="Mboga">Mboga (Vegetables)</option>
                        <option value="Nafaka">Nafaka (Grains)</option>
                        <option value="Viungo">Viungo (Spices/Others)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-semibold text-foreground">
                      Kiasi cha Kwanza <span className="font-normal text-muted-foreground">(Initial Quantity)</span>
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      value={formData.quantity}
                      onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                      className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground focus:border-brand-green focus:outline-none focus:ring-2 focus:ring-brand-green/20"
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-semibold text-foreground">
                      Gharama ya Jumla <span className="font-normal text-muted-foreground">(Total Cost)</span>
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.totalCost}
                      onChange={(e) => setFormData({ ...formData, totalCost: e.target.value })}
                      className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground focus:border-brand-green focus:outline-none focus:ring-2 focus:ring-brand-green/20"
                      placeholder="0"
                    />
                  </div>

                  {formData.quantity && formData.totalCost && (
                    <div className="rounded-lg bg-brand-gold/10 p-3">
                      <p className="text-xs text-muted-foreground">Gharama kwa kitengo (Cost per unit)</p>
                      <p className="text-sm font-bold text-brand-charcoal">{calcCostPerUnit()}</p>
                    </div>
                  )}

                  <div>
                    <label className="mb-1 block text-xs font-semibold text-foreground">
                      Msambazaji <span className="font-normal text-muted-foreground">(Supplier)</span>
                    </label>
                    <input
                      type="text"
                      value={formData.supplier}
                      onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                      className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground focus:border-brand-green focus:outline-none focus:ring-2 focus:ring-brand-green/20"
                      placeholder="Jina la msambazaji"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-semibold text-foreground">
                      Kiwango cha Chini <span className="font-normal text-muted-foreground">(Min Stock Level)</span>
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      value={formData.minStock}
                      onChange={(e) => setFormData({ ...formData, minStock: e.target.value })}
                      className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground focus:border-brand-green focus:outline-none focus:ring-2 focus:ring-brand-green/20"
                      placeholder="5"
                    />
                  </div>

                  <button
                    onClick={handleAddNewIngredient}
                    disabled={!formData.name || !formData.quantity || !formData.totalCost}
                    className="w-full rounded-xl bg-brand-green py-2.5 text-sm font-semibold text-white transition hover:bg-brand-green-dark active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Ongeza na Wasilisha kwa Idhini
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
