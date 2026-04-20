"use client";

import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function PendingApprovalPage() {
  const supabase = createClient();
  const router = useRouter();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-cream px-4">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/3 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-orange/8 blur-[120px]" />
      </div>

      <div className="relative w-full max-w-md text-center">
        <div className="flex items-center justify-center gap-2">
          <Image src="/images/logo.png" alt="FoodOS" width={44} height={44} className="h-11 w-11 rounded-lg object-contain" />
          <h1 className="text-3xl font-bold text-brand-charcoal">
            Food<span className="text-brand-orange">OS</span>
          </h1>
        </div>

        <div className="mt-8 rounded-2xl border border-gray-100 bg-white/80 p-8 shadow-lg backdrop-blur-sm">
          {/* Animated clock icon */}
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-brand-orange/10">
            <svg className="h-10 w-10 text-brand-orange" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>

          <h2 className="mt-6 text-xl font-bold text-brand-charcoal">Ombi Lako Linakaguliwa</h2>
          <p className="mt-1 text-xs text-gray-400">Your Application is Under Review</p>

          <p className="mt-4 text-sm text-gray-600">
            Timu yetu inakagua ombi lako la mgahawa. Utapokea barua pepe ya uthibitisho utakapoidhinishwa.
          </p>
          <p className="mt-2 text-xs text-gray-400">
            Our team is reviewing your restaurant application. You&apos;ll receive a confirmation email once approved.
          </p>

          {/* Status indicator */}
          <div className="mt-6 rounded-xl border border-brand-orange/20 bg-brand-orange/5 p-4">
            <div className="flex items-center justify-center gap-3">
              <span className="relative flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-orange opacity-75" />
                <span className="relative inline-flex h-3 w-3 rounded-full bg-brand-orange" />
              </span>
              <span className="text-sm font-medium text-brand-orange">Inasubiri Idhini (Pending Approval)</span>
            </div>
          </div>

          {/* What happens next */}
          <div className="mt-6 space-y-3 text-left">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Hatua Zinazofuata:</p>
            <div className="flex items-start gap-3">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-green/10 text-[10px] font-bold text-brand-green">1</div>
              <p className="text-xs text-gray-600">Timu yetu itakagua maelezo yako (Our team reviews your details)</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-green/10 text-[10px] font-bold text-brand-green">2</div>
              <p className="text-xs text-gray-600">Utapokea barua pepe ya idhini (You receive an approval email)</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-green/10 text-[10px] font-bold text-brand-green">3</div>
              <p className="text-xs text-gray-600">Ingia na uanze kutumia FoodOS! (Login and start using FoodOS!)</p>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-center gap-4">
          <Link href="/" className="text-sm text-gray-500 hover:text-brand-green">
            Rudi Nyumbani
          </Link>
          <span className="text-gray-300">|</span>
          <button onClick={handleLogout} className="text-sm text-gray-500 hover:text-red-500">
            Toka (Logout)
          </button>
        </div>
      </div>
    </div>
  );
}
