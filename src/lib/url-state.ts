import { countries } from "@/lib/config";

export const SELECTED_PARAM = "c";
export const NONE_TOKEN = "none";
export const HIGHLIGHT_COLORS = 9;
export const EU_COLOR_INDEX = 1;

export function parseSelected(value: string | null): string[] {
  if (value === null) return [...countries];
  const trimmed = value.trim();
  if (trimmed === "" || trimmed === NONE_TOKEN) return [];
  const seen = new Set<string>();
  const out: string[] = [];
  for (const raw of trimmed.split(",")) {
    const name = raw.trim().toLowerCase();
    if (!name) continue;
    if (seen.has(name)) continue;
    if (!countries.includes(name)) continue;
    seen.add(name);
    out.push(name);
  }
  return out;
}

export function isAllSelected(list: string[]): boolean {
  if (list.length !== countries.length) return false;
  const set = new Set(list);
  return countries.every((c) => set.has(c));
}

export function serializeSelected(list: string[]): string | null {
  if (isAllSelected(list)) return null;
  if (list.length === 0) return NONE_TOKEN;
  return list.join(",");
}

export function highlightColorIndex(position: number): number {
  return (position % HIGHLIGHT_COLORS) + 2;
}
