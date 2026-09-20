"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { ApiError } from "@/lib/api";
import { Eye, EyeOff, Zap, ArrowRight, User, Mail, Lock, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface FormState {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  general?: string;
}

function validateForm(data: FormState): FormErrors {
  const errors: FormErrors = {};

  if (!data.name.trim()) {
    errors.name = "Name is required.";
  } else if (data.name.trim().length < 2) {
    errors.name = "Name must be at least 2 characters.";
  }

  if (!data.email.trim()) {
    errors.email = "Email is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = "Enter a valid email address.";
  }

  if (!data.password) {
    errors.password = "Password is required.";
  } else if (data.password.length < 8) {
    errors.password = "Password must be at least 8 characters.";
  }

  if (!data.confirmPassword) {
    errors.confirmPassword = "Please confirm your password.";
  } else if (data.password !== data.confirmPassword) {
    errors.confirmPassword = "Passwords don't match.";
  }

  return errors;
}

const passwordRequirements = [
  { label: "At least 8 characters", check: (p: string) => p.length >= 8 },
  { label: "At least one number", check: (p: string) => /\d/.test(p) },
];

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();

  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear field error on change
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateForm(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      await register({ name: form.name.trim(), email: form.email.trim(), password: form.password });
      router.push("/onboarding");
    } catch (err) {
      if (err instanceof ApiError) {
        setErrors({ general: err.message });
      } else {
        setErrors({ general: "Something went wrong. Please try again." });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12">
      <div className="w-full max-w-lg">
        {/* Header badge */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-neo-yellow border-4 border-black px-4 py-2 brutal-shadow mb-4 transform -rotate-1">
            <Zap className="w-5 h-5 fill-black" />
            <span className="font-black text-sm uppercase tracking-widest">JOIN THE TRIBE</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tighter text-black leading-none">
            CREATE YOUR<br />
            <span className="text-neo-pink">MEELT! ACCOUNT</span>
          </h1>
          <p className="mt-3 text-sm font-semibold text-black/60">
            No followers. No vanity metrics. Just real people doing real things.
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
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-xs font-black uppercase tracking-wider text-black mb-1.5">
                YOUR NAME
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black/40" />
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g. Pozhilan Kumar"
                  className={cn(
                    "w-full pl-10 pr-4 py-3 border-3 border-black font-semibold text-sm bg-white focus:outline-none focus:bg-neo-yellow/20 transition-colors placeholder:text-black/30",
                    errors.name && "border-neo-pink bg-neo-pink/5"
                  )}
                />
              </div>
              {errors.name && (
                <p className="mt-1 text-xs font-bold text-neo-pink">{errors.name}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-xs font-black uppercase tracking-wider text-black mb-1.5">
                EMAIL ADDRESS
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black/40" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className={cn(
                    "w-full pl-10 pr-4 py-3 border-3 border-black font-semibold text-sm bg-white focus:outline-none focus:bg-neo-yellow/20 transition-colors placeholder:text-black/30",
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
              <label htmlFor="password" className="block text-xs font-black uppercase tracking-wider text-black mb-1.5">
                PASSWORD
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black/40" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Min. 8 characters"
                  className={cn(
                    "w-full pl-10 pr-12 py-3 border-3 border-black font-semibold text-sm bg-white focus:outline-none focus:bg-neo-yellow/20 transition-colors placeholder:text-black/30",
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
              {/* Password strength indicators */}
              {form.password && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {passwordRequirements.map((req) => (
                    <span
                      key={req.label}
                      className={cn(
                        "text-[10px] font-black uppercase px-2 py-0.5 border-2 flex items-center gap-1",
                        req.check(form.password)
                          ? "bg-neo-green/30 border-neo-green text-black"
                          : "bg-slate-100 border-black/20 text-black/40"
                      )}
                    >
                      {req.check(form.password) && <CheckCircle2 className="w-2.5 h-2.5" />}
                      {req.label}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-xs font-black uppercase tracking-wider text-black mb-1.5">
                CONFIRM PASSWORD
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black/40" />
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirm ? "text" : "password"}
                  autoComplete="new-password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="Repeat your password"
                  className={cn(
                    "w-full pl-10 pr-12 py-3 border-3 border-black font-semibold text-sm bg-white focus:outline-none focus:bg-neo-yellow/20 transition-colors placeholder:text-black/30",
                    errors.confirmPassword && "border-neo-pink bg-neo-pink/5"
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-black/40 hover:text-black transition-colors"
                >
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-xs font-bold text-neo-pink">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Submit */}
            <button
              id="register-submit"
              type="submit"
              disabled={isLoading}
              className={cn(
                "w-full py-4 bg-neo-pink text-white border-4 border-black font-black text-base uppercase tracking-widest brutal-shadow",
                "hover:translate-x-[-2px] hover:translate-y-[-2px] hover:brutal-shadow-xl transition-all",
                "active:translate-x-0 active:translate-y-0 active:shadow-none",
                "disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none",
                "flex items-center justify-center gap-2"
              )}
            >
              {isLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  CREATING ACCOUNT...
                </>
              ) : (
                <>
                  JOIN MEELT! <ArrowRight className="w-5 h-5 stroke-[3]" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 border-t-2 border-dashed border-black/20" />
            <span className="text-xs font-black text-black/40 uppercase">OR</span>
            <div className="flex-1 border-t-2 border-dashed border-black/20" />
          </div>

          {/* Login link */}
          <p className="text-center text-sm font-semibold text-black/70">
            Already in the tribe?{" "}
            <Link
              href="/login"
              className="font-black text-black underline decoration-neo-yellow decoration-4 hover:text-neo-pink transition-colors"
            >
              LOGIN HERE
            </Link>
          </p>
        </div>

        {/* Bottom flair */}
        <p className="text-center text-xs font-bold text-black/40 uppercase tracking-widest mt-6">
          No spam. No DMs. No follower games. ⚡
        </p>
      </div>
    </div>
  );
}
