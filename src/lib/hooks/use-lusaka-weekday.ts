"use client";

import { useSyncExternalStore } from "react";
import type { DayOfWeek } from "@/lib/types";

const noopSubscribe = () => () => {};

function getLusakaWeekday(): DayOfWeek {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    timeZone: "Africa/Lusaka",
  }) as DayOfWeek;
}

/**
 * Today's weekday in the business timezone (Africa/Lusaka), read only in the browser.
 *
 * Returns null during server rendering and hydration so the server HTML and the first
 * client render always agree (pages are prerendered, so a server-side "today" could be
 * a different calendar day from the visitor's). React re-renders with the real value
 * straight after hydration.
 */
export function useLusakaWeekday(): DayOfWeek | null {
  return useSyncExternalStore(noopSubscribe, getLusakaWeekday, () => null);
}
