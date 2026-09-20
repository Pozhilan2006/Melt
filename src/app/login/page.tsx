"use client";

import React, { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { ApiError } from "@/lib/api";
import { Eye, EyeOff, Zap, ArrowRight, Mail, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

interface FormErrors {
  email?: string;
  password?: string;
  general?: string;
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validate = (): FormErrors => {
    const errs: FormErrors = {};
    if (!email.trim()) errs.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = "Enter a valid email.";
    if (!password) errs.password = "Password is required.";
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const user = await login({ email: email.trim(), password });
      // Redirect: if user hasn't onboarded yet, send to onboarding
      if (!user.is_onboarded) {
        router.push("/onboarding");
      } else {
        const redirectTo = searchParams.get("from") ?? "/";
        router.push(redirectTo);
      }
    } catch (err) {
      if (err instanceof ApiError) {
        // Surface the backend's message (already generic for 401)
        setErrors({ general: err.message });
      } else {
        setErrors({ general: "Network error. Is the server running?" });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-neo-cyan border-4 border-black px-4 py-2 brutal-shadow mb-4 transform rotate-1">
            <Zap className="w-5 h-5 fill-black" />
            <span className="font-black text-sm uppercase tracking-widest">WELCOME BACK</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tighter text-black leading-none">
            LOGIN TO<br />
            <span className="text-neo-cyan">YOUR TRIBE</span>
          </h1>
          <p className="mt-3 text-sm font-semibold text-black/60">
            Your crew is waiting. Get back in.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white border-4 border-black brutal-shadow-xl p-8 space-y-6">
          {/* General Error */}
          {errors.general && (
            <div className="bg-neo-pink/10 border-4 border-neo-pink p-4 brutal-shadow-sm">
              <p className="text-sm font-black text-neo-pink uppercase">{errors.general}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {/* Email */}
            <div>
              <label htmlFor="login-email" className="block text-xs font-black uppercase tracking-wider text-black mb-1.5">
                EMAIL ADDRESS
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black/40" />
                <input
                  id="login-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                  }}
                  placeholder="you@example.com"
                  className={cn(
                    "w-full pl-10 pr-4 py-3 border-3 border-black font-semibold text-sm bg-white focus:outline-none focus:bg-neo-cyan/20 transition-colors placeholder:text-black/30",
                    errors.email && "border-neo-pink bg-neo-pink/5"
                  )}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs font-bold text-neo-pink">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="login-password" className="block text-xs font-black uppercase tracking-wider text-black">
                  PASSWORD
                </label>
                <span className="text-[10px] font-bold text-black/40 uppercase hover:text-neo-pink cursor-pointer transition-colors">
                  Forgot password?
                </span>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black/40" />
                <input
                  id="login-password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
                  }}
                  placeholder="Your password"
                  className={cn(
                    "w-full pl-10 pr-12 py-3 border-3 border-black font-semibold text-sm bg-white focus:outline-none focus:bg-neo-cyan/20 transition-colors placeholder:text-black/30",
                    errors.password && "border-neo-pink bg-neo-pink/5"
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-black/40 hover:text-black transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs font-bold text-neo-pink">{errors.password}</p>
              )}
            </div>

            {/* Submit */}
            <button
              id="login-submit"
              type="submit"
              disabled={isLoading}
              className={cn(
                "w-full py-4 bg-neo-cyan text-black border-4 border-black font-black text-base uppercase tracking-widest brutal-shadow",
                "hover:translate-x-[-2px] hover:translate-y-[-2px] hover:brutal-shadow-xl transition-all",
                "active:translate-x-0 active:translate-y-0 active:shadow-none",
                "disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none",
                "flex items-center justify-center gap-2"
              )}
            >
              {isLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  LOGGING IN...
                </>
              ) : (
                <>
                  LET ME IN <ArrowRight className="w-5 h-5 stroke-[3]" />
                </>
              )}
            </button>
          </form>

          <div className="flex items-center gap-3">
            <div className="flex-1 border-t-2 border-dashed border-black/20" />
            <span className="text-xs font-black text-black/40 uppercase">NEW HERE?</span>
            <div className="flex-1 border-t-2 border-dashed border-black/20" />
          </div>

          <Link
            href="/register"
            id="go-to-register"
            className={cn(
              "block w-full py-4 bg-neo-yellow text-black border-4 border-black font-black text-base uppercase tracking-widest brutal-shadow text-center",
              "hover:translate-x-[-2px] hover:translate-y-[-2px] hover:brutal-shadow-xl transition-all",
              "active:translate-x-0 active:translate-y-0 active:shadow-none"
            )}
          >
            CREATE AN ACCOUNT ⚡
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
