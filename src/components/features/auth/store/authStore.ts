import { create } from "zustand";
import { persist } from "zustand/middleware";
import { supabase } from "@/components/services/supabase";
import type { User, Session } from "@supabase/supabase-js";

interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  login: (
    email: string,
    password: string,
  ) => Promise<{ success: boolean; error?: string }>;
  register: (
    name: string,
    userName: string,
    email: string,
    password: string,
  ) => Promise<{ success: boolean; error?: string; data?: any }>;
  logout: () => Promise<void>;
  initializeAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      session: null,
      isLoading: true,

      initializeAuth: () => {
        supabase.auth.getSession().then(({ data: { session } }) => {
          set({ session, user: session?.user ?? null, isLoading: false });
        });

        const { data: listener } = supabase.auth.onAuthStateChange(
          (_event, session) => {
            set({ session, user: session?.user ?? null, isLoading: false });
          },
        );

        return () => listener.subscription.unsubscribe();
      },

      login: async (email, password) => {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) return { success: false, error: error.message };
        set({ user: data.user, session: data.session });
        return { success: true };
      },

      register: async (name, userName, email, password) => {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: name, user_name: userName } },
        });
        if (error) return { success: false, error: error.message };
        return { success: true, data };
      },

      logout: async () => {
        await supabase.auth.signOut();
        set({ user: null, session: null });
      },
    }),
    { name: "plan-it-auth" },
  ),
);
