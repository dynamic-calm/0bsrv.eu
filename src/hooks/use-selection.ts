"use client";

import { useSyncExternalStore } from "react";
import { selectionStore } from "@/lib/selection-store";

export function useSelection(): string[] {
  return useSyncExternalStore(
    selectionStore.subscribe,
    selectionStore.getSnapshot,
    selectionStore.getServerSnapshot,
  );
}

export function setSelection(next: string[]) {
  selectionStore.set(next);
}
