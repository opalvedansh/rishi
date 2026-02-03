"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/client";

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    signOut: () => Promise<void>;
    updateProfile: (data: { firstName?: string; lastName?: string }) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    isLoading: true,
    signOut: async () => { },
    updateProfile: async () => ({ success: false }),
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                setUser(user);
            } catch (error) {
                console.error("Error fetching user:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUser();

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (session?.user) {
                setUser(session.user);
            } else {
                setUser(null);
            }
            setIsLoading(false);

            // Refresh router on auth state change to update server components
            // useRouter().refresh() // requires component import, but context is pure logic. 
            // Usually simpler to let individual pages handle redirects or Middleware handle protection.
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const signOut = async () => {
        await supabase.auth.signOut();
        setUser(null);
        window.location.href = "/"; // Force hard refresh/redirect to clear any server state
    };

    const updateProfile = async (data: { firstName?: string; lastName?: string }) => {
        try {
            const { data: updatedUser, error } = await supabase.auth.updateUser({
                data: {
                    first_name: data.firstName,
                    last_name: data.lastName,
                },
            });

            if (error) {
                return { success: false, error: error.message };
            }

            if (updatedUser.user) {
                setUser(updatedUser.user);
            }

            return { success: true };
        } catch {
            return { success: false, error: 'An unexpected error occurred' };
        }
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, signOut, updateProfile }}>
            {children}
        </AuthContext.Provider>
    );
}
