"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, FileBarChart, Sparkles, CalendarDays, ScrollText, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/dashboard", label: "Home", icon: LayoutDashboard },
  { href: "/clients", label: "Clients", icon: Users },
  { href: "/calendar", label: "Calendar", icon: CalendarDays },
  { href: "/reports", label: "Reports", icon: FileBarChart },
];

const adminNav = [
  { href: "/admin/audit", label: "Admin", icon: ScrollText },
  { href: "/fields", label: "Fields", icon: SlidersHorizontal },
];

export function AppMobileNav({ isAdmin, isStaffOrAdmin }: { isAdmin?: boolean; isStaffOrAdmin?: boolean }) {
  const pathname = usePathname();

  return (
    <nav className="no-print flex items-center gap-1 border-b border-border bg-background px-4 py-2 md:hidden">
      <div className="mr-2 flex size-7 items-center justify-center rounded-md bg-primary/10 text-primary">
        <Sparkles className="size-4" />
      </div>
      {nav.map(({ href, label, icon: Icon }) => {
        const active =
          pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors",
              active
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Icon className="size-3.5" />
            {label}
          </Link>
        );
      })}
      {isAdmin &&
        adminNav.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors",
                active
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="size-3.5" />
              {label}
            </Link>
          );
        })}
    </nav>
  );
}
