import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

/**
 * Hook que gestiona la sesión de autenticación (Supabase Auth)
 * y expone las acciones de login y logout.
 */
export function useSession() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });

    const {
      data: authListener,
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const login = async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) return error.message;
    return null;
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  return { session, login, logout };
}
