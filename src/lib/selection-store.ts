"use client";

import { countries } from "@/lib/config";
import {
  SELECTED_PARAM,
  parseSelected,
  serializeSelected,
} from "@/lib/url-state";

type Listener = () => void;

const allCountries: string[] = [...countries];

let initialized = false;
let selected: string[] = allCountries;
const listeners = new Set<Listener>();

function init() {
  if (initialized) return;
  initialized = true;
  if (typeof window === "undefined") return;
  const params = new URLSearchParams(window.location.search);
  selected = parseSelected(params.get(SELECTED_PARAM));
  window.addEventListener("popstate", () => {
    const p = new URLSearchParams(window.location.search);
    selected = parseSelected(p.get(SELECTED_PARAM));
    listeners.forEach((l) => l());
  });
}

export const selectionStore = {
  subscribe(listener: Listener) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
  getSnapshot(): string[] {
    init();
    return selected;
  },
  getServerSnapshot(): string[] {
    return allCountries;
  },
  set(next: string[]) {
    init();
    selected = next;
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const value = serializeSelected(next);
      if (value === null) params.delete(SELECTED_PARAM);
      else params.set(SELECTED_PARAM, value);
      const qs = params.toString();
      const url = qs
        ? `${window.location.pathname}?${qs}`
        : window.location.pathname;
      window.history.replaceState(null, "", url);
    }
    listeners.forEach((l) => l());
  },
  selectAll() {
    this.set(allCountries);
  },
  clear() {
    this.set([]);
  },
};
