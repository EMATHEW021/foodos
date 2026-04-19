"use client";

import { useState } from "react";

const expenseCategories = ["Gesi", "Ufungaji", "Usafiri", "Umeme", "Maji", "Kodi", "Vifaa", "Nyingine"];

const mockExpenses = [
  { id: 1, category: "Gesi", amount: 15000, description: "Mitungi 2 ya gesi", date: "2026-04-19", status: "approved", by: "Hassan" },
  { id: 2, category: "Ufungaji", amount: 10000, description: "Chupa za plastiki na vikombe", date: "2026-04-19", status: "pending", by: "Hassan" },
  { id: 3, category: "Usafiri", amount: 8000, description: "Pikipiki kupeleka oda", date: "2026-04-18", status: "approved", by: "Amina" },
  { id: 4, category: "Umeme", amount: 50000, description: "Bili ya umeme mwezi huu", date: "2026-04-17", status: "approved", by: "Mama Salma" },
  { id: 5, category: "Vifaa", amount: 25000, description: "Sufuria mpya na miko", date: "2026-04-16", status: "rejected", by: "Hassan" },
];

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState(mockExpenses);
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState("all");
  const [form, setForm] = useState({ category: "Gesi", amount: "", description: "", date: new Date().toISOString().slice(0, 10) });

  const filtered = filter === "all" ? expenses : expenses.filter((e) => e.status === filter);
  const totalApproved = expenses.filter((e) => e.status === "approved").reduce((s, e) => s + e.amount, 0);
  const totalPending = expenses.filter((e) => e.status === "pending").reduce((s, e) => s + e.amount, 0);

  function handleAdd() {
    if (!form.amount || !form.description) return;
    setExpenses([
      { id: Date.now(), category: form.category, amount: Number(form.amount), description: form.description, date: form.date, status: "pending", by: "Hassan" },
      ...expenses,
    ]);
    setForm({ category: "Gesi", amount: "", description: "", date: new Date().toISOString().slice(0, 10) });
    setShowModal(false);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Gharama</h1>
          <p className="text-xs text-muted-foreground">Expenses — Fuatilia matumizi yako</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="rounded-xl bg-brand-green px-4 py-2.5 text-sm font-medium text-white transition hover:bg-brand-green-dark"
        >
          + Ongeza Gharama
        </button>
      </div>

      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-3">
        <button onClick={() => setFilter("all")} className={`rounded-xl p-5 text-left shadow-sm transition ${filter === "all" ? "ring-2 ring-brand-green" : ""} bg-card`}>
          <p className="text-xs text-muted-foreground">Gharama Zote</p>
          <p className="mt-1 text-2xl font-bold text-foreground">TZS {(totalApproved + totalPending).toLocaleString()}</p>
          <p className="text-xs text-muted-foreground">{expenses.length} entries</p>
        </button>
        <button onClick={() => setFilter("approved")} className={`rounded-xl p-5 text-left shadow-sm transition ${filter === "approved" ? "ring-2 ring-brand-green" : ""} bg-card`}>
          <p className="text-xs text-muted-foreground">Zimekubaliwa</p>
          <p className="mt-1 text-2xl font-bold text-brand-green">TZS {totalApproved.toLocaleString()}</p>
          <p className="text-xs text-green-600">{expenses.filter((e) => e.status === "approved").length} approved</p>
        </button>
        <button onClick={() => setFilter("pending")} className={`rounded-xl p-5 text-left shadow-sm transition ${filter === "pending" ? "ring-2 ring-brand-orange" : ""} bg-card`}>
          <p className="text-xs text-muted-foreground">Zinasubiri Idhini</p>
          <p className="mt-1 text-2xl font-bold text-brand-orange">TZS {totalPending.toLocaleString()}</p>
          <p className="text-xs text-orange-600">{expenses.filter((e) => e.status === "pending").length} pending</p>
        </button>
      </div>

      {/* Expense List */}
      <div className="rounded-xl bg-card p-5 shadow-sm">
        <div className="space-y-3">
          {filtered.map((e) => (
            <div key={e.id} className="flex items-center justify-between rounded-lg border border-border p-4">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-orange/10 text-lg">
                  {e.category === "Gesi" ? "🔥" : e.category === "Ufungaji" ? "📦" : e.category === "Usafiri" ? "🚗" : e.category === "Umeme" ? "⚡" : e.category === "Vifaa" ? "🔧" : "💰"}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{e.category}</p>
                  <p className="text-xs text-muted-foreground">{e.description}</p>
                  <p className="text-[10px] text-muted-foreground">{e.by} &middot; {e.date}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-foreground">TZS {e.amount.toLocaleString()}</p>
                <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-medium ${
                  e.status === "approved" ? "bg-green-100 text-green-700" :
                  e.status === "pending" ? "bg-orange-100 text-orange-700" :
                  "bg-red-100 text-red-700"
                }`}>
                  {e.status === "approved" ? "Imekubaliwa" : e.status === "pending" ? "Inasubiri" : "Imekataliwa"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Expense Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-card p-6 shadow-xl">
            <div className="mb-4 rounded-lg bg-brand-orange/10 p-2 text-center text-xs font-medium text-brand-orange">
              Idhini inahitajika — Approval required
            </div>
            <h3 className="text-lg font-bold text-foreground">Ongeza Gharama Mpya</h3>
            <p className="text-xs text-muted-foreground">Add New Expense</p>

            <div className="mt-4 space-y-3">
              <div>
                <label className="text-xs font-medium text-muted-foreground">Aina (Category)</label>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground">
                  {expenseCategories.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground">Kiasi (Amount TZS)</label>
                <input type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} placeholder="15000" className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground" />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground">Maelezo (Description)</label>
                <input type="text" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Mitungi 2 ya gesi" className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground" />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground">Tarehe (Date)</label>
                <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground" />
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button onClick={() => setShowModal(false)} className="flex-1 rounded-xl border border-border py-2.5 text-sm font-medium text-foreground transition hover:bg-muted">
                Ghairi
              </button>
              <button onClick={handleAdd} className="flex-1 rounded-xl bg-brand-green py-2.5 text-sm font-medium text-white transition hover:bg-brand-green-dark">
                Wasilisha kwa Idhini
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
