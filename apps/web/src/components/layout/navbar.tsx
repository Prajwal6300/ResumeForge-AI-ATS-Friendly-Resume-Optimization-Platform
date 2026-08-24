"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles, FileText, Briefcase, BarChart3, LayoutTemplate, Settings, LogOut, User as UserIcon, Plus } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const navLinks = [
    { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
    { href: "/resumes", label: "My Resumes", icon: FileText },
    { href: "/job-descriptions", label: "Target JDs", icon: Briefcase },
    { href: "/analysis/new", label: "ATS Match", icon: Sparkles, badge: "AI" },
    { href: "/templates", label: "Templates", icon: LayoutTemplate },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
        {/* Brand */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="h-9 w-9 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
              <Sparkles className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg leading-tight tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 dark:from-white dark:to-gray-200">
                ResumeForge<span className="text-blue-600">.AI</span>
              </span>
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">ATS Optimization</span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          {user && (
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href || (link.href !== "/dashboard" && pathname.startsWith(link.href));
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{link.label}</span>
                    {link.badge && (
                      <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-blue-100 text-blue-700 font-semibold dark:bg-blue-950 dark:text-blue-300">
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
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <Link href="/resumes/new">
                <Button size="sm" className="hidden sm:inline-flex gap-1.5">
                  <Plus className="h-4 w-4" />
                  <span>New Resume</span>
                </Button>
              </Link>
              
              <div className="flex items-center gap-2 border-l pl-3">
                <Link href="/settings" className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors">
                  <div className="h-8 w-8 rounded-full bg-blue-50 dark:bg-blue-950 border border-blue-200 flex items-center justify-center text-blue-600 font-semibold text-xs">
                    {user.full_name ? user.full_name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden lg:inline-block max-w-[120px] truncate text-xs text-muted-foreground">{user.full_name || user.email}</span>
                </Link>
                <Button variant="ghost" size="icon" onClick={logout} title="Sign Out">
                  <LogOut className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" size="sm">Sign In</Button>
              </Link>
              <Link href="/register">
                <Button size="sm" variant="gradient">Get Started Free</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
