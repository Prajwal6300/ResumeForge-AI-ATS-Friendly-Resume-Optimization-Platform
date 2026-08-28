"use client";

import React, { useState } from "react";
import { User, Lock, Sparkles, ShieldCheck, CheckCircle2, Loader2, Key, Cpu, Shield } from "lucide-react";
import { ProtectedRoute } from "@/components/layout/protected-route";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/lib/auth-context";
import { apiClient } from "@/lib/api-client";

export default function SettingsPage() {
  const { user, updateUser } = useAuth();
  const [fullName, setFullName] = useState(user?.full_name || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg(null);
    setErrorMsg(null);

    if (password && password !== confirmPassword) {
      setErrorMsg("New passwords do not match.");
      return;
    }

    setIsSaving(true);
    try {
      const payload: any = { full_name: fullName };
      if (password) payload.password = password;

      const res = await apiClient.patch("/users/me", payload);
      updateUser(res.data);
      setSuccessMsg("Profile settings updated successfully.");
      setPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to update profile.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-4xl space-y-8 animate-fade-in">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">Account & System Settings</h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Manage your personal profile, credentials, and AI optimization preferences.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profile & Security Form */}
          <div className="md:col-span-2 space-y-6">
            <Card className="border border-border/80 shadow-dropdown bg-card rounded-2xl">
              <CardHeader className="p-6 pb-4 border-b border-border/60">
                <CardTitle className="text-base sm:text-lg font-bold flex items-center gap-2">
                  <User className="h-4 w-4 text-primary" />
                  <span>Profile Information</span>
                </CardTitle>
                <CardDescription className="text-xs">
                  Update your display name and sign-in credentials.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <form onSubmit={handleSaveProfile} className="space-y-4">
                  {successMsg && (
                    <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800 text-xs text-emerald-900 dark:text-emerald-300 flex items-center gap-2.5 shadow-subtle">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                      <span className="font-semibold">{successMsg}</span>
                    </div>
                  )}

                  {errorMsg && (
                    <Alert variant="destructive" className="py-2.5">
                      <AlertDescription className="text-xs font-semibold">{errorMsg}</AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">Email Address</label>
                    <Input value={user?.email || ""} disabled className="h-10 text-xs sm:text-sm bg-muted/40 text-muted-foreground font-mono" />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">Full Name</label>
                    <Input
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="h-10 text-xs sm:text-sm"
                    />
                  </div>

                  <div className="pt-4 border-t border-border/60 space-y-3">
                    <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5 uppercase tracking-wider">
                      <Lock className="h-3.5 w-3.5 text-muted-foreground" />
                      <span>Change Password (Leave blank to keep current)</span>
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-semibold text-muted-foreground">New Password</label>
                        <Input
                          type="password"
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="h-9 text-xs"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-semibold text-muted-foreground">Confirm Password</label>
                        <Input
                          type="password"
                          placeholder="••••••••"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="h-9 text-xs"
                        />
                      </div>
                    </div>
                  </div>

                  <Button type="submit" disabled={isSaving} variant="gradient" className="text-xs font-bold gap-2 h-9 shadow-subtle mt-2">
                    {isSaving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CheckCircle2 className="h-3.5 w-3.5" />}
                    <span>Save Profile Changes</span>
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* System & AI Info */}
          <div className="space-y-6">
            <Card className="border border-border/80 shadow-dropdown bg-card rounded-2xl">
              <CardHeader className="p-5 pb-3 border-b border-border/60">
                <CardTitle className="text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                  <Cpu className="h-4 w-4 text-primary" />
                  <span>AI Architecture</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5 space-y-3.5 text-xs text-muted-foreground leading-relaxed">
                <div>
                  <span className="font-bold text-foreground text-xs block mb-1">Supported Providers:</span>
                  <div className="flex flex-wrap gap-1.5">
                    <Badge variant="secondary" className="text-[10px] font-semibold">OpenAI GPT-4o</Badge>
                    <Badge variant="secondary" className="text-[10px] font-semibold">Claude 3.5</Badge>
                    <Badge variant="secondary" className="text-[10px] font-semibold">Gemini Pro</Badge>
                    <Badge variant="secondary" className="text-[10px] font-semibold">Local Ollama</Badge>
                  </div>
                </div>

                <div className="pt-3 border-t border-border/60 space-y-1">
                  <span className="font-bold text-foreground text-xs block">Deterministic Guardrails:</span>
                  <p className="text-[11px] leading-relaxed">T &le; 0.2 with strict schema enforcement to prevent experience fabrication.</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-border/80 shadow-dropdown bg-card rounded-2xl">
              <CardHeader className="p-5 pb-3 border-b border-border/60">
                <CardTitle className="text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  <span>Data Protection</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5 text-xs text-muted-foreground leading-relaxed">
                <p className="text-[11px] leading-relaxed">
                  All resume documents are stored with bank-grade encryption. Your career data is never used to train public AI models.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
