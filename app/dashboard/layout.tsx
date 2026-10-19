import { NavLinks } from "./nav-links";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <aside className="border-b border-zinc-200 p-4 dark:border-zinc-800 md:w-56 md:shrink-0 md:border-b-0 md:border-r">
        <p className="mb-4 px-3 text-lg font-semibold tracking-tight">
          PulseMarket
        </p>
        <NavLinks />
      </aside>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
