import { useMemo } from "react";

export function useStableBoolean(value: boolean) {
  return useMemo(() => value, [value]);
}
