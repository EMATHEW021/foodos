"use client";

import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Habari, Mama Salma 👋</h1>
        <p className="text-sm text-muted-foreground">Leo ni Jumamosi, Aprili 19, 2026</p>
      </div>

      {/* 3 Mode Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Link
          href="/pos"
          className="group rounded-2xl border-2 border-brand-green bg-card p-6 transition hover:border-brand-green hover:shadow-lg"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-brand-green/10 text-3xl transition group-hover:bg-brand-green/20">
            🧾
          </div>
          <h3 className="mt-4 text-lg font-bold text-foreground">Hali ya Karani</h3>
          <p className="text-xs text-muted-foreground">Cashier Mode</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Pata oda, pokea malipo ya M-Pesa, Tigo, Cash
          </p>
          <div className="mt-3 flex items-center gap-1 text-xs font-medium text-brand-green">
            Fungua POS →
          </div>
        </Link>

        <Link
          href="/stock"
          className="group rounded-2xl border-2 border-brand-orange bg-card p-6 transition hover:border-brand-orange hover:shadow-lg"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-brand-orange/10 text-3xl transition group-hover:bg-brand-orange/20">
            📦
          </div>
          <h3 className="mt-4 text-lg font-bold text-foreground">Hali ya Stoku</h3>
          <p className="text-xs text-muted-foreground">Stock Manager Mode</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Ingiza bidhaa, toa, hariri — yote chini ya idhini
          </p>
          <div className="mt-3 flex items-center gap-1 text-xs font-medium text-brand-orange">
            Fungua Stoku →
          </div>
        </Link>

        <Link
          href="/reports"
          className="group rounded-2xl border-2 border-brand-gold bg-card p-6 transition hover:border-brand-gold hover:shadow-lg"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-brand-gold/10 text-3xl transition group-hover:bg-brand-gold/20">
            📊
          </div>
          <h3 className="mt-4 text-lg font-bold text-foreground">Hali ya Mkurugenzi</h3>
          <p className="text-xs text-muted-foreground">Director Mode</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Ripoti, faida, idhini, angalia kila kitu
          </p>
          <div className="mt-3 flex items-center gap-1 text-xs font-medium text-brand-gold">
            Fungua Ripoti →
          </div>
        </Link>
      </div>

      {/* Today's Summary */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl bg-card p-5 shadow-sm">
          <p className="text-xs font-medium text-muted-foreground">Mapato ya Leo</p>
          <p className="mt-1 text-2xl font-bold text-brand-green">TZS 450,000</p>
          <p className="mt-1 text-xs text-green-600">↑ 12% kuliko jana</p>
        </div>
        <div className="rounded-xl bg-card p-5 shadow-sm">
          <p className="text-xs font-medium text-muted-foreground">Gharama Bidhaa (COGS)</p>
          <p className="mt-1 text-2xl font-bold text-brand-orange">TZS 180,000</p>
          <p className="mt-1 text-xs text-muted-foreground">40% ya mapato</p>
        </div>
        <div className="rounded-xl bg-card p-5 shadow-sm">
          <p className="text-xs font-medium text-muted-foreground">Matumizi Mengine</p>
          <p className="mt-1 text-2xl font-bold text-foreground">TZS 35,000</p>
          <p className="mt-1 text-xs text-muted-foreground">Gesi, Ufungaji, Usafiri</p>
        </div>
        <div className="rounded-xl bg-card p-5 shadow-sm">
          <p className="text-xs font-medium text-muted-foreground">Faida Halisi</p>
          <p className="mt-1 text-2xl font-bold text-brand-green">TZS 235,000</p>
          <p className="mt-1 text-xs text-green-600">52% margin</p>
        </div>
      </div>

      {/* Pending Approvals + Low Stock */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Pending Approvals */}
        <div className="rounded-xl bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-foreground">Idhini Zinazosubiri</h3>
            <span className="rounded-full bg-brand-orange/10 px-2 py-0.5 text-xs font-bold text-brand-orange">
              3
            </span>
          </div>
          <div className="mt-4 space-y-3">
            {[
              { action: "Stoku Imeingia", detail: "Mchele 20kg - TZS 40,000", by: "Hassan", time: "Saa 2 zilizopita" },
              { action: "Stoku Imetolewa", detail: "Nyama 3kg - Imeharibika", by: "Hassan", time: "Saa 4 zilizopita" },
              { action: "Gharama", detail: "Gesi - TZS 15,000", by: "Hassan", time: "Asubuhi" },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between rounded-lg border border-border p-3">
                <div>
                  <p className="text-sm font-medium text-foreground">{item.action}</p>
                  <p className="text-xs text-muted-foreground">{item.detail}</p>
                  <p className="text-[10px] text-muted-foreground">{item.by} &middot; {item.time}</p>
                </div>
                <div className="flex gap-2">
                  <button className="rounded-lg bg-brand-green px-3 py-1.5 text-xs font-medium text-white transition hover:bg-brand-green-dark">
                    Kubali
                  </button>
                  <button className="rounded-lg bg-red-100 px-3 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-200">
                    Kataa
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="rounded-xl bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-foreground">Stoku Chini</h3>
            <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-bold text-red-600">
              4
            </span>
          </div>
          <div className="mt-4 space-y-3">
            {[
              { name: "Mchele (Rice)", current: "3 kg", min: "10 kg", pct: 30 },
              { name: "Nyama (Meat)", current: "2 kg", min: "8 kg", pct: 25 },
              { name: "Mafuta (Oil)", current: "1 lita", min: "5 lita", pct: 20 },
              { name: "Vitunguu (Onions)", current: "1.5 kg", min: "5 kg", pct: 30 },
            ].map((item, i) => (
              <div key={i} className="rounded-lg border border-border p-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-foreground">{item.name}</p>
                  <p className="text-xs font-bold text-red-600">{item.current}</p>
                </div>
                <div className="mt-2 h-1.5 rounded-full bg-gray-100">
                  <div
                    className="h-full rounded-full bg-red-500"
                    style={{ width: `${item.pct}%` }}
                  />
                </div>
                <p className="mt-1 text-[10px] text-muted-foreground">Kiwango cha chini: {item.min}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Weekly Sales Chart */}
      <div className="rounded-xl bg-card p-5 shadow-sm">
        <h3 className="text-sm font-bold text-foreground">Mauzo ya Wiki Hii</h3>
        <div className="mt-4 flex items-end gap-3" style={{ height: "180px" }}>
          {[
            { day: "Jumatatu", amount: 320, pct: 71 },
            { day: "Jumanne", amount: 280, pct: 62 },
            { day: "Jumatano", amount: 410, pct: 91 },
            { day: "Alhamisi", amount: 350, pct: 78 },
            { day: "Ijumaa", amount: 450, pct: 100 },
            { day: "Jumamosi", amount: 380, pct: 84 },
            { day: "Jumapili", amount: 290, pct: 64 },
          ].map((d, i) => (
            <div key={i} className="flex flex-1 flex-col items-center gap-2">
              <p className="text-xs font-medium text-foreground">TZS {d.amount}K</p>
              <div
                className="w-full rounded-t-lg transition-all"
                style={{
                  height: `${d.pct * 1.2}px`,
                  backgroundColor: i === 4 ? '#E8712B' : '#2D7A3A',
                  opacity: 0.7 + (i * 0.04),
                }}
              />
              <p className="text-[10px] text-muted-foreground">{d.day.slice(0, 3)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Breakdown + Recent Orders */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Payment Methods */}
        <div className="rounded-xl bg-card p-5 shadow-sm">
          <h3 className="text-sm font-bold text-foreground">Njia za Malipo — Leo</h3>
          <div className="mt-4 space-y-3">
            {[
              { method: "M-Pesa", amount: "TZS 270,000", pct: 60, color: "#2D7A3A" },
              { method: "Taslimu (Cash)", amount: "TZS 135,000", pct: 30, color: "#E8712B" },
              { method: "Tigo Pesa", amount: "TZS 31,500", pct: 7, color: "#E9C46A" },
              { method: "Airtel Money", amount: "TZS 13,500", pct: 3, color: "#3A9D4A" },
            ].map((p, i) => (
              <div key={i}>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-foreground">{p.method}</span>
                  <span className="font-medium text-foreground">{p.amount}</span>
                </div>
                <div className="mt-1 h-2 rounded-full bg-gray-100">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${p.pct}%`, backgroundColor: p.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="rounded-xl bg-card p-5 shadow-sm">
          <h3 className="text-sm font-bold text-foreground">Oda za Hivi Karibuni</h3>
          <div className="mt-4 space-y-2">
            {[
              { id: "#047", items: "Pilau x2, Juice x1", total: "TZS 12,000", method: "M-Pesa", time: "12:45" },
              { id: "#046", items: "Chips Kuku x1, Soda x2", total: "TZS 9,500", method: "Cash", time: "12:30" },
              { id: "#045", items: "Wali Maharage x3", total: "TZS 7,500", method: "Tigo", time: "12:15" },
              { id: "#044", items: "Biriani x1, Juice x1", total: "TZS 8,000", method: "M-Pesa", time: "11:58" },
              { id: "#043", items: "Ugali Nyama x2", total: "TZS 14,000", method: "Cash", time: "11:40" },
            ].map((o, i) => (
              <div key={i} className="flex items-center justify-between rounded-lg border border-border p-3">
                <div>
                  <p className="text-sm font-medium text-foreground">{o.id} — {o.items}</p>
                  <p className="text-[10px] text-muted-foreground">{o.method} &middot; {o.time}</p>
                </div>
                <p className="text-sm font-bold text-foreground">{o.total}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
