"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import Container from "@/components/ui/Container";
import FadeIn from "@/components/animations/FadeIn";
import { Loader2, ArrowLeft, Mail, CheckCircle2 } from "lucide-react";

export default function ForgotPasswordPage() {
    const supabase = createClient();
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [emailSent, setEmailSent] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
            });

            if (error) throw error;

            setEmailSent(true);
        } catch (err: any) {
            setError(err.message || "Failed to send reset email. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-neutral-50 flex items-center justify-center pt-24 pb-24">
            <Container>
                <div className="max-w-md mx-auto">
                    <FadeIn>
                        <div className="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-neutral-100">
                            {!emailSent ? (
                                <>
                                    <div className="text-center mb-8">
                                        <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                            <Mail className="w-7 h-7 text-neutral-600" />
                                        </div>
                                        <h1 className="font-display text-3xl md:text-4xl mb-3">Forgot Password?</h1>
                                        <p className="text-neutral-500 text-sm">
                                            No worries. Enter your email and we&apos;ll send you a link to reset your password.
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
                                                Email Address
                                            </label>
                                            <input
                                                type="email"
                                                required
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors"
                                                placeholder="you@example.com"
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
                                                "Send Reset Link"
                                            )}
                                        </button>
                                    </form>
                                </>
                            ) : (
                                <div className="text-center">
                                    <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <CheckCircle2 className="w-7 h-7 text-green-600" />
                                    </div>
                                    <h2 className="font-display text-2xl md:text-3xl mb-3">Check Your Email</h2>
                                    <p className="text-neutral-500 text-sm mb-2">
                                        We&apos;ve sent a password reset link to:
                                    </p>
                                    <p className="font-medium text-black mb-6">{email}</p>
                                    <p className="text-neutral-400 text-xs mb-8">
                                        Didn&apos;t receive the email? Check your spam folder, or{" "}
                                        <button
                                            onClick={() => { setEmailSent(false); setError(null); }}
                                            className="text-black underline hover:no-underline"
                                        >
                                            try again
                                        </button>
                                        .
                                    </p>
                                </div>
                            )}

                            <div className="mt-8 pt-8 border-t border-neutral-100 text-center">
                                <Link
                                    href="/login"
                                    className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-black transition-colors"
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                    Back to Sign In
                                </Link>
                            </div>
                        </div>
                    </FadeIn>
                </div>
            </Container>
        </div>
    );
}
