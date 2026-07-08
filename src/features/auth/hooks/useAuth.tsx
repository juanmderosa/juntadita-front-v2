import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Session } from "@supabase/supabase-js";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { usersApi } from "@/api/users.api";
import { getSupabaseBrowser } from "@/lib/supabase";
import type { CurrentUser } from "@/types/users";

type AuthContextValue = {
  session: Session | null;
  accessToken: string | null;
  currentUser: CurrentUser | undefined;
  isLoading: boolean;
  error: unknown;
  setAuthenticatedSession: (session: Session) => void;
  refreshCurrentUser: () => Promise<CurrentUser | undefined>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);
const currentUserQueryKey = (accessToken: string | null) => ["users", "me", accessToken];

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [session, setSession] = useState<Session | null>(null);
  const [isSessionLoading, setIsSessionLoading] = useState(true);
  const [setupError, setSetupError] = useState<unknown>(null);
  const accessToken = session?.access_token ?? null;

  useEffect(() => {
    let isMounted = true;

    try {
      const supabase = getSupabaseBrowser();

      supabase.auth
        .getSession()
        .then(({ data, error }) => {
          if (!isMounted) return;
          if (error) setSetupError(error);
          setSession(data.session);
        })
        .catch((error: unknown) => {
          if (isMounted) setSetupError(error);
        })
        .finally(() => {
          if (isMounted) setIsSessionLoading(false);
        });

      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, nextSession) => {
        setSession(nextSession);
        queryClient.invalidateQueries({ queryKey: ["users", "me"] });
      });

      return () => {
        isMounted = false;
        subscription.unsubscribe();
      };
    } catch (error) {
      setSetupError(error);
      setIsSessionLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, [queryClient]);

  const currentUserQuery = useQuery({
    queryKey: currentUserQueryKey(accessToken),
    queryFn: () => usersApi.getCurrentUser(accessToken!),
    enabled: Boolean(accessToken),
  });

  const refreshCurrentUser = useCallback(async () => {
    if (!accessToken) return undefined;

    return queryClient.fetchQuery({
      queryKey: currentUserQueryKey(accessToken),
      queryFn: () => usersApi.getCurrentUser(accessToken),
    });
  }, [accessToken, queryClient]);

  const setAuthenticatedSession = useCallback((nextSession: Session) => {
    setSession(nextSession);
  }, []);

  const signOut = useCallback(async () => {
    const supabase = getSupabaseBrowser();
    await supabase.auth.signOut();
    setSession(null);
    queryClient.removeQueries({ queryKey: ["users", "me"] });
  }, [queryClient]);

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      accessToken,
      currentUser: currentUserQuery.data,
      isLoading: isSessionLoading || currentUserQuery.isLoading,
      error: setupError ?? currentUserQuery.error,
      setAuthenticatedSession,
      refreshCurrentUser,
      signOut,
    }),
    [
      accessToken,
      currentUserQuery.data,
      currentUserQuery.error,
      currentUserQuery.isLoading,
      isSessionLoading,
      refreshCurrentUser,
      session,
      setAuthenticatedSession,
      setupError,
      signOut,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth debe usarse dentro de AuthProvider.");
  }

  return context;
}
