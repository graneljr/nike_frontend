import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import DashbaordSideBar from "../components/DashboardSideBar";

function SkeletonBlock({ className = "" }) {
  return <div className={`rounded bg-zinc-200 motion-safe:animate-pulse ${className}`} />;
}

function SkeletonHeading({ description = true }) {
  return (
    <div className="space-y-3">
      <SkeletonBlock className="h-3 w-28" />
      <SkeletonBlock className="h-9 w-56 max-w-full" />
      {description && <SkeletonBlock className="h-4 w-80 max-w-full bg-zinc-100" />}
    </div>
  );
}

function SkeletonMetrics({ count = 3 }) {
  return (
    <div className={`grid gap-4 sm:grid-cols-2 ${count === 4 ? "xl:grid-cols-4" : "xl:grid-cols-3"}`}>
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className="rounded-xl border border-zinc-200 p-5">
          <SkeletonBlock className="h-10 w-10 rounded-lg bg-zinc-100" />
          <SkeletonBlock className="mt-5 h-3 w-28 bg-zinc-100" />
          <SkeletonBlock className="mt-2 h-7 w-32" />
        </div>
      ))}
    </div>
  );
}

function SkeletonTable({ rows = 6, columns = 4 }) {
  return (
    <div className="overflow-hidden rounded-xl border border-zinc-200">
      <div className="hidden gap-4 border-b border-zinc-200 bg-zinc-50 px-5 py-4 sm:grid" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
        {Array.from({ length: columns }, (_, index) => <SkeletonBlock key={index} className="h-3 w-20 bg-zinc-200" />)}
      </div>
      <div className="divide-y divide-zinc-100">
        {Array.from({ length: rows }, (_, row) => (
          <div key={row} className="grid grid-cols-2 gap-4 px-5 py-4 sm:grid-cols-[repeat(var(--skeleton-columns),minmax(0,1fr))]" style={{ "--skeleton-columns": columns }}>
            {Array.from({ length: columns }, (_, column) => (
              <SkeletonBlock key={column} className={`h-4 ${column === 0 ? "w-32 max-w-full" : "w-20 max-w-full"} ${column > 1 ? "hidden sm:block" : ""} bg-zinc-100`} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function DashboardSkeleton({ pathname, isAdmin }) {
  let content;

  if (pathname === "/profile") {
    content = (
      <>
        <SkeletonHeading />
        <div className="mt-8 grid gap-6 lg:grid-cols-[280px_1fr]">
          <section className="rounded-xl bg-zinc-100 p-6">
            <SkeletonBlock className="h-16 w-16 rounded-full bg-zinc-200" />
            <SkeletonBlock className="mt-4 h-5 w-36" />
            <SkeletonBlock className="mt-2 h-4 w-48 max-w-full bg-zinc-200" />
            <SkeletonBlock className="mt-4 h-7 w-28 rounded-full bg-zinc-200" />
          </section>
          <section className="rounded-xl border border-zinc-200 p-5 sm:p-7">
            <SkeletonBlock className="h-5 w-48" />
            <SkeletonBlock className="mt-2 h-4 w-72 max-w-full bg-zinc-100" />
            <div className="mt-7 grid gap-6 sm:grid-cols-2">
              {Array.from({ length: 5 }, (_, index) => <SkeletonBlock key={index} className="h-12 border-b border-zinc-100 bg-zinc-100" />)}
            </div>
            <SkeletonBlock className="mt-7 h-11 w-32 rounded-full" />
          </section>
        </div>
      </>
    );
  } else if (pathname === "/settings") {
    content = (
      <>
        <SkeletonHeading />
        <div className="mt-8 grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
          <div className="space-y-5">
            <section className="rounded-2xl border border-zinc-200 p-5 sm:p-7">
              <SkeletonBlock className="h-6 w-40" />
              <SkeletonBlock className="mt-2 h-4 w-72 max-w-full bg-zinc-100" />
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {Array.from({ length: 3 }, (_, index) => <SkeletonBlock key={index} className="h-24 rounded-xl bg-zinc-100" />)}
              </div>
            </section>
            <section className="flex items-center justify-between rounded-2xl border border-zinc-200 p-5 sm:p-7">
              <div><SkeletonBlock className="h-5 w-32" /><SkeletonBlock className="mt-2 h-4 w-64 max-w-full bg-zinc-100" /></div>
              <SkeletonBlock className="h-7 w-12 rounded-full bg-zinc-100" />
            </section>
          </div>
          <aside className="rounded-2xl bg-zinc-900 p-6">
            <SkeletonBlock className="h-3 w-28 bg-zinc-700" />
            <SkeletonBlock className="mt-5 h-48 rounded-xl bg-zinc-700" />
            <SkeletonBlock className="mt-4 h-4 w-52 bg-zinc-700" />
          </aside>
        </div>
      </>
    );
  } else if (pathname === "/orders" || pathname === "/view_orders") {
    content = (
      <>
        <SkeletonHeading />
        <div className="mt-8 flex flex-wrap gap-2">
          {Array.from({ length: 7 }, (_, index) => <SkeletonBlock key={index} className="h-9 w-24 rounded-full bg-zinc-100" />)}
        </div>
        <div className="mt-5"><SkeletonTable rows={7} columns={isAdmin ? 5 : 4} /></div>
      </>
    );
  } else if (pathname === "/stocks") {
    content = (
      <>
        <SkeletonHeading />
        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <SkeletonBlock className="h-11 w-full max-w-sm rounded-full bg-zinc-100" />
          <SkeletonBlock className="h-11 w-36 rounded-full" />
        </div>
        <div className="mt-5"><SkeletonTable rows={8} columns={5} /></div>
      </>
    );
  } else if (pathname === "/users") {
    content = (
      <>
        <SkeletonHeading />
        <div className="mt-8"><SkeletonMetrics count={3} /></div>
        <div className="mt-8"><SkeletonTable rows={7} columns={4} /></div>
      </>
    );
  } else if (isAdmin) {
    content = (
      <>
        <SkeletonHeading />
        <div className="mt-8"><SkeletonMetrics count={4} /></div>
        <section className="mt-10">
          <SkeletonBlock className="mb-4 h-5 w-36" />
          <SkeletonTable rows={4} columns={5} />
        </section>
        <section className="mt-10 rounded-xl border border-zinc-200 p-5">
          <SkeletonBlock className="mb-3 h-5 w-52" />
          {Array.from({ length: 3 }, (_, index) => <SkeletonBlock key={index} className="my-3 h-14 bg-zinc-100" />)}
        </section>
      </>
    );
  } else {
    content = (
      <>
        <SkeletonHeading />
        <div className="mt-8"><SkeletonMetrics count={3} /></div>
        <section className="mt-10">
          <SkeletonBlock className="mb-4 h-5 w-36" />
          <SkeletonTable rows={2} columns={4} />
        </section>
        <section className="mt-10">
          <SkeletonBlock className="mb-4 h-5 w-52" />
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {Array.from({ length: 4 }, (_, index) => <SkeletonBlock key={index} className="aspect-square rounded-xl bg-zinc-100" />)}
          </div>
        </section>
      </>
    );
  }

  return (
    <div className="min-h-[calc(100vh-130px)] px-5 py-7 sm:px-8 sm:py-9 xl:px-12" role="status" aria-label="Loading dashboard page">
      <span className="sr-only">Loading dashboard content</span>
      <div className="mx-auto max-w-7xl">{content}</div>
    </div>
  );
}

function DashboardLayout({userData}) {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const timer = window.setTimeout(() => setIsLoading(false), 300);
    return () => window.clearTimeout(timer);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-white text-zinc-950 lg:flex">
      <DashbaordSideBar userData={userData}/>
      <main className="min-w-0 flex-1">
        {isLoading ? (
          <DashboardSkeleton pathname={location.pathname} isAdmin={userData?.role === "admin"} />
        ) : (
          <Outlet />
        )}
      </main>
    </div>
  );
}

export default DashboardLayout;
