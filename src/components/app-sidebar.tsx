import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Siren,
  ListChecks,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { num: "01", title: "Dashboard", url: "/", icon: LayoutDashboard },
  { num: "02", title: "Report Emergency", url: "/report", icon: Siren },
  { num: "03", title: "All Incidents", url: "/incidents", icon: ListChecks },
] as const;

export function AppSidebar({
  collapsed,
  onToggle,
}: {
  collapsed: boolean;
  onToggle: () => void;
}) {
  const currentPath = useRouterState({
    select: (router) => router.location.pathname,
  });

  return (
    <aside
      className={cn(
        "flex shrink-0 flex-col gap-2 border-r border-edge bg-panel p-4 transition-[width] duration-200",
        collapsed ? "w-[76px]" : "w-64",
      )}
    >
      <div
        className={cn(
          "flex items-center gap-2.5 py-3",
          collapsed ? "justify-center px-0" : "px-2",
        )}
      >
        <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-crit text-[15px] font-bold text-background">
          !
        </span>
        {!collapsed && (
          <span className="font-display text-[22px] leading-none tracking-wide">
            RESCUEGRAPH
          </span>
        )}
      </div>

      <nav className="mt-2 flex flex-col gap-1">
        {items.map((item) => {
          const active = currentPath === item.url;
          return (
            <Link
              key={item.url}
              to={item.url}
              title={collapsed ? item.title : undefined}
              className={cn(
                "flex items-center gap-3 rounded-2xl px-3.5 py-3 text-[14px] font-semibold transition-colors",
                collapsed && "justify-center px-0",
                active
                  ? "bg-crit text-background"
                  : "border border-edge text-dim hover:border-dim/40 hover:text-ink",
              )}
            >
              <item.icon className="size-4 shrink-0" />
              {!collapsed && <span className="truncate">{item.title}</span>}
              {!collapsed && (
                <span
                  className={cn(
                    "ml-auto font-mono text-[11px]",
                    active ? "opacity-70" : "opacity-60",
                  )}
                >
                  {item.num}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <button
        onClick={onToggle}
        className="mt-2 flex items-center justify-center gap-2 rounded-xl border border-edge px-3 py-2 text-dim transition-colors hover:text-ink"
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {collapsed ? (
          <PanelLeftOpen className="size-4" />
        ) : (
          <>
            <PanelLeftClose className="size-4" />
            <span className="font-mono text-[11px] tracking-wider">COLLAPSE</span>
          </>
        )}
      </button>

      <div className="mt-auto rounded-2xl border border-edge p-3">
        <div
          className={cn(
            "flex items-center gap-2 font-mono text-[11px] text-dim",
            collapsed && "justify-center",
          )}
        >
          <span className="size-2 shrink-0 rounded-full bg-ok animate-blink" />
          {!collapsed && "SYSTEMS NOMINAL"}
        </div>
        {!collapsed && (
          <div className="mt-2 font-mono text-[10px] text-dim/70">
            SHIFT 03:14 · SECTOR 7
          </div>
        )}
      </div>
    </aside>
  );
}
