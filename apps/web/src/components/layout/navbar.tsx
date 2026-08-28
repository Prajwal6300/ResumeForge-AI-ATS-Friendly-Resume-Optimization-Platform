"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sparkles,
  FileText,
  Briefcase,
  BarChart3,
  LayoutTemplate,
  Settings,
  LogOut,
  Plus,
  Menu,
  X,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
    { href: "/resumes", label: "My Resumes", icon: FileText },
    { href: "/job-descriptions", label: "Target JDs", icon: Briefcase },
    { href: "/analysis/new", label: "ATS Match", icon: Sparkles, badge: "AI" },
    { href: "/templates", label: "Templates", icon: LayoutTemplate },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/80 bg-background/85 backdrop-blur-md transition-all">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
        {/* Brand */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-sm group-hover:scale-105 group-hover:shadow-glow transition-all duration-200">
              <Sparkles className="h-4.5 w-4.5" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-base sm:text-lg leading-tight tracking-tight text-foreground flex items-center gap-0.5">
                ResumeForge<span className="text-primary font-black">AI</span>
              </span>
              <span className="text-[9px] uppercase tracking-wider text-muted-foreground font-semibold">
                Deterministic ATS Studio
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          {user && (
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive =
                  pathname === link.href ||
                  (link.href !== "/dashboard" && pathname.startsWith(link.href));
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 ${
                      isActive
                        ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-subtle"
                        : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    <span>{link.label}</span>
                    {link.badge && (
                      <span
                        className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold uppercase tracking-wider ${
                          isActive
                            ? "bg-white/20 text-white dark:bg-zinc-900/20 dark:text-zinc-900"
                            : "bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300"
                        }`}
                      >
                        {link.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          )}
        </div>

        {/* User / Actions */}
        <div className="flex items-center gap-2.5">
          {user ? (
            <div className="flex items-center gap-2 sm:gap-3">
              <Link href="/resumes/new">
                <Button size="sm" variant="gradient" className="hidden sm:inline-flex gap-1.5 text-xs font-semibold">
                  <Plus className="h-3.5 w-3.5" />
                  <span>New Resume</span>
                </Button>
              </Link>

              <div className="flex items-center gap-2 border-l border-border/80 pl-2.5 sm:pl-3">
                <Link
                  href="/settings"
                  className="flex items-center gap-2 p-1 rounded-lg hover:bg-muted transition-colors"
                  title="Account Settings"
                >
                  <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-indigo-100 to-violet-100 dark:from-indigo-950 dark:to-violet-950 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-primary font-bold text-xs shadow-subtle">
                    {user.full_name
                      ? user.full_name.charAt(0).toUpperCase()
                      : user.email.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden xl:inline-block max-w-[120px] truncate text-xs font-semibold text-foreground">
                    {user.full_name || user.email.split("@")[0]}
                  </span>
                </Link>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={logout}
                  title="Sign Out"
                  className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-rose-50 dark:hover:bg-rose-950/40"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>

              {/* Mobile Hamburger Button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden h-8 w-8"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" size="sm" className="text-xs font-semibold">
                  Sign In
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm" variant="gradient" className="text-xs font-semibold">
                  Get Started Free
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {user && mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-card/95 backdrop-blur-md px-4 py-4 space-y-3 animate-fade-in">
          <div className="space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive =
                pathname === link.href ||
                (link.href !== "/dashboard" && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between p-2.5 rounded-lg text-xs font-semibold transition-colors ${
                    isActive
                      ? "bg-primary text-primary-foreground font-bold"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="h-4 w-4" />
                    <span>{link.label}</span>
                  </div>
                  {link.badge && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 font-bold dark:bg-indigo-950 dark:text-indigo-300">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          <div className="pt-3 border-t border-border flex items-center justify-between gap-2">
            <Link
              href="/resumes/new"
              onClick={() => setMobileMenuOpen(false)}
              className="flex-1"
            >
              <Button size="sm" variant="gradient" className="w-full gap-1.5 text-xs font-semibold">
                <Plus className="h-4 w-4" />
                <span>New Resume</span>
              </Button>
            </Link>
            <Link
              href="/settings"
              onClick={() => setMobileMenuOpen(false)}
              className="flex-1"
            >
              <Button size="sm" variant="outline" className="w-full gap-1.5 text-xs font-semibold">
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
