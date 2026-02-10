"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import Container from "@/components/ui/Container";
import FadeIn from "@/components/animations/FadeIn";
import { Loader2, Lock, CheckCircle2, Eye, EyeOff } from "lucide-react";
import Link from "next/link";

export default function ResetPasswordPage() {
    const router = useRouter();
    const supabase = createClient();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [isSessionReady, setIsSessionReady] = useState(false);

    // Check that the user has a valid recovery session
    useEffect(() => {
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                setIsSessionReady(true);
            } else {
                // Listen for auth state change (recovery token exchange)
                const { data: { subscription } } = supabase.auth.onAuthStateChange(
                    (event) => {
                        if (event === "PASSWORD_RECOVERY") {
                            setIsSessionReady(true);
                        }
                    }
                );
                return () => subscription.unsubscribe();
            }
        };
        checkSession();
    }, [supabase.auth]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (password.length < 6) {
            setError("Password must be at least 6 characters long.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setIsLoading(true);

        try {
            const { error } = await supabase.auth.updateUser({
                password: password,
            });

            if (error) throw error;

            setSuccess(true);
            setTimeout(() => {
                router.push("/account");
            }, 3000);
        } catch (err: any) {
            setError(err.message || "Failed to reset password. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    // No valid session — show a message
    if (!isSessionReady && !success) {
        return (
            <div className="min-h-screen bg-neutral-50 flex items-center justify-center pt-24 pb-24">
                <Container>
                    <div className="max-w-md mx-auto">
                        <FadeIn>
                            <div className="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-neutral-100 text-center">
                                <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Lock className="w-7 h-7 text-neutral-600" />
                                </div>
                                <h1 className="font-display text-2xl md:text-3xl mb-3">Reset Your Password</h1>
                                <p className="text-neutral-500 text-sm mb-6">
                                    Please use the link from your email to access this page. If you haven&apos;t requested a password reset yet:
                                </p>
                                <Link
                                    href="/forgot-password"
                                    className="inline-block bg-black text-white px-8 py-3 rounded-lg text-sm font-bold uppercase tracking-widest hover:opacity-90 transition-opacity"
                                >
                                    Request Reset Link
                                </Link>
                            </div>
                        </FadeIn>
                    </div>
                </Container>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-neutral-50 flex items-center justify-center pt-24 pb-24">
            <Container>
                <div className="max-w-md mx-auto">
                    <FadeIn>
                        <div className="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-neutral-100">
                            {!success ? (
                                <>
                                    <div className="text-center mb-8">
                                        <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                            <Lock className="w-7 h-7 text-neutral-600" />
                                        </div>
                                        <h1 className="font-display text-3xl md:text-4xl mb-3">Set New Password</h1>
                                        <p className="text-neutral-500 text-sm">
                                            Choose a strong password for your account.
                                        </p>
                                    </div>

                                    {error && (
                                        <div className="bg-red-50 text-red-600 text-sm p-4 rounded-lg mb-6 text-center">
                                            {error}
                                        </div>
                                    )}

                                    <form onSubmit={handleSubmit} className="space-y-5">
                                        <div>
                                            <label className="block text-xs font-bold uppercase tracking-widest text-neutral-500 mb-2">
                                                New Password
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type={showPassword ? "text" : "password"}
                                                    required
                                                    minLength={6}
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-4 py-3 pr-12 text-sm focus:outline-none focus:border-black transition-colors"
                                                    placeholder="At least 6 characters"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black transition-colors"
                                                >
                                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                </button>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold uppercase tracking-widest text-neutral-500 mb-2">
                                                Confirm Password
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type={showConfirmPassword ? "text" : "password"}
                                                    required
                                                    minLength={6}
                                                    value={confirmPassword}
                                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                                    className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-4 py-3 pr-12 text-sm focus:outline-none focus:border-black transition-colors"
                                                    placeholder="Re-enter your password"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black transition-colors"
                                                >
                                                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                </button>
                                            </div>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={isLoading}
                                            className="w-full bg-black text-white h-14 rounded-lg text-sm font-bold uppercase tracking-widest hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                                        >
                                            {isLoading ? (
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                            ) : (
                                                "Update Password"
                                            )}
                                        </button>
                                    </form>
                                </>
                            ) : (
                                <div className="text-center">
                                    <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <CheckCircle2 className="w-7 h-7 text-green-600" />
                                    </div>
                                    <h2 className="font-display text-2xl md:text-3xl mb-3">Password Updated!</h2>
                                    <p className="text-neutral-500 text-sm mb-6">
                                        Your password has been successfully reset. Redirecting you to your account...
                                    </p>
                                    <div className="flex justify-center">
                                        <Loader2 className="w-5 h-5 animate-spin text-neutral-400" />
                                    </div>
                                </div>
                            )}
                        </div>
                    </FadeIn>
                </div>
            </Container>
        </div>
    );
}
