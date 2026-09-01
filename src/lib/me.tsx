import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createContext, useContext, type ReactNode } from "react";
import { getMe } from "@/lib/server/fns";
import type { Me, Permissions, Staff } from "@/lib/types";
import { NONE } from "@/lib/roles";

const MeContext = createContext<Me | null>(null);

export function MeProvider({ children, value }: { children: ReactNode; value: Me }) {
  return <MeContext.Provider value={value}>{children}</MeContext.Provider>;
}

export function useMe(): Me {
  const v = useContext(MeContext);
  if (!v) throw new Error("useMe must be used within the app shell");
  return v;
}

export function useStaff(): Staff {
  const me = useMe();
  if (!me.staff) throw new Error("No staff profile");
  return me.staff;
}

export function usePerm(): Permissions {
  return useContext(MeContext)?.permissions ?? NONE;
}

export function useMeQuery(enabled = true) {
  return useQuery({
    queryKey: ["me"],
    queryFn: () => getMe(),
    staleTime: 15_000,
    enabled,
    retry: false,
  });
}

export function useInvalidate() {
  const qc = useQueryClient();
  return (...keys: string[]) => {
    void qc.invalidateQueries({ queryKey: ["me"] });
    for (const k of keys) void qc.invalidateQueries({ queryKey: [k] });
  };
}
