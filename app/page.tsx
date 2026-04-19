import Image from "next/image";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-brand-cream">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-4 md:px-12">
        <div className="flex items-center gap-2">
          <Image src="/images/logo.png" alt="FoodOS" width={40} height={40} />
          <span className="text-xl font-bold text-brand-charcoal">
            Food<span className="text-brand-orange">OS</span>
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="rounded-lg px-5 py-2 text-sm font-medium text-brand-charcoal transition hover:bg-white"
          >
            Ingia
          </Link>
          <Link
            href="/register"
            className="rounded-lg bg-brand-green px-5 py-2 text-sm font-medium text-white transition hover:bg-brand-green-dark"
          >
            Jisajili Bure
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex flex-col items-center gap-12 px-6 py-16 md:flex-row md:justify-between md:px-12 lg:px-24 lg:py-24">
        {/* Left: Text */}
        <div className="max-w-xl text-center md:text-left">
          <div className="inline-block rounded-full bg-brand-green/10 px-4 py-1 text-xs font-semibold text-brand-green">
            Kwa Migahawa ya Tanzania
          </div>
          <h1 className="mt-4 text-4xl font-bold leading-tight text-brand-charcoal md:text-5xl lg:text-6xl">
            Simamia Mgahawa Wako
            <span className="text-brand-green"> Kutoka Simu</span>
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            POS, Stoku, Gharama, na Faida yako halisi — yote katika mfumo mmoja rahisi.
            Hakuna karatasi, hakuna Excel, hakuna kubahatisha.
          </p>
          <p className="mt-2 text-sm text-gray-400">
            Manage your restaurant from your phone. Sales, stock, expenses, and real profit — all in one system.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center md:justify-start">
            <Link
              href="/register"
              className="rounded-xl bg-brand-green px-8 py-3.5 text-center text-base font-semibold text-white shadow-lg transition hover:bg-brand-green-dark hover:shadow-xl"
            >
              Anza Bure — Siku 30 (Start Free)
            </Link>
            <Link
              href="#features"
              className="rounded-xl border-2 border-brand-green px-8 py-3.5 text-center text-base font-semibold text-brand-green transition hover:bg-brand-green/5"
            >
              Angalia Zaidi
            </Link>
          </div>
          <p className="mt-4 text-xs text-gray-400">
            Hakuna kadi ya benki &middot; Jisajili kwa namba ya simu &middot; M-Pesa, Tigo, Airtel, Halo
          </p>
        </div>

        {/* Right: Phone Mockup */}
        <div className="relative">
          <div className="relative mx-auto h-[580px] w-[280px] rounded-[40px] border-4 border-brand-charcoal bg-white p-2 shadow-2xl">
            {/* Phone notch */}
            <div className="absolute left-1/2 top-0 z-10 h-6 w-24 -translate-x-1/2 rounded-b-xl bg-brand-charcoal" />

            {/* Screen Content */}
            <div className="h-full overflow-hidden rounded-[32px] bg-brand-cream">
              {/* Status bar */}
              <div className="flex items-center justify-between bg-brand-green-dark px-4 pb-1 pt-8">
                <span className="text-[10px] font-medium text-white/70">FoodOS</span>
                <span className="text-[10px] text-white/70">09:41</span>
              </div>

              {/* App Header */}
              <div className="bg-brand-green px-4 pb-4 pt-2">
                <p className="text-[10px] text-white/70">Habari, Mama Salma</p>
                <p className="text-sm font-bold text-white">Leo - Dashboard</p>
              </div>

              {/* KPI Cards */}
              <div className="grid grid-cols-2 gap-2 p-3">
                <div className="rounded-xl bg-white p-3 shadow-sm">
                  <p className="text-[9px] text-gray-500">Mapato</p>
                  <p className="text-sm font-bold text-brand-green">TZS 450K</p>
                  <p className="text-[8px] text-green-500">+12% leo</p>
                </div>
                <div className="rounded-xl bg-white p-3 shadow-sm">
                  <p className="text-[9px] text-gray-500">Gharama Bidhaa</p>
                  <p className="text-sm font-bold text-brand-orange">TZS 180K</p>
                  <p className="text-[8px] text-gray-400">40% ya mapato</p>
                </div>
                <div className="rounded-xl bg-white p-3 shadow-sm">
                  <p className="text-[9px] text-gray-500">Matumizi</p>
                  <p className="text-sm font-bold text-gray-700">TZS 35K</p>
                  <p className="text-[8px] text-gray-400">Gesi, Ufungaji</p>
                </div>
                <div className="rounded-xl bg-white p-3 shadow-sm">
                  <p className="text-[9px] text-gray-500">Faida Halisi</p>
                  <p className="text-sm font-bold text-brand-green">TZS 235K</p>
                  <p className="text-[8px] text-green-500">52% margin</p>
                </div>
              </div>

              {/* Mini Chart */}
              <div className="mx-3 rounded-xl bg-white p-3 shadow-sm">
                <p className="text-[9px] font-medium text-gray-500">Mauzo - Wiki Hii</p>
                <div className="mt-2 flex items-end gap-1.5">
                  {[65, 45, 80, 55, 90, 70, 85].map((h, i) => (
                    <div key={i} className="flex flex-1 flex-col items-center gap-1">
                      <div
                        className="w-full rounded-t"
                        style={{
                          height: `${h * 0.5}px`,
                          backgroundColor: i === 6 ? '#E8712B' : '#2D7A3A',
                          opacity: i === 6 ? 1 : 0.6 + (i * 0.05),
                        }}
                      />
                      <span className="text-[7px] text-gray-400">
                        {['Ju', 'Ju', 'Al', 'Al', 'Ij', 'Ju', 'Leo'][i]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Alert */}
              <div className="mx-3 mt-2 rounded-lg bg-red-50 p-2">
                <p className="text-[9px] font-medium text-red-600">
                  Stoku Chini: Mchele 3kg, Nyama 2kg
                </p>
              </div>

              {/* Bottom Nav */}
              <div className="absolute bottom-2 left-2 right-2 flex items-center justify-around rounded-2xl bg-white py-2 shadow-md">
                {['Dashboard', 'POS', 'Stoku', 'Ripoti'].map((label, i) => (
                  <div key={label} className="flex flex-col items-center gap-0.5">
                    <div className={`h-4 w-4 rounded-full ${i === 0 ? 'bg-brand-green' : 'bg-gray-200'}`} />
                    <span className={`text-[7px] ${i === 0 ? 'font-bold text-brand-green' : 'text-gray-400'}`}>
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Floating badges */}
          <div className="absolute -left-8 top-16 rounded-lg bg-white px-3 py-2 shadow-lg">
            <p className="text-[10px] font-medium text-brand-green">M-Pesa</p>
            <p className="text-xs font-bold text-brand-charcoal">Malipo Papo</p>
          </div>
          <div className="absolute -right-8 top-40 rounded-lg bg-white px-3 py-2 shadow-lg">
            <p className="text-[10px] font-medium text-brand-orange">Idhini</p>
            <p className="text-xs font-bold text-brand-charcoal">2 Zinasubiri</p>
          </div>
          <div className="absolute -left-4 bottom-24 rounded-lg bg-white px-3 py-2 shadow-lg">
            <p className="text-[10px] font-medium text-green-600">Offline</p>
            <p className="text-xs font-bold text-brand-charcoal">Inafanya Kazi</p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="bg-white px-6 py-16 md:px-12 lg:px-24">
        <h2 className="text-center text-3xl font-bold text-brand-charcoal">
          Kila Kitu Unahitaji, Pahali Pamoja
        </h2>
        <p className="mx-auto mt-2 max-w-lg text-center text-sm text-gray-500">
          Everything you need to run your restaurant — in one place
        </p>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { icon: "🧾", title: "POS - Pata Oda", titleEn: "Take Orders", desc: "Menu grid, tap to order, malipo ya M-Pesa, Tigo, Cash — haraka na rahisi" },
            { icon: "📦", title: "Stoku - Fuatilia Bidhaa", titleEn: "Track Inventory", desc: "Ingiza bidhaa, toa, hariri — yote chini ya idhini ya mkurugenzi" },
            { icon: "💰", title: "Faida Halisi", titleEn: "Real Profit", desc: "Mapato - Gharama Bidhaa Zilizotumika - Matumizi = Faida yako halisi" },
            { icon: "📊", title: "Ripoti za Kila Siku", titleEn: "Daily Reports", desc: "Mauzo, gharama, faida — kila siku, wiki, mwezi kwenye simu yako" },
            { icon: "✅", title: "Mfumo wa Idhini", titleEn: "Approval System", desc: "Kila badiliko la stoku linahitaji kibali — hakuna wizi" },
            { icon: "📱", title: "Inafanya Kazi Offline", titleEn: "Works Offline", desc: "Hata wakati wa kukatika umeme — mfumo unafanya kazi" },
          ].map((f) => (
            <div key={f.title} className="rounded-2xl border border-gray-100 bg-brand-cream p-6 transition hover:shadow-md">
              <span className="text-3xl">{f.icon}</span>
              <h3 className="mt-3 text-lg font-bold text-brand-charcoal">{f.title}</h3>
              <p className="text-xs text-gray-400">{f.titleEn}</p>
              <p className="mt-2 text-sm text-gray-600">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="px-6 py-16 md:px-12 lg:px-24">
        <h2 className="text-center text-3xl font-bold text-brand-charcoal">
          Watu 3, Mfumo 1
        </h2>
        <p className="mx-auto mt-2 max-w-lg text-center text-sm text-gray-500">
          3 people, 1 system — replaces 6-7 staff members
        </p>

        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {[
            { role: "Mkurugenzi", roleEn: "Owner", color: "brand-green", desc: "Angalia faida, thibitisha stoku, simamia kutoka nyumbani" },
            { role: "Msimamizi Stoku", roleEn: "Stock Manager", color: "brand-orange", desc: "Ingiza bidhaa, toa, hariri — yote yanahitaji idhini" },
            { role: "Karani", roleEn: "Cashier", color: "brand-gold", desc: "Pata oda, pokea malipo ya M-Pesa na Cash" },
          ].map((r) => (
            <div key={r.role} className="rounded-2xl bg-white p-6 text-center shadow-md">
              <div className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-${r.color}/10`}>
                <div className={`h-8 w-8 rounded-full bg-${r.color}`} />
              </div>
              <h3 className="mt-4 text-lg font-bold text-brand-charcoal">{r.role}</h3>
              <p className="text-xs text-gray-400">{r.roleEn}</p>
              <p className="mt-2 text-sm text-gray-600">{r.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="bg-white px-6 py-16 md:px-12 lg:px-24">
        <h2 className="text-center text-3xl font-bold text-brand-charcoal">Bei Rahisi</h2>
        <p className="mx-auto mt-2 max-w-lg text-center text-sm text-gray-500">
          Simple pricing — start free, upgrade when you grow
        </p>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {/* Free */}
          <div className="rounded-2xl border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-brand-charcoal">Bure (Free)</h3>
            <p className="mt-1 text-3xl font-bold text-brand-charcoal">TZS 0</p>
            <p className="text-sm text-gray-400">/mwezi</p>
            <ul className="mt-6 space-y-2 text-sm text-gray-600">
              <li>&#10003; Mtumiaji 1</li>
              <li>&#10003; Oda 50/siku</li>
              <li>&#10003; Ripoti za msingi</li>
              <li>&#10003; Siku 30 za Pro bure</li>
            </ul>
            <Link href="/register" className="mt-6 block rounded-xl border-2 border-brand-green py-2.5 text-center text-sm font-semibold text-brand-green transition hover:bg-brand-green/5">
              Anza Bure
            </Link>
          </div>

          {/* Starter - Popular */}
          <div className="relative rounded-2xl border-2 border-brand-green bg-brand-green/5 p-6">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-brand-orange px-4 py-1 text-xs font-bold text-white">
              MAARUFU
            </div>
            <h3 className="text-lg font-bold text-brand-charcoal">Mwanzo (Starter)</h3>
            <p className="mt-1 text-3xl font-bold text-brand-charcoal">TZS 15,000</p>
            <p className="text-sm text-gray-400">/mwezi (~$6)</p>
            <ul className="mt-6 space-y-2 text-sm text-gray-600">
              <li>&#10003; Watumiaji 3</li>
              <li>&#10003; Oda zisizo na kikomo</li>
              <li>&#10003; Ripoti kamili</li>
              <li>&#10003; SMS alerts</li>
              <li>&#10003; Mfumo wa idhini</li>
            </ul>
            <Link href="/register" className="mt-6 block rounded-xl bg-brand-green py-2.5 text-center text-sm font-semibold text-white transition hover:bg-brand-green-dark">
              Chagua Mwanzo
            </Link>
          </div>

          {/* Pro */}
          <div className="rounded-2xl border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-brand-charcoal">Kitaalamu (Pro)</h3>
            <p className="mt-1 text-3xl font-bold text-brand-charcoal">TZS 40,000</p>
            <p className="text-sm text-gray-400">/mwezi (~$16)</p>
            <ul className="mt-6 space-y-2 text-sm text-gray-600">
              <li>&#10003; Watumiaji 10</li>
              <li>&#10003; Matawi mengi</li>
              <li>&#10003; Analytics za kina</li>
              <li>&#10003; API access</li>
              <li>&#10003; Msaada wa kipaumbele</li>
            </ul>
            <Link href="/register" className="mt-6 block rounded-xl border-2 border-brand-green py-2.5 text-center text-sm font-semibold text-brand-green transition hover:bg-brand-green/5">
              Chagua Kitaalamu
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-brand-green px-6 py-16 text-center md:px-12">
        <h2 className="text-3xl font-bold text-white">Anza Leo — Bure Kabisa</h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-white/80">
          Jisajili kwa sekunde 30. Hakuna kadi ya benki. Hakuna mkataba.
        </p>
        <Link
          href="/register"
          className="mt-8 inline-block rounded-xl bg-white px-10 py-4 text-base font-bold text-brand-green shadow-lg transition hover:shadow-xl"
        >
          Sajili Mgahawa Wako
        </Link>
      </section>

      {/* Footer */}
      <footer className="bg-brand-charcoal px-6 py-8 text-center">
        <div className="flex items-center justify-center gap-2">
          <Image src="/images/logo.png" alt="FoodOS" width={24} height={24} />
          <span className="text-sm font-bold text-white">
            Food<span className="text-brand-orange">OS</span>
          </span>
        </div>
        <p className="mt-2 text-xs text-gray-400">
          foodos.online &mdash; Restaurant Management for Tanzania
        </p>
        <p className="mt-1 text-xs text-gray-500">
          &copy; 2026 FoodOS. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
