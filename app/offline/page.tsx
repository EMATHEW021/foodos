"use client";

export default function OfflinePage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6">
      <div className="max-w-md text-center">
        <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-muted">
          <svg className="h-12 w-12 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636a9 9 0 010 12.728M5.636 5.636a9 9 0 000 12.728M8.464 8.464a5 5 0 010 7.072M15.536 8.464a5 5 0 000 7.072M12 12h.01" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-foreground">Hakuna Mtandao</h1>
        <p className="mt-1 text-xs text-muted-foreground">No Internet Connection</p>
        <p className="mt-4 text-sm text-muted-foreground">
          Huwezi kufikia ukurasa huu kwa sasa. Angalia mtandao wako na ujaribu tena.
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          You are currently offline. Check your connection and try again.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-6 rounded-xl bg-brand-green px-6 py-3 text-sm font-bold text-white hover:bg-brand-green-dark"
        >
          Jaribu Tena — Retry
        </button>
      </div>
    </div>
  );
}
