"use client";

import { useState, useMemo } from "react";

/* ══════════════════════════════════════════════════════════════════════════════
   TYPES
   ══════════════════════════════════════════════════════════════════════════════ */

interface MenuCategory {
  id: number;
  name: string;
  nameEn: string;
  sort_order: number;
  itemCount: number;
}

interface RecipeIngredient {
  id: number;
  name: string;
  nameEn: string;
  unit: string;
  quantityNeeded: number;
  costPerUnit: number;
}

interface MenuItem {
  id: number;
  name: string;
  nameEn: string;
  description: string;
  price: number;
  categoryId: number;
  imageUrl: string;
  available: boolean;
  ingredients: RecipeIngredient[];
}

type ModalType =
  | "add-item"
  | "edit-item"
  | "delete-item"
  | "add-category"
  | "edit-category"
  | "delete-category"
  | null;

/* ══════════════════════════════════════════════════════════════════════════════
   SAMPLE DATA
   ══════════════════════════════════════════════════════════════════════════════ */

const sampleIngredients: { id: number; name: string; nameEn: string; unit: string; costPerUnit: number }[] = [
  { id: 1, name: "Nyama ya Ng'ombe", nameEn: "Beef", unit: "kg", costPerUnit: 15000 },
  { id: 2, name: "Mchele", nameEn: "Rice", unit: "kg", costPerUnit: 3500 },
  { id: 3, name: "Viazi", nameEn: "Potatoes", unit: "kg", costPerUnit: 2000 },
  { id: 4, name: "Nyanya", nameEn: "Tomatoes", unit: "kg", costPerUnit: 3000 },
  { id: 5, name: "Vitunguu", nameEn: "Onions", unit: "kg", costPerUnit: 4000 },
  { id: 6, name: "Mafuta", nameEn: "Cooking Oil", unit: "lita", costPerUnit: 5000 },
  { id: 7, name: "Unga wa Ngano", nameEn: "Wheat Flour", unit: "kg", costPerUnit: 2800 },
  { id: 8, name: "Kuku", nameEn: "Chicken", unit: "kg", costPerUnit: 12000 },
  { id: 9, name: "Maharage", nameEn: "Beans", unit: "kg", costPerUnit: 3000 },
  { id: 10, name: "Embe", nameEn: "Mango", unit: "kg", costPerUnit: 4000 },
  { id: 11, name: "Chai Majani", nameEn: "Tea Leaves", unit: "kg", costPerUnit: 8000 },
  { id: 12, name: "Sukari", nameEn: "Sugar", unit: "kg", costPerUnit: 3200 },
  { id: 13, name: "Samaki", nameEn: "Fish", unit: "kg", costPerUnit: 14000 },
  { id: 14, name: "Nazi", nameEn: "Coconut Milk", unit: "lita", costPerUnit: 3000 },
  { id: 15, name: "Pilipili", nameEn: "Spices/Pepper", unit: "kg", costPerUnit: 15000 },
  { id: 16, name: "Mayai", nameEn: "Eggs", unit: "kipande", costPerUnit: 500 },
  { id: 17, name: "Maziwa", nameEn: "Milk", unit: "lita", costPerUnit: 3000 },
];

const initialCategories: MenuCategory[] = [
  { id: 1, name: "Vyakula Vikuu", nameEn: "Main Dishes", sort_order: 1, itemCount: 7 },
  { id: 2, name: "Vinywaji", nameEn: "Drinks", sort_order: 2, itemCount: 2 },
  { id: 3, name: "Vitafunio", nameEn: "Snacks", sort_order: 3, itemCount: 2 },
  { id: 4, name: "Supu & Mchuzi", nameEn: "Soups & Sauces", sort_order: 4, itemCount: 1 },
  { id: 5, name: "Desserts", nameEn: "Desserts", sort_order: 5, itemCount: 1 },
];

const initialMenuItems: MenuItem[] = [
  {
    id: 1, name: "Ugali na Nyama", nameEn: "Ugali with Meat", description: "Ugali laini na mchuzi wa nyama ya ng'ombe iliyopikwa vizuri",
    price: 7000, categoryId: 1, imageUrl: "", available: true,
    ingredients: [
      { id: 7, name: "Unga wa Ngano", nameEn: "Wheat Flour", unit: "kg", quantityNeeded: 0.3, costPerUnit: 2800 },
      { id: 1, name: "Nyama ya Ng'ombe", nameEn: "Beef", unit: "kg", quantityNeeded: 0.25, costPerUnit: 15000 },
      { id: 4, name: "Nyanya", nameEn: "Tomatoes", unit: "kg", quantityNeeded: 0.15, costPerUnit: 3000 },
      { id: 5, name: "Vitunguu", nameEn: "Onions", unit: "kg", quantityNeeded: 0.1, costPerUnit: 4000 },
      { id: 6, name: "Mafuta", nameEn: "Cooking Oil", unit: "lita", quantityNeeded: 0.05, costPerUnit: 5000 },
    ],
  },
  {
    id: 2, name: "Pilau", nameEn: "Spiced Rice", description: "Pilau ya nyama na viungo maalum vya Kiswahili",
    price: 8000, categoryId: 1, imageUrl: "", available: true,
    ingredients: [
      { id: 2, name: "Mchele", nameEn: "Rice", unit: "kg", quantityNeeded: 0.3, costPerUnit: 3500 },
      { id: 1, name: "Nyama ya Ng'ombe", nameEn: "Beef", unit: "kg", quantityNeeded: 0.2, costPerUnit: 15000 },
      { id: 5, name: "Vitunguu", nameEn: "Onions", unit: "kg", quantityNeeded: 0.15, costPerUnit: 4000 },
      { id: 6, name: "Mafuta", nameEn: "Cooking Oil", unit: "lita", quantityNeeded: 0.08, costPerUnit: 5000 },
      { id: 15, name: "Pilipili", nameEn: "Spices/Pepper", unit: "kg", quantityNeeded: 0.02, costPerUnit: 15000 },
    ],
  },
  {
    id: 3, name: "Chips Mayai", nameEn: "Chips Omelette", description: "Chipsi za viazi zilizochanganywa na mayai",
    price: 5000, categoryId: 1, imageUrl: "", available: true,
    ingredients: [
      { id: 3, name: "Viazi", nameEn: "Potatoes", unit: "kg", quantityNeeded: 0.4, costPerUnit: 2000 },
      { id: 16, name: "Mayai", nameEn: "Eggs", unit: "kipande", quantityNeeded: 3, costPerUnit: 500 },
      { id: 6, name: "Mafuta", nameEn: "Cooking Oil", unit: "lita", quantityNeeded: 0.2, costPerUnit: 5000 },
      { id: 5, name: "Vitunguu", nameEn: "Onions", unit: "kg", quantityNeeded: 0.05, costPerUnit: 4000 },
    ],
  },
  {
    id: 4, name: "Wali na Maharage", nameEn: "Rice & Beans", description: "Wali mweupe na maharage ya nazi",
    price: 3500, categoryId: 1, imageUrl: "", available: true,
    ingredients: [
      { id: 2, name: "Mchele", nameEn: "Rice", unit: "kg", quantityNeeded: 0.3, costPerUnit: 3500 },
      { id: 9, name: "Maharage", nameEn: "Beans", unit: "kg", quantityNeeded: 0.2, costPerUnit: 3000 },
      { id: 14, name: "Nazi", nameEn: "Coconut Milk", unit: "lita", quantityNeeded: 0.1, costPerUnit: 3000 },
      { id: 5, name: "Vitunguu", nameEn: "Onions", unit: "kg", quantityNeeded: 0.05, costPerUnit: 4000 },
    ],
  },
  {
    id: 5, name: "Mishkaki", nameEn: "Grilled Skewers", description: "Nyama ya ng'ombe iliyochomwa kwa moto",
    price: 5000, categoryId: 3, imageUrl: "", available: true,
    ingredients: [
      { id: 1, name: "Nyama ya Ng'ombe", nameEn: "Beef", unit: "kg", quantityNeeded: 0.25, costPerUnit: 15000 },
      { id: 5, name: "Vitunguu", nameEn: "Onions", unit: "kg", quantityNeeded: 0.05, costPerUnit: 4000 },
      { id: 15, name: "Pilipili", nameEn: "Spices/Pepper", unit: "kg", quantityNeeded: 0.01, costPerUnit: 15000 },
    ],
  },
  {
    id: 6, name: "Biriyani", nameEn: "Biryani", description: "Biriyani ya kuku na viungo vya asili",
    price: 10000, categoryId: 1, imageUrl: "", available: true,
    ingredients: [
      { id: 2, name: "Mchele", nameEn: "Rice", unit: "kg", quantityNeeded: 0.35, costPerUnit: 3500 },
      { id: 8, name: "Kuku", nameEn: "Chicken", unit: "kg", quantityNeeded: 0.3, costPerUnit: 12000 },
      { id: 5, name: "Vitunguu", nameEn: "Onions", unit: "kg", quantityNeeded: 0.15, costPerUnit: 4000 },
      { id: 4, name: "Nyanya", nameEn: "Tomatoes", unit: "kg", quantityNeeded: 0.1, costPerUnit: 3000 },
      { id: 15, name: "Pilipili", nameEn: "Spices/Pepper", unit: "kg", quantityNeeded: 0.03, costPerUnit: 15000 },
      { id: 6, name: "Mafuta", nameEn: "Cooking Oil", unit: "lita", quantityNeeded: 0.1, costPerUnit: 5000 },
    ],
  },
  {
    id: 7, name: "Chipsi Kuku", nameEn: "Chips & Chicken", description: "Chipsi na kuku aliyekaangwa hadi akawa na rangi ya dhahabu",
    price: 8000, categoryId: 1, imageUrl: "", available: true,
    ingredients: [
      { id: 3, name: "Viazi", nameEn: "Potatoes", unit: "kg", quantityNeeded: 0.4, costPerUnit: 2000 },
      { id: 8, name: "Kuku", nameEn: "Chicken", unit: "kg", quantityNeeded: 0.3, costPerUnit: 12000 },
      { id: 6, name: "Mafuta", nameEn: "Cooking Oil", unit: "lita", quantityNeeded: 0.3, costPerUnit: 5000 },
    ],
  },
  {
    id: 8, name: "Samosa", nameEn: "Samosa", description: "Samosa za nyama na mboga zilizokaangwa",
    price: 3000, categoryId: 3, imageUrl: "", available: true,
    ingredients: [
      { id: 7, name: "Unga wa Ngano", nameEn: "Wheat Flour", unit: "kg", quantityNeeded: 0.15, costPerUnit: 2800 },
      { id: 1, name: "Nyama ya Ng'ombe", nameEn: "Beef", unit: "kg", quantityNeeded: 0.1, costPerUnit: 15000 },
      { id: 5, name: "Vitunguu", nameEn: "Onions", unit: "kg", quantityNeeded: 0.05, costPerUnit: 4000 },
      { id: 6, name: "Mafuta", nameEn: "Cooking Oil", unit: "lita", quantityNeeded: 0.15, costPerUnit: 5000 },
    ],
  },
  {
    id: 9, name: "Juice ya Embe", nameEn: "Mango Juice", description: "Juice safi ya embe la asili",
    price: 3000, categoryId: 2, imageUrl: "", available: true,
    ingredients: [
      { id: 10, name: "Embe", nameEn: "Mango", unit: "kg", quantityNeeded: 0.3, costPerUnit: 4000 },
      { id: 12, name: "Sukari", nameEn: "Sugar", unit: "kg", quantityNeeded: 0.03, costPerUnit: 3200 },
    ],
  },
  {
    id: 10, name: "Chai", nameEn: "Tea", description: "Chai ya maziwa na tangawizi",
    price: 1500, categoryId: 2, imageUrl: "", available: true,
    ingredients: [
      { id: 11, name: "Chai Majani", nameEn: "Tea Leaves", unit: "kg", quantityNeeded: 0.005, costPerUnit: 8000 },
      { id: 17, name: "Maziwa", nameEn: "Milk", unit: "lita", quantityNeeded: 0.15, costPerUnit: 3000 },
      { id: 12, name: "Sukari", nameEn: "Sugar", unit: "kg", quantityNeeded: 0.02, costPerUnit: 3200 },
    ],
  },
  {
    id: 11, name: "Mchuzi wa Samaki", nameEn: "Fish Curry", description: "Samaki wa kupika na mchuzi wa nazi na viungo",
    price: 12000, categoryId: 4, imageUrl: "", available: true,
    ingredients: [
      { id: 13, name: "Samaki", nameEn: "Fish", unit: "kg", quantityNeeded: 0.35, costPerUnit: 14000 },
      { id: 14, name: "Nazi", nameEn: "Coconut Milk", unit: "lita", quantityNeeded: 0.2, costPerUnit: 3000 },
      { id: 4, name: "Nyanya", nameEn: "Tomatoes", unit: "kg", quantityNeeded: 0.15, costPerUnit: 3000 },
      { id: 5, name: "Vitunguu", nameEn: "Onions", unit: "kg", quantityNeeded: 0.1, costPerUnit: 4000 },
      { id: 15, name: "Pilipili", nameEn: "Spices/Pepper", unit: "kg", quantityNeeded: 0.02, costPerUnit: 15000 },
    ],
  },
  {
    id: 12, name: "Mandazi", nameEn: "Sweet Doughnut", description: "Mandazi tamu ya nazi",
    price: 1500, categoryId: 5, imageUrl: "", available: false,
    ingredients: [
      { id: 7, name: "Unga wa Ngano", nameEn: "Wheat Flour", unit: "kg", quantityNeeded: 0.2, costPerUnit: 2800 },
      { id: 14, name: "Nazi", nameEn: "Coconut Milk", unit: "lita", quantityNeeded: 0.1, costPerUnit: 3000 },
      { id: 12, name: "Sukari", nameEn: "Sugar", unit: "kg", quantityNeeded: 0.05, costPerUnit: 3200 },
      { id: 6, name: "Mafuta", nameEn: "Cooking Oil", unit: "lita", quantityNeeded: 0.15, costPerUnit: 5000 },
    ],
  },
  {
    id: 13, name: "Wali wa Biriyani", nameEn: "Biryani Rice (Veg)", description: "Wali wa biriyani bila nyama, kwa mboga pekee",
    price: 6000, categoryId: 1, imageUrl: "", available: true,
    ingredients: [
      { id: 2, name: "Mchele", nameEn: "Rice", unit: "kg", quantityNeeded: 0.35, costPerUnit: 3500 },
      { id: 5, name: "Vitunguu", nameEn: "Onions", unit: "kg", quantityNeeded: 0.1, costPerUnit: 4000 },
      { id: 4, name: "Nyanya", nameEn: "Tomatoes", unit: "kg", quantityNeeded: 0.1, costPerUnit: 3000 },
      { id: 15, name: "Pilipili", nameEn: "Spices/Pepper", unit: "kg", quantityNeeded: 0.02, costPerUnit: 15000 },
      { id: 6, name: "Mafuta", nameEn: "Cooking Oil", unit: "lita", quantityNeeded: 0.08, costPerUnit: 5000 },
    ],
  },
];

/* ══════════════════════════════════════════════════════════════════════════════
   HELPERS
   ══════════════════════════════════════════════════════════════════════════════ */

function formatTZS(amount: number): string {
  return `TZS ${Math.round(amount).toLocaleString("en-US")}`;
}

function calcCOGS(ingredients: RecipeIngredient[]): number {
  return ingredients.reduce((sum, ing) => sum + ing.quantityNeeded * ing.costPerUnit, 0);
}

/* ══════════════════════════════════════════════════════════════════════════════
   INLINE SVG ICONS
   ══════════════════════════════════════════════════════════════════════════════ */

function SearchIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  );
}

function PlusIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
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

function ChevronUpIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
    </svg>
  );
}

function ChevronDownIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  );
}

function GridIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}

function TagIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5a1.99 1.99 0 0 1 1.414.586l7 7a2 2 0 0 1 0 2.828l-7 7a2 2 0 0 1-2.828 0l-7-7A1.994 1.994 0 0 1 3 12V7a4 4 0 0 1 4-4z" />
    </svg>
  );
}

function PackageIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
  );
}

/* ══════════════════════════════════════════════════════════════════════════════
   PAGE COMPONENT
   ══════════════════════════════════════════════════════════════════════════════ */

export default function MenuPage() {
  /* ── Core State ── */
  const [categories, setCategories] = useState<MenuCategory[]>(initialCategories);
  const [menuItems, setMenuItems] = useState<MenuItem[]>(initialMenuItems);
  const [activeCategory, setActiveCategory] = useState<number | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [modalType, setModalType] = useState<ModalType>(null);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<MenuCategory | null>(null);
  const [activeTab, setActiveTab] = useState<"items" | "categories">("items");

  /* ── Item Form State ── */
  const [itemForm, setItemForm] = useState({
    name: "",
    nameEn: "",
    description: "",
    price: "",
    categoryId: 1,
    imageUrl: "",
    available: true,
  });
  const [itemIngredients, setItemIngredients] = useState<RecipeIngredient[]>([]);
  const [newIngredientId, setNewIngredientId] = useState<number>(1);
  const [newIngredientQty, setNewIngredientQty] = useState<string>("");

  /* ── Category Form State ── */
  const [catForm, setCatForm] = useState({ name: "", nameEn: "" });

  /* ── Derived data ── */
  const totalItems = menuItems.length;
  const activeItems = menuItems.filter((i) => i.available).length;
  const avgPrice = totalItems > 0 ? Math.round(menuItems.reduce((s, i) => s + i.price, 0) / totalItems) : 0;

  /* ── Filtered items ── */
  const filteredItems = useMemo(() => {
    let items = menuItems;
    if (activeCategory !== "all") {
      items = items.filter((i) => i.categoryId === activeCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      items = items.filter(
        (i) =>
          i.name.toLowerCase().includes(q) ||
          i.nameEn.toLowerCase().includes(q) ||
          i.description.toLowerCase().includes(q)
      );
    }
    return items;
  }, [menuItems, activeCategory, searchQuery]);

  /* ── Category helpers ── */
  const getCategoryName = (id: number) => categories.find((c) => c.id === id)?.name || "—";
  const getCategoryNameEn = (id: number) => categories.find((c) => c.id === id)?.nameEn || "";

  const recountCategories = (items: MenuItem[]) => {
    setCategories((prev) =>
      prev.map((cat) => ({
        ...cat,
        itemCount: items.filter((i) => i.categoryId === cat.id).length,
      }))
    );
  };

  /* ── Category reorder (drag simulation with buttons) ── */
  const moveCategoryUp = (index: number) => {
    if (index === 0) return;
    setCategories((prev) => {
      const updated = [...prev];
      [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
      return updated.map((c, i) => ({ ...c, sort_order: i + 1 }));
    });
  };

  const moveCategoryDown = (index: number) => {
    if (index >= categories.length - 1) return;
    setCategories((prev) => {
      const updated = [...prev];
      [updated[index], updated[index + 1]] = [updated[index + 1], updated[index]];
      return updated.map((c, i) => ({ ...c, sort_order: i + 1 }));
    });
  };

  /* ── Toggle availability ── */
  const toggleAvailability = (id: number) => {
    setMenuItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, available: !item.available } : item))
    );
  };

  /* ── Open modals ── */
  const openAddItem = () => {
    setModalType("add-item");
    setSelectedItem(null);
    setItemForm({ name: "", nameEn: "", description: "", price: "", categoryId: categories[0]?.id || 1, imageUrl: "", available: true });
    setItemIngredients([]);
  };

  const openEditItem = (item: MenuItem) => {
    setModalType("edit-item");
    setSelectedItem(item);
    setItemForm({
      name: item.name,
      nameEn: item.nameEn,
      description: item.description,
      price: item.price.toString(),
      categoryId: item.categoryId,
      imageUrl: item.imageUrl,
      available: item.available,
    });
    setItemIngredients([...item.ingredients]);
  };

  const openDeleteItem = (item: MenuItem) => {
    setModalType("delete-item");
    setSelectedItem(item);
  };

  const openAddCategory = () => {
    setModalType("add-category");
    setSelectedCategory(null);
    setCatForm({ name: "", nameEn: "" });
  };

  const openEditCategory = (cat: MenuCategory) => {
    setModalType("edit-category");
    setSelectedCategory(cat);
    setCatForm({ name: cat.name, nameEn: cat.nameEn });
  };

  const openDeleteCategory = (cat: MenuCategory) => {
    setModalType("delete-category");
    setSelectedCategory(cat);
  };

  const closeModal = () => {
    setModalType(null);
    setSelectedItem(null);
    setSelectedCategory(null);
  };

  /* ── Add Ingredient to Recipe ── */
  const addIngredientToRecipe = () => {
    const qty = parseFloat(newIngredientQty);
    if (isNaN(qty) || qty <= 0) return;
    const source = sampleIngredients.find((s) => s.id === newIngredientId);
    if (!source) return;
    if (itemIngredients.some((i) => i.id === source.id)) return;

    setItemIngredients((prev) => [
      ...prev,
      { id: source.id, name: source.name, nameEn: source.nameEn, unit: source.unit, quantityNeeded: qty, costPerUnit: source.costPerUnit },
    ]);
    setNewIngredientQty("");
  };

  const removeIngredientFromRecipe = (id: number) => {
    setItemIngredients((prev) => prev.filter((i) => i.id !== id));
  };

  /* ── Save Item ── */
  const handleSaveItem = () => {
    if (!itemForm.name || !itemForm.price) return;
    const price = parseFloat(itemForm.price);
    if (isNaN(price) || price <= 0) return;

    if (modalType === "add-item") {
      const newId = Math.max(0, ...menuItems.map((i) => i.id)) + 1;
      const newItem: MenuItem = {
        id: newId,
        name: itemForm.name,
        nameEn: itemForm.nameEn || itemForm.name,
        description: itemForm.description,
        price,
        categoryId: itemForm.categoryId,
        imageUrl: itemForm.imageUrl,
        available: itemForm.available,
        ingredients: [...itemIngredients],
      };
      const updated = [...menuItems, newItem];
      setMenuItems(updated);
      recountCategories(updated);
    } else if (modalType === "edit-item" && selectedItem) {
      const updated = menuItems.map((item) =>
        item.id === selectedItem.id
          ? {
              ...item,
              name: itemForm.name,
              nameEn: itemForm.nameEn || itemForm.name,
              description: itemForm.description,
              price,
              categoryId: itemForm.categoryId,
              imageUrl: itemForm.imageUrl,
              available: itemForm.available,
              ingredients: [...itemIngredients],
            }
          : item
      );
      setMenuItems(updated);
      recountCategories(updated);
    }
    closeModal();
  };

  /* ── Delete Item ── */
  const handleDeleteItem = () => {
    if (!selectedItem) return;
    const updated = menuItems.filter((i) => i.id !== selectedItem.id);
    setMenuItems(updated);
    recountCategories(updated);
    closeModal();
  };

  /* ── Save Category ── */
  const handleSaveCategory = () => {
    if (!catForm.name) return;

    if (modalType === "add-category") {
      const newId = Math.max(0, ...categories.map((c) => c.id)) + 1;
      setCategories((prev) => [
        ...prev,
        { id: newId, name: catForm.name, nameEn: catForm.nameEn || catForm.name, sort_order: prev.length + 1, itemCount: 0 },
      ]);
    } else if (modalType === "edit-category" && selectedCategory) {
      setCategories((prev) =>
        prev.map((cat) =>
          cat.id === selectedCategory.id
            ? { ...cat, name: catForm.name, nameEn: catForm.nameEn || catForm.name }
            : cat
        )
      );
    }
    closeModal();
  };

  /* ── Delete Category ── */
  const handleDeleteCategory = () => {
    if (!selectedCategory) return;
    setCategories((prev) => prev.filter((c) => c.id !== selectedCategory.id).map((c, i) => ({ ...c, sort_order: i + 1 })));
    closeModal();
  };

  /* ── Category badge color map ── */
  const categoryColors: Record<number, { bg: string; text: string }> = {
    1: { bg: "bg-brand-green/10", text: "text-brand-green" },
    2: { bg: "bg-blue-100", text: "text-blue-700" },
    3: { bg: "bg-brand-orange/10", text: "text-brand-orange" },
    4: { bg: "bg-purple-100", text: "text-purple-700" },
    5: { bg: "bg-brand-gold/20", text: "text-brand-charcoal" },
  };
  const getColor = (id: number) => categoryColors[id] || { bg: "bg-muted", text: "text-foreground" };

  /* ══════════════════════════════════════════════════════════════════════════
     RENDER
     ══════════════════════════════════════════════════════════════════════════ */
  return (
    <div className="space-y-6">
      {/* ── Page Header ── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Menyu</h1>
          <p className="text-sm text-muted-foreground">Menu Management — Simamia vyakula, bei, na mapishi</p>
        </div>
        <button
          onClick={openAddItem}
          className="flex items-center gap-2 rounded-xl bg-brand-orange px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-orange-light active:scale-[0.98]"
        >
          <PlusIcon className="h-4 w-4" />
          Ongeza Chakula Kipya
        </button>
      </div>

      {/* ── Stats Cards ── */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <div className="rounded-xl border-2 border-brand-green/20 bg-brand-green/5 p-4 shadow-sm">
          <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-lg bg-brand-green/10">
            <PackageIcon className="h-4 w-4 text-brand-green" />
          </div>
          <p className="text-xs font-medium text-muted-foreground">Total Items</p>
          <p className="text-sm font-bold text-foreground">Vyakula Vyote</p>
          <p className="mt-1 text-2xl font-extrabold text-brand-green">{totalItems}</p>
        </div>

        <div className="rounded-xl border-2 border-brand-green/20 bg-card p-4 shadow-sm">
          <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-lg bg-green-100">
            <svg className="h-4 w-4 text-green-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-xs font-medium text-muted-foreground">Active Items</p>
          <p className="text-sm font-bold text-foreground">Vinapatikana</p>
          <p className="mt-1 text-2xl font-extrabold text-green-600">{activeItems}</p>
        </div>

        <div className="rounded-xl border-2 border-brand-orange/20 bg-brand-orange/5 p-4 shadow-sm">
          <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-lg bg-brand-orange/10">
            <TagIcon className="h-4 w-4 text-brand-orange" />
          </div>
          <p className="text-xs font-medium text-muted-foreground">Categories</p>
          <p className="text-sm font-bold text-foreground">Makundi</p>
          <p className="mt-1 text-2xl font-extrabold text-brand-orange">{categories.length}</p>
        </div>

        <div className="rounded-xl border-2 border-border bg-card p-4 shadow-sm">
          <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
            <svg className="h-4 w-4 text-foreground" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-xs font-medium text-muted-foreground">Avg Price</p>
          <p className="text-sm font-bold text-foreground">Bei ya Wastani</p>
          <p className="mt-1 text-2xl font-extrabold text-foreground">{formatTZS(avgPrice)}</p>
        </div>
      </div>

      {/* ── Tabs: Items / Categories ── */}
      <div className="flex items-center gap-1 rounded-xl border border-border bg-card p-1">
        <button
          onClick={() => setActiveTab("items")}
          className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
            activeTab === "items"
              ? "bg-brand-green text-white shadow-sm"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
        >
          <GridIcon className="h-4 w-4" />
          <span>
            <span className="block">Vyakula</span>
            <span className="block text-[10px] opacity-70">Menu Items</span>
          </span>
        </button>
        <button
          onClick={() => setActiveTab("categories")}
          className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
            activeTab === "categories"
              ? "bg-brand-green text-white shadow-sm"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
        >
          <TagIcon className="h-4 w-4" />
          <span>
            <span className="block">Makundi</span>
            <span className="block text-[10px] opacity-70">Categories</span>
          </span>
        </button>
      </div>

      {/* ═══════════════════════ ITEMS TAB ═══════════════════════ */}
      {activeTab === "items" && (
        <>
          {/* Search + Category filter */}
          <div className="flex flex-col gap-3 sm:flex-row">
            {/* Search */}
            <div className="relative flex-1">
              <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Tafuta chakula... (Search menu items)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-border bg-card py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-brand-green focus:outline-none focus:ring-2 focus:ring-brand-green/20"
              />
            </div>

            {/* Category filter pills */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActiveCategory("all")}
                className={`rounded-lg px-3 py-2 text-xs font-medium transition ${
                  activeCategory === "all"
                    ? "bg-brand-green text-white shadow-sm"
                    : "border border-border bg-card text-foreground hover:bg-muted"
                }`}
              >
                Vyote ({totalItems})
              </button>
              {categories.map((cat) => {
                const color = getColor(cat.id);
                const count = menuItems.filter((i) => i.categoryId === cat.id).length;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`rounded-lg px-3 py-2 text-xs font-medium transition ${
                      activeCategory === cat.id
                        ? "bg-brand-green text-white shadow-sm"
                        : `border border-border bg-card text-foreground hover:${color.bg}`
                    }`}
                  >
                    {cat.name} ({count})
                  </button>
                );
              })}
            </div>
          </div>

          {/* Menu Items Grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredItems.map((item) => {
              const cogs = calcCOGS(item.ingredients);
              const margin = item.price > 0 ? Math.round(((item.price - cogs) / item.price) * 100) : 0;
              const color = getColor(item.categoryId);

              return (
                <div
                  key={item.id}
                  className={`group relative overflow-hidden rounded-xl border-2 bg-card shadow-sm transition hover:shadow-lg ${
                    item.available ? "border-border" : "border-red-200 opacity-70"
                  }`}
                >
                  {/* Image placeholder / header band */}
                  <div className={`flex h-28 items-center justify-center ${item.available ? "bg-gradient-to-br from-brand-green/5 to-brand-orange/5" : "bg-gray-100"}`}>
                    <span className="text-5xl">{
                      item.categoryId === 1 ? "🍛" :
                      item.categoryId === 2 ? "🥤" :
                      item.categoryId === 3 ? "🍢" :
                      item.categoryId === 4 ? "🍲" :
                      "🍩"
                    }</span>
                  </div>

                  {/* Availability badge */}
                  <div className="absolute right-2 top-2">
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${item.available ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                      {item.available ? "Inapatikana" : "Haipo"}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    {/* Category badge */}
                    <span className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold ${color.bg} ${color.text}`}>
                      {getCategoryName(item.categoryId)}
                    </span>

                    {/* Name */}
                    <h3 className="mt-2 text-sm font-bold text-foreground leading-tight">{item.name}</h3>
                    <p className="text-[11px] text-muted-foreground">{item.nameEn}</p>

                    {/* Price + COGS */}
                    <div className="mt-3 flex items-end justify-between">
                      <div>
                        <p className="text-lg font-extrabold text-brand-green">{formatTZS(item.price)}</p>
                        {item.ingredients.length > 0 && (
                          <p className="text-[10px] text-muted-foreground">
                            COGS: {formatTZS(cogs)} &middot; Margin: {margin}%
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Actions row */}
                    <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
                      {/* Toggle */}
                      <button
                        onClick={() => toggleAvailability(item.id)}
                        className="flex items-center gap-2"
                        title={item.available ? "Zima" : "Washa"}
                      >
                        <div className={`relative h-5 w-9 rounded-full transition ${item.available ? "bg-brand-green" : "bg-gray-300"}`}>
                          <div className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${item.available ? "left-[18px]" : "left-0.5"}`} />
                        </div>
                        <span className="text-[10px] text-muted-foreground">{item.available ? "ON" : "OFF"}</span>
                      </button>

                      {/* Edit / Delete */}
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => openEditItem(item)}
                          className="rounded-lg p-1.5 text-blue-600 transition hover:bg-blue-50"
                          title="Hariri"
                        >
                          <PencilIcon />
                        </button>
                        <button
                          onClick={() => openDeleteItem(item)}
                          className="rounded-lg p-1.5 text-red-500 transition hover:bg-red-50"
                          title="Futa"
                        >
                          <TrashIcon />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Empty state */}
          {filteredItems.length === 0 && (
            <div className="flex flex-col items-center justify-center rounded-xl bg-card py-16 shadow-sm">
              <SearchIcon className="mb-3 h-10 w-10 text-muted-foreground/30" />
              <p className="text-sm font-medium text-muted-foreground">Hakuna vyakula vilivyopatikana</p>
              <p className="text-xs text-muted-foreground">No menu items found matching your search</p>
            </div>
          )}
        </>
      )}

      {/* ═══════════════════════ CATEGORIES TAB ═══════════════════════ */}
      {activeTab === "categories" && (
        <div className="space-y-4">
          {/* Add category button */}
          <div className="flex justify-end">
            <button
              onClick={openAddCategory}
              className="flex items-center gap-2 rounded-xl bg-brand-green px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-green-dark active:scale-[0.98]"
            >
              <PlusIcon className="h-4 w-4" />
              Ongeza Kundi Jipya
            </button>
          </div>

          {/* Categories list */}
          <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
            <div className="border-b border-border bg-muted/50 px-5 py-3">
              <h3 className="text-sm font-bold text-foreground">
                Makundi ya Menyu
                <span className="ml-2 text-xs font-normal text-muted-foreground">Menu Categories — Sogeza juu/chini kupanga upya</span>
              </h3>
            </div>

            <div className="divide-y divide-border">
              {categories.map((cat, index) => {
                const color = getColor(cat.id);
                return (
                  <div
                    key={cat.id}
                    className="flex items-center gap-4 px-5 py-4 transition hover:bg-muted/30"
                  >
                    {/* Sort order & reorder buttons */}
                    <div className="flex flex-col items-center gap-0.5">
                      <button
                        onClick={() => moveCategoryUp(index)}
                        disabled={index === 0}
                        className="rounded p-0.5 text-muted-foreground transition hover:bg-muted hover:text-foreground disabled:opacity-20"
                      >
                        <ChevronUpIcon className="h-3.5 w-3.5" />
                      </button>
                      <span className="flex h-6 w-6 items-center justify-center rounded-md bg-muted text-[10px] font-bold text-muted-foreground">
                        {cat.sort_order}
                      </span>
                      <button
                        onClick={() => moveCategoryDown(index)}
                        disabled={index === categories.length - 1}
                        className="rounded p-0.5 text-muted-foreground transition hover:bg-muted hover:text-foreground disabled:opacity-20"
                      >
                        <ChevronDownIcon className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    {/* Category info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold ${color.bg} ${color.text}`}>
                          {cat.name}
                        </span>
                      </div>
                      <p className="mt-0.5 text-xs text-muted-foreground">{cat.nameEn}</p>
                    </div>

                    {/* Item count */}
                    <div className="text-center">
                      <p className="text-lg font-bold text-foreground">{cat.itemCount}</p>
                      <p className="text-[10px] text-muted-foreground">vyakula</p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openEditCategory(cat)}
                        className="rounded-lg p-2 text-blue-600 transition hover:bg-blue-50"
                        title="Hariri kundi"
                      >
                        <PencilIcon />
                      </button>
                      <button
                        onClick={() => openDeleteCategory(cat)}
                        className="rounded-lg p-2 text-red-500 transition hover:bg-red-50"
                        title="Futa kundi"
                        disabled={cat.itemCount > 0}
                      >
                        <TrashIcon className={cat.itemCount > 0 ? "opacity-30" : ""} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {categories.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <TagIcon className="mb-3 h-8 w-8 text-muted-foreground/30" />
                <p className="text-sm font-medium text-muted-foreground">Hakuna makundi</p>
                <p className="text-xs text-muted-foreground">No categories yet</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ═══════════════════════ MODALS ═══════════════════════ */}
      {modalType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={closeModal} />

          {/* Modal content */}
          <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-card shadow-2xl">

            {/* ── ADD / EDIT ITEM MODAL ── */}
            {(modalType === "add-item" || modalType === "edit-item") && (
              <>
                {/* Header */}
                <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-card px-5 py-3 rounded-t-2xl">
                  <div>
                    <h2 className="text-base font-bold text-foreground">
                      {modalType === "add-item" ? "Ongeza Chakula Kipya" : "Hariri Chakula"}
                    </h2>
                    <p className="text-[11px] text-muted-foreground">
                      {modalType === "add-item" ? "Add New Menu Item" : "Edit Menu Item"}
                    </p>
                  </div>
                  <button onClick={closeModal} className="rounded-lg p-1 text-muted-foreground transition hover:bg-muted">
                    <XIcon />
                  </button>
                </div>

                <div className="space-y-4 p-5">
                  {/* Name */}
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-foreground">
                      Jina la Chakula <span className="font-normal text-muted-foreground">(Item Name)</span>
                    </label>
                    <input
                      type="text"
                      value={itemForm.name}
                      onChange={(e) => setItemForm({ ...itemForm, name: e.target.value })}
                      className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground focus:border-brand-green focus:outline-none focus:ring-2 focus:ring-brand-green/20"
                      placeholder="Mfano: Pilau ya Nyama"
                    />
                  </div>

                  {/* English name */}
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-foreground">
                      Jina kwa Kiingereza <span className="font-normal text-muted-foreground">(English Name)</span>
                    </label>
                    <input
                      type="text"
                      value={itemForm.nameEn}
                      onChange={(e) => setItemForm({ ...itemForm, nameEn: e.target.value })}
                      className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground focus:border-brand-green focus:outline-none focus:ring-2 focus:ring-brand-green/20"
                      placeholder="e.g. Spiced Rice with Meat"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-foreground">
                      Maelezo <span className="font-normal text-muted-foreground">(Description)</span>
                    </label>
                    <textarea
                      value={itemForm.description}
                      onChange={(e) => setItemForm({ ...itemForm, description: e.target.value })}
                      rows={2}
                      className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground focus:border-brand-green focus:outline-none focus:ring-2 focus:ring-brand-green/20 resize-none"
                      placeholder="Eleza chakula hiki..."
                    />
                  </div>

                  {/* Price + Category row */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-foreground">
                        Bei (TZS) <span className="font-normal text-muted-foreground">(Price)</span>
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={itemForm.price}
                        onChange={(e) => setItemForm({ ...itemForm, price: e.target.value })}
                        className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground focus:border-brand-green focus:outline-none focus:ring-2 focus:ring-brand-green/20"
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-foreground">
                        Kundi <span className="font-normal text-muted-foreground">(Category)</span>
                      </label>
                      <select
                        value={itemForm.categoryId}
                        onChange={(e) => setItemForm({ ...itemForm, categoryId: parseInt(e.target.value) })}
                        className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground focus:border-brand-green focus:outline-none focus:ring-2 focus:ring-brand-green/20"
                      >
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.name} ({cat.nameEn})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Image URL */}
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-foreground">
                      Picha URL <span className="font-normal text-muted-foreground">(Image URL - optional)</span>
                    </label>
                    <input
                      type="text"
                      value={itemForm.imageUrl}
                      onChange={(e) => setItemForm({ ...itemForm, imageUrl: e.target.value })}
                      className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground focus:border-brand-green focus:outline-none focus:ring-2 focus:ring-brand-green/20"
                      placeholder="https://..."
                    />
                  </div>

                  {/* Availability toggle */}
                  <div className="flex items-center justify-between rounded-lg border border-border p-3">
                    <div>
                      <p className="text-sm font-semibold text-foreground">Inapatikana</p>
                      <p className="text-[10px] text-muted-foreground">Available for ordering</p>
                    </div>
                    <button
                      onClick={() => setItemForm({ ...itemForm, available: !itemForm.available })}
                      className="flex items-center gap-2"
                    >
                      <div className={`relative h-6 w-11 rounded-full transition ${itemForm.available ? "bg-brand-green" : "bg-gray-300"}`}>
                        <div className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${itemForm.available ? "left-[22px]" : "left-0.5"}`} />
                      </div>
                    </button>
                  </div>

                  {/* ── Recipe / Ingredients Section ── */}
                  <div className="rounded-xl border-2 border-dashed border-brand-orange/30 bg-brand-orange/5 p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <PackageIcon className="h-4 w-4 text-brand-orange" />
                      <h3 className="text-sm font-bold text-foreground">
                        Viungo vya Mapishi
                        <span className="ml-1 text-xs font-normal text-muted-foreground">(Recipe Ingredients)</span>
                      </h3>
                    </div>

                    {/* Existing ingredients */}
                    {itemIngredients.length > 0 && (
                      <div className="mb-3 space-y-2">
                        {itemIngredients.map((ing) => (
                          <div key={ing.id} className="flex items-center gap-2 rounded-lg bg-card p-2.5 shadow-sm">
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium text-foreground truncate">{ing.name}</p>
                              <p className="text-[10px] text-muted-foreground">
                                {ing.quantityNeeded} {ing.unit} x {formatTZS(ing.costPerUnit)} = {formatTZS(ing.quantityNeeded * ing.costPerUnit)}
                              </p>
                            </div>
                            <button
                              onClick={() => removeIngredientFromRecipe(ing.id)}
                              className="shrink-0 rounded p-1 text-red-400 transition hover:bg-red-50 hover:text-red-600"
                            >
                              <XIcon className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        ))}

                        {/* COGS summary */}
                        <div className="rounded-lg bg-brand-gold/10 p-3 mt-2">
                          <div className="flex items-center justify-between">
                            <p className="text-xs font-medium text-muted-foreground">
                              Gharama ya Mapishi (COGS)
                              <span className="block text-[10px]">Estimated cost per serving</span>
                            </p>
                            <div className="text-right">
                              <p className="text-sm font-bold text-brand-charcoal">{formatTZS(calcCOGS(itemIngredients))}</p>
                              {itemForm.price && parseFloat(itemForm.price) > 0 && (
                                <p className="text-[10px] text-muted-foreground">
                                  Margin: {Math.round(((parseFloat(itemForm.price) - calcCOGS(itemIngredients)) / parseFloat(itemForm.price)) * 100)}%
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Add ingredient form */}
                    <div className="flex items-end gap-2">
                      <div className="flex-1">
                        <label className="mb-1 block text-[10px] font-semibold text-muted-foreground">Chagua Kiungo (Select Ingredient)</label>
                        <select
                          value={newIngredientId}
                          onChange={(e) => setNewIngredientId(parseInt(e.target.value))}
                          className="w-full rounded-lg border border-border bg-card px-2 py-1.5 text-xs text-foreground focus:border-brand-green focus:outline-none"
                        >
                          {sampleIngredients
                            .filter((s) => !itemIngredients.some((i) => i.id === s.id))
                            .map((s) => (
                              <option key={s.id} value={s.id}>
                                {s.name} ({s.nameEn}) — {formatTZS(s.costPerUnit)}/{s.unit}
                              </option>
                            ))}
                        </select>
                      </div>
                      <div className="w-20">
                        <label className="mb-1 block text-[10px] font-semibold text-muted-foreground">Kiasi (Qty)</label>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={newIngredientQty}
                          onChange={(e) => setNewIngredientQty(e.target.value)}
                          className="w-full rounded-lg border border-border bg-card px-2 py-1.5 text-xs text-foreground focus:border-brand-green focus:outline-none"
                          placeholder="0"
                        />
                      </div>
                      <button
                        onClick={addIngredientToRecipe}
                        className="rounded-lg bg-brand-orange px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-brand-orange-light active:scale-[0.97]"
                      >
                        <PlusIcon className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Submit button */}
                  <button
                    onClick={handleSaveItem}
                    disabled={!itemForm.name || !itemForm.price}
                    className="w-full rounded-xl bg-brand-green py-3 text-sm font-semibold text-white transition hover:bg-brand-green-dark active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {modalType === "add-item" ? "Ongeza Chakula" : "Hifadhi Mabadiliko"}
                    <span className="ml-2 text-xs font-normal opacity-70">
                      {modalType === "add-item" ? "(Add Item)" : "(Save Changes)"}
                    </span>
                  </button>
                </div>
              </>
            )}

            {/* ── DELETE ITEM MODAL ── */}
            {modalType === "delete-item" && selectedItem && (
              <>
                <div className="flex items-center justify-between border-b border-border px-5 py-3">
                  <h2 className="text-base font-bold text-foreground">Futa Chakula</h2>
                  <button onClick={closeModal} className="rounded-lg p-1 text-muted-foreground transition hover:bg-muted">
                    <XIcon />
                  </button>
                </div>
                <div className="p-5 space-y-4">
                  <div className="rounded-lg border-2 border-red-200 bg-red-50 p-5 text-center">
                    <TrashIcon className="mx-auto mb-2 h-10 w-10 text-red-400" />
                    <p className="text-sm font-semibold text-red-700">
                      Una uhakika unataka kufuta &quot;{selectedItem.name}&quot;?
                    </p>
                    <p className="text-xs text-red-500">
                      Are you sure you want to delete this menu item?
                    </p>
                    <p className="mt-2 text-xs text-muted-foreground">
                      Bei: {formatTZS(selectedItem.price)} &middot; {getCategoryNameEn(selectedItem.categoryId)}
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={closeModal}
                      className="flex-1 rounded-xl border border-border py-2.5 text-sm font-semibold text-foreground transition hover:bg-muted active:scale-[0.98]"
                    >
                      Ghairi
                      <span className="ml-1 text-xs font-normal text-muted-foreground">(Cancel)</span>
                    </button>
                    <button
                      onClick={handleDeleteItem}
                      className="flex-1 rounded-xl bg-red-600 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 active:scale-[0.98]"
                    >
                      Futa
                      <span className="ml-1 text-xs font-normal opacity-70">(Delete)</span>
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* ── ADD / EDIT CATEGORY MODAL ── */}
            {(modalType === "add-category" || modalType === "edit-category") && (
              <>
                <div className="flex items-center justify-between border-b border-border px-5 py-3">
                  <div>
                    <h2 className="text-base font-bold text-foreground">
                      {modalType === "add-category" ? "Ongeza Kundi Jipya" : "Hariri Kundi"}
                    </h2>
                    <p className="text-[11px] text-muted-foreground">
                      {modalType === "add-category" ? "Add New Category" : "Edit Category"}
                    </p>
                  </div>
                  <button onClick={closeModal} className="rounded-lg p-1 text-muted-foreground transition hover:bg-muted">
                    <XIcon />
                  </button>
                </div>
                <div className="p-5 space-y-4">
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-foreground">
                      Jina la Kundi <span className="font-normal text-muted-foreground">(Category Name in Swahili)</span>
                    </label>
                    <input
                      type="text"
                      value={catForm.name}
                      onChange={(e) => setCatForm({ ...catForm, name: e.target.value })}
                      className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground focus:border-brand-green focus:outline-none focus:ring-2 focus:ring-brand-green/20"
                      placeholder="Mfano: Vyakula Vikuu"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-foreground">
                      Jina kwa Kiingereza <span className="font-normal text-muted-foreground">(English Name)</span>
                    </label>
                    <input
                      type="text"
                      value={catForm.nameEn}
                      onChange={(e) => setCatForm({ ...catForm, nameEn: e.target.value })}
                      className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground focus:border-brand-green focus:outline-none focus:ring-2 focus:ring-brand-green/20"
                      placeholder="e.g. Main Dishes"
                    />
                  </div>
                  <button
                    onClick={handleSaveCategory}
                    disabled={!catForm.name}
                    className="w-full rounded-xl bg-brand-green py-2.5 text-sm font-semibold text-white transition hover:bg-brand-green-dark active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {modalType === "add-category" ? "Ongeza Kundi" : "Hifadhi Mabadiliko"}
                    <span className="ml-2 text-xs font-normal opacity-70">
                      {modalType === "add-category" ? "(Add Category)" : "(Save Changes)"}
                    </span>
                  </button>
                </div>
              </>
            )}

            {/* ── DELETE CATEGORY MODAL ── */}
            {modalType === "delete-category" && selectedCategory && (
              <>
                <div className="flex items-center justify-between border-b border-border px-5 py-3">
                  <h2 className="text-base font-bold text-foreground">Futa Kundi</h2>
                  <button onClick={closeModal} className="rounded-lg p-1 text-muted-foreground transition hover:bg-muted">
                    <XIcon />
                  </button>
                </div>
                <div className="p-5 space-y-4">
                  {selectedCategory.itemCount > 0 ? (
                    <div className="rounded-lg border-2 border-amber-200 bg-amber-50 p-5 text-center">
                      <svg className="mx-auto mb-2 h-10 w-10 text-amber-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                      <p className="text-sm font-semibold text-amber-700">
                        Kundi hili lina vyakula {selectedCategory.itemCount}
                      </p>
                      <p className="text-xs text-amber-600">
                        This category has {selectedCategory.itemCount} items. Remove all items first before deleting.
                      </p>
                    </div>
                  ) : (
                    <div className="rounded-lg border-2 border-red-200 bg-red-50 p-5 text-center">
                      <TrashIcon className="mx-auto mb-2 h-10 w-10 text-red-400" />
                      <p className="text-sm font-semibold text-red-700">
                        Futa kundi &quot;{selectedCategory.name}&quot;?
                      </p>
                      <p className="text-xs text-red-500">
                        Delete category &quot;{selectedCategory.nameEn}&quot;?
                      </p>
                    </div>
                  )}

                  <div className="flex gap-3">
                    <button
                      onClick={closeModal}
                      className="flex-1 rounded-xl border border-border py-2.5 text-sm font-semibold text-foreground transition hover:bg-muted active:scale-[0.98]"
                    >
                      Ghairi
                    </button>
                    {selectedCategory.itemCount === 0 && (
                      <button
                        onClick={handleDeleteCategory}
                        className="flex-1 rounded-xl bg-red-600 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 active:scale-[0.98]"
                      >
                        Futa Kundi
                      </button>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
