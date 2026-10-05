import { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { clsx } from "clsx";
import {
  PanelLeftClose,
  PanelLeftOpen,
  LayoutDashboard,
  CalendarDays,
  TriangleAlert,
  CalendarClock,
  Scissors,
  ListChecks,
  Users,
  UserCircle,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { requireStaffUser } from "@/lib/auth/middleware";
import { redirect } from "next/navigation";

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  isAction?: boolean;
}

const navigation = [
  { href: "/staff", label: "Dashboard", icon: LayoutDashboard },
  { href: "/staff/appointments", label: "Appointments", icon: CalendarDays },
  { href: "/staff/needs-attention", label: "Needs Attention", icon: TriangleAlert },
  { href: "/staff/availability", label: "Availability", icon: CalendarClock },
  { href: "/staff/barbers", label: "Barbers", icon: Scissors },
  { href: "/staff/services", label: "Services", icon: ListChecks },
  { href: "/staff/staff", label: "Staff", icon: Users },
  { href: "/staff/account", label: "My Account", icon: UserCircle },
  { href: "/api/auth/logout", label: "Sign Out", icon: LogOut, isAction: true },
];

const SIDEBAR_EXPANDED_WIDTH = "w-64";
const SIDEBAR_COLLAPSED_WIDTH = "w-16";

export default async function StaffLayout({ children }: { children: React.ReactNode }) {
  const staffUser = await requireStaffUser();

  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const navigationItems = navigation.filter((item) => !item.isAction);
  const actionItems = navigation.filter((item) => item.isAction);

  // Close drawer on escape key
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && drawerOpen) {
        setDrawerOpen(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [drawerOpen]);

  // Close drawer when a link is clicked (mobile)
  useEffect(() => {
    if (drawerOpen) {
      const handleClick = (event: MouseEvent) => {
        const target = event.target as HTMLElement;
        if (target.closest("a")) {
          setDrawerOpen(false);
        }
      };
      document.addEventListener("click", handleClick);
      return () => document.removeEventListener("click", handleClick);
    }
  }, [drawerOpen]);

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      {/* Mobile menu button - visible on mobile only */}
      <button
        onClick={() => setDrawerOpen(true)}
        className="lg:hidden block bg-[var(--color-brand-primary)] text-[var(--color-brand-light)] hover:text-[var(--color-brand-accent)] p-2 rounded-[var(--radius-full)] transition-fast"
        aria-label="Menu"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      <aside
        className={clsx(
          "fixed top-0 left-0 z-40 h-screen w-full md:w-auto max-w-sm transform transition-all duration-300 ease-out",
          isCollapsed ? "translate-x-[-260px]" : "translate-x-0",
          drawerOpen ? "translate-x-[-260px]" : "translate-x-0",
          "border-r border-[var(--color-brand-secondary)]"
        )}
        aria-label="Staff navigation"
      >
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center justify-between px-4 border-b border-[var(--color-brand-secondary)]">
            {!isCollapsed && (
              <Link
                href="/staff"
                className="flex items-center gap-2"
                aria-label="Groomd Staff — Home"
              >
                <span className="font-display font-extrabold uppercase tracking-[0.04em] text-[var(--color-brand-light)]" style={{ fontSize: "1rem" }}>
                  GROOMD
                  <span className="text-[var(--color-brand-accent)]" aria-hidden="true">.</span>
                </span>
                <span className="font-display font-semibold uppercase tracking-[0.2em] text-[var(--color-brand-light)] text-sm">
                  STAFF
                </span>
              </Link>
            )}

            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              aria-expanded={!isCollapsed}
              className="text-[var(--color-brand-light)] hover:text-[var(--color-brand-accent)] p-2 rounded-[var(--radius-full)] hover:bg-[var(--color-background-support)] transition-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus-on-strong)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-brand-primary)]"
            >
              {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
            </button>
          </div>

          {/* Collapsed sidebar or mobile drawer content */}
          {drawerOpen ? (
            /* Mobile drawer overlay */
            <div
              className="fixed inset-0 bg-[var(--color-brand-primary)]/80 backdrop-blur-sm z-50"
              onClick={() => setDrawerOpen(false)}
              aria-hidden="true"
            />
          ) : (
            /* Expanded/collapsed sidebar */
            <div className="flex h-full flex-col">
              <div className="flex h-16 items-center justify-between px-4 border-b border-[var(--color-brand-secondary)]">
                {!isCollapsed && (
                  <Link
                    href="/staff"
                    className="flex items-center gap-2"
                    aria-label="Groomd Staff — Home"
                  >
                    <span className="font-display font-extrabold uppercase tracking-[0.04em] text-[var(--color-brand-light)]" style={{ fontSize: "1rem" }}>
                      GROOMD
                      <span className="text-[var(--color-brand-accent)]" aria-hidden="true">.</span>
                    </span>
                    <span className="font-display font-semibold uppercase tracking-[0.2em] text-[var(--color-brand-light)] text-sm">
                      STAFF
                    </span>
                  </Link>
                )}

                <button
                  onClick={() => setIsCollapsed(!isCollapsed)}
                  aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                  aria-expanded={!isCollapsed}
                  className="text-[var(--color-brand-light)] hover:text-[var(--color-brand-accent)] p-2 rounded-[var(--radius-full)] hover:bg-[var(--color-background-support)] transition-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus-on-strong)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-brand-primary)]"
                >
                  {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
                </button>
              </div>

              <nav className="flex-1 overflow-y-auto p-3 space-y-1" aria-label="Staff navigation">
                <ul className="space-y-1" role="list">
                  {navigationItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className={clsx(
                            "flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius-md)] transition-fast",
                            "font-body font-medium text-sm leading-tight",
                            isActive
                              ? "bg-[var(--color-background-support)] text-[var(--color-brand-accent)]"
                              : "text-[var(--color-text-on-strong)] hover:bg-[var(--color-background-support)] hover:text-[var(--color-brand-accent)]",
                            isCollapsed && "justify-center px-2"
                          )}
                          aria-current={isActive ? "page" : undefined}
                        >
                          <span
                            className={clsx(
                              "flex-shrink-0 w-5 h-5 flex-shrink-0",
                              isCollapsed && "mx-auto"
                            )}
                            aria-hidden="true"
                            title={item.label}
                          >
                            <item.icon className="w-5 h-5" />
                          </span>
                          {!isCollapsed && <span className="font-body font-medium truncate">{item.label}</span>}
                          {isActive && !isCollapsed && (
                            <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[var(--color-brand-accent)] flex-shrink-0" aria-hidden="true" />
                          )}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </nav>

              <div className="p-3 border-t border-[var(--color-brand-secondary)]">
                {actionItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={clsx(
                      "flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius-md)] transition-fast",
                      "font-body font-medium text-sm leading-tight",
                      isCollapsed && "justify-center px-2",
                      "text-[var(--color-text-on-strong)] hover:bg-[var(--color-background-support)] hover:text-[var(--color-brand-accent)]"
                    )}
                  >
                    <span
                      className={clsx(
                        "flex-shrink-0 w-5 h-5 flex-shrink-0",
                        isCollapsed && "mx-auto"
                      )}
                      aria-hidden="true"
                      title={item.label}
                    >
                      <item.icon className="w-5 h-5" />
                    </span>
                    {!isCollapsed && <span className="font-body font-medium truncate">{item.label}</span>}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Drawer content - shown when mobile menu is open */}
          {drawerOpen && (
            <div className="fixed inset-0 z-50 bg-[var(--color-brand-primary)] overflow-y-auto p-6 pt-8">
              <button
                onClick={() => setDrawerOpen(false)}
                className="absolute top-4 right-4 text-[var(--color-brand-light)] hover:text-[var(--color-brand-accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus-on-strong)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-brand-primary)]"
                aria-label="Close menu"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <nav className="space-y-6" role="navigation">
                {navigationItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <div key={item.href} className="py-2">
                      <Link
                        href={item.href}
                        className={clsx(
                          "block px-0 py-2 rounded-md text-lg font-medium transition-colors",
                          isActive
                            ? "text-[var(--color-brand-accent)]"
                            : "text-[var(--color-text-on-strong)] hover:text-[var(--color-brand-accent)] hover:bg-[var(--color-background-support)]"
                        )}
                        aria-current={isActive ? "page" : undefined}
                      >
                        <span className="flex items-center gap-3">
                          <item.icon className="w-5 h-5 flex-shrink-0" />
                          <span className="font-body font-medium truncate">{item.label}</span>
                        </span>
                      </Link>
                    </div>
                  );
                })}
              </nav>

              <div className="mt-6 pt-6 border-t border-[var(--color-border)]">
                <Link
                  href="/api/auth/logout"
                  className="w-full text-left text-sm text-[var(--color-text-on-strong)] hover:text-[var(--color-brand-accent)] transition-fast"
                >
                  Sign Out
                </Link>
              </div>
            </div>
          )}
        </div>
      </aside>

      <main
        className={clsx(
          "min-h-screen transition-all duration-300 ease-out",
          isCollapsed && !drawerOpen ? "lg:ml-16" : "lg:ml-64",
          drawerOpen && !isCollapsed ? "lg:ml-260" : ""
        )}
      >
        <div className="bg-[var(--color-background)] min-h-screen">
          {children}
        </div>
      </main>
    </div>
  );
}