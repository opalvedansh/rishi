"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import Container from "@/components/ui/Container";
import FadeIn from "@/components/animations/FadeIn";
import { Loader2, Mail, Phone, ArrowRight } from "lucide-react";

export default function LoginPage() {
    const router = useRouter();
    const supabase = createClient();
    const [authMethod, setAuthMethod] = useState<"email" | "phone">("email");
    const [isLoading, setIsLoading] = useState(false);
    const [isOAuthLoading, setIsOAuthLoading] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [otpSent, setOtpSent] = useState(false);

    const [formData, setFormData] = useState({
        email: "",
        password: "",
        phone: "",
        otp: "",
    });

    // Email/Password Login
    const handleEmailLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email: formData.email,
                password: formData.password,
            });

            if (error) throw error;

            router.push("/account");
            router.refresh();
        } catch (err: any) {
            setError(err.message || "Failed to sign in");
        } finally {
            setIsLoading(false);
        }
    };

    // Phone OTP - Send Code
    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const { error } = await supabase.auth.signInWithOtp({
                phone: formData.phone,
            });

            if (error) throw error;

            setOtpSent(true);
        } catch (err: any) {
            // Handle common errors with user-friendly messages
            if (err.message?.includes("fetch") || err.message?.includes("network")) {
                setError("Phone authentication is not configured. Please contact support or use Email/Google login.");
            } else {
                setError(err.message || "Failed to send verification code");
            }
        } finally {
            setIsLoading(false);
        }
    };

    // Phone OTP - Verify Code
    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const { error } = await supabase.auth.verifyOtp({
                phone: formData.phone,
                token: formData.otp,
                type: "sms",
            });

            if (error) throw error;

            router.push("/account");
            router.refresh();
        } catch (err: any) {
            setError(err.message || "Invalid verification code");
        } finally {
            setIsLoading(false);
        }
    };

    // OAuth Login (Google/Apple)
    const handleOAuthLogin = async (provider: "google" | "apple") => {
        setIsOAuthLoading(provider);
        setError(null);

        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider,
                options: {
                    redirectTo: `${window.location.origin}/auth/callback`,
                },
            });

            if (error) throw error;
        } catch (err: any) {
            setError(err.message || `Failed to sign in with ${provider}`);
            setIsOAuthLoading(null);
        }
    };

    return (
        <div className="min-h-screen bg-neutral-50 flex items-center justify-center pt-24 pb-24">
            <Container>
                <div className="max-w-md mx-auto">
                    <FadeIn>
                        <div className="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-neutral-100">
                            <div className="text-center mb-8">
                                <h1 className="font-display text-3xl md:text-4xl mb-3">Welcome Back</h1>
                                <p className="text-neutral-500 text-sm">Sign in to access your orders and wishlist.</p>
                            </div>

                            {/* OAuth Buttons */}
                            <div className="space-y-3 mb-8">
                                <button
                                    onClick={() => handleOAuthLogin("google")}
                                    disabled={isOAuthLoading !== null}
                                    className="w-full flex items-center justify-center gap-3 h-12 bg-white border border-neutral-200 rounded-lg text-sm font-medium hover:bg-neutral-50 hover:border-neutral-300 transition-all disabled:opacity-50"
                                >
                                    {isOAuthLoading === "google" ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <>
                                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                            </svg>
                                            Continue with Google
                                        </>
                                    )}
                                </button>

                                <button
                                    onClick={() => handleOAuthLogin("apple")}
                                    disabled={isOAuthLoading !== null}
                                    className="w-full flex items-center justify-center gap-3 h-12 bg-black text-white rounded-lg text-sm font-medium hover:bg-neutral-800 transition-all disabled:opacity-50"
                                >
                                    {isOAuthLoading === "apple" ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <>
                                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                                            </svg>
                                            Continue with Apple
                                        </>
                                    )}
                                </button>
                            </div>

                            {/* Divider */}
                            <div className="relative mb-8">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-neutral-200"></div>
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-white px-4 text-neutral-400 tracking-widest">or</span>
                                </div>
                            </div>

                            {/* Auth Method Tabs */}
                            <div className="flex gap-2 p-1 bg-neutral-100 rounded-lg mb-6">
                                <button
                                    onClick={() => { setAuthMethod("email"); setError(null); setOtpSent(false); }}
                                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-md text-sm font-medium transition-all ${authMethod === "email"
                                        ? "bg-white text-black shadow-sm"
                                        : "text-neutral-500 hover:text-black"
                                        }`}
                                >
                                    <Mail className="w-4 h-4" />
                                    Email
                                </button>
                                <button
                                    onClick={() => { setAuthMethod("phone"); setError(null); }}
                                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-md text-sm font-medium transition-all ${authMethod === "phone"
                                        ? "bg-white text-black shadow-sm"
                                        : "text-neutral-500 hover:text-black"
                                        }`}
                                >
                                    <Phone className="w-4 h-4" />
                                    Phone
                                </button>
                            </div>

                            {error && (
                                <div className="bg-red-50 text-red-600 text-sm p-4 rounded-lg mb-6 text-center">
                                    {error}
                                </div>
                            )}

                            {/* Email Login Form */}
                            {authMethod === "email" && (
                                <form onSubmit={handleEmailLogin} className="space-y-5">
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-widest text-neutral-500 mb-2">Email Address</label>
                                        <input
                                            type="email"
                                            required
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors"
                                            placeholder="you@example.com"
                                        />
                                    </div>
                                    <div>
                                        <div className="flex justify-between items-center mb-2">
                                            <label className="block text-xs font-bold uppercase tracking-widest text-neutral-500">Password</label>
                                            <Link href="/forgot-password" className="text-xs text-neutral-400 hover:text-black transition-colors">
                                                Forgot?
                                            </Link>
                                        </div>
                                        <input
                                            type="password"
                                            required
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                            className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full bg-black text-white h-14 rounded-lg text-sm font-bold uppercase tracking-widest hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                                    >
                                        {isLoading ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                            <>
                                                Sign In
                                                <ArrowRight className="w-4 h-4" />
                                            </>
                                        )}
                                    </button>
                                </form>
                            )}

                            {/* Phone OTP Form */}
                            {authMethod === "phone" && !otpSent && (
                                <form onSubmit={handleSendOtp} className="space-y-5">
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-widest text-neutral-500 mb-2">Phone Number</label>
                                        <input
                                            type="tel"
                                            required
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors"
                                            placeholder="+91 98765 43210"
                                        />
                                        <p className="text-xs text-neutral-400 mt-2">We'll send you a one-time verification code.</p>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full bg-black text-white h-14 rounded-lg text-sm font-bold uppercase tracking-widest hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                                    >
                                        {isLoading ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                            <>
                                                Send Code
                                                <ArrowRight className="w-4 h-4" />
                                            </>
                                        )}
                                    </button>
                                </form>
                            )}

                            {/* OTP Verification Form */}
                            {authMethod === "phone" && otpSent && (
                                <form onSubmit={handleVerifyOtp} className="space-y-5">
                                    <div className="text-center mb-4">
                                        <p className="text-sm text-neutral-600">
                                            Enter the 6-digit code sent to <span className="font-medium">{formData.phone}</span>
                                        </p>
                                        <button
                                            type="button"
                                            onClick={() => setOtpSent(false)}
                                            className="text-xs text-neutral-400 hover:text-black mt-1"
                                        >
                                            Change number
                                        </button>
                                    </div>
                                    <div>
                                        <input
                                            type="text"
                                            required
                                            maxLength={6}
                                            value={formData.otp}
                                            onChange={(e) => setFormData({ ...formData, otp: e.target.value.replace(/\D/g, "") })}
                                            className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-4 py-4 text-center text-2xl font-bold tracking-[0.5em] focus:outline-none focus:border-black transition-colors"
                                            placeholder="------"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isLoading || formData.otp.length !== 6}
                                        className="w-full bg-black text-white h-14 rounded-lg text-sm font-bold uppercase tracking-widest hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50"
                                    >
                                        {isLoading ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                            <>
                                                Verify & Sign In
                                                <ArrowRight className="w-4 h-4" />
                                            </>
                                        )}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={handleSendOtp}
                                        disabled={isLoading}
                                        className="w-full text-sm text-neutral-500 hover:text-black transition-colors disabled:opacity-50"
                                    >
                                        Resend Code
                                    </button>
                                </form>
                            )}

                            <div className="mt-8 pt-8 border-t border-neutral-100 text-center text-sm text-neutral-500">
                                Not a member?{" "}
                                <Link href="/signup" className="text-black font-medium hover:underline">
                                    Join now
                                </Link>
                            </div>
                        </div>
                    </FadeIn>
                </div>
            </Container>
        </div>
    );
}
