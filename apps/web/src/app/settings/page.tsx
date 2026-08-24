"use client";

import React, { useState } from "react";
import { User, Lock, Sparkles, ShieldCheck, CheckCircle2, Loader2 } from "lucide-react";
import { ProtectedRoute } from "@/components/layout/protected-route";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
      <div className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-4xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Account & System Settings</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage your personal profile, credentials, and AI optimization preferences.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profile & Security Form */}
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader className="p-6 pb-4">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <User className="h-4 w-4 text-primary" />
                  <span>Profile Information</span>
                </CardTitle>
                <CardDescription className="text-xs">
                  Update your display name and sign-in credentials.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <form onSubmit={handleSaveProfile} className="space-y-4">
                  {successMsg && (
                    <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                      <span>{successMsg}</span>
                    </div>
                  )}

                  {errorMsg && (
                    <p className="text-xs text-destructive font-medium">{errorMsg}</p>
                  )}

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-foreground">Email Address</label>
                    <Input value={user?.email || ""} disabled className="h-9 text-sm bg-muted/30" />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-foreground">Full Name</label>
                    <Input
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="h-9 text-sm"
                    />
                  </div>

                  <div className="pt-2 border-t space-y-3">
                    <h4 className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                      <Lock className="h-3.5 w-3.5 text-muted-foreground" />
                      <span>Change Password (Leave blank to keep current)</span>
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[11px] text-muted-foreground">New Password</label>
                        <Input
                          type="password"
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="h-8 text-xs"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[11px] text-muted-foreground">Confirm Password</label>
                        <Input
                          type="password"
                          placeholder="••••••••"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="h-8 text-xs"
                        />
                      </div>
                    </div>
                  </div>

                  <Button type="submit" disabled={isSaving} className="text-xs gap-1.5">
                    {isSaving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CheckCircle2 className="h-3.5 w-3.5" />}
                    <span>Save Changes</span>
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* System & AI Info */}
          <div className="space-y-6">
            <Card>
              <CardHeader className="p-5 pb-3">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <span>AI Architecture</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5 pt-0 space-y-3 text-xs text-muted-foreground leading-relaxed">
                <div>
                  <span className="font-semibold text-foreground block mb-0.5">Active Providers:</span>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    <Badge variant="secondary" className="text-[10px]">OpenAI</Badge>
                    <Badge variant="secondary" className="text-[10px]">Anthropic Claude</Badge>
                    <Badge variant="secondary" className="text-[10px]">Google Gemini</Badge>
                    <Badge variant="secondary" className="text-[10px]">Local Ollama</Badge>
                  </div>
                </div>

                <div className="pt-2 border-t space-y-1">
                  <span className="font-semibold text-foreground block">Deterministic Temperature:</span>
                  <p>T &le; 0.2 with strict schema enforcement to prevent experience fabrication.</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="p-5 pb-3">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  <span>Data Protection</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5 pt-0 text-xs text-muted-foreground leading-relaxed">
                <p>All resume documents are stored encrypted. Your uploaded files are never used to train public models.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
