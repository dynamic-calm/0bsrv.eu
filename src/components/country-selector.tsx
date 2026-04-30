"use client";

import { Check, ChevronDown, X } from "lucide-react";
import { useState, type MouseEvent } from "react";
import { countries } from "@/lib/config";
import { cn } from "@/lib/utils";
import { highlightColorIndex } from "@/lib/url-state";
import { selectionStore } from "@/lib/selection-store";
import { setSelection, useSelection } from "@/hooks/use-selection";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function CountrySelector({
  className,
  isDrawer,
}: {
  className?: string;
  isDrawer?: boolean;
}) {
  const selected = useSelection();
  const [open, setOpen] = useState(false);
  const total = countries.length;

  function toggleAdd(country: string) {
    if (selected.includes(country)) {
      setSelection(selected.filter((c) => c !== country));
      return;
    }
    setSelection([...selected, country]);
  }

  function selectOnly(country: string) {
    if (selected.length === 1 && selected[0] === country) {
      selectionStore.selectAll();
      return;
    }
    setSelection([country]);
  }

  function clear() {
    selectionStore.clear();
  }

  function selectAll() {
    selectionStore.selectAll();
  }

  return (
    <div
      className={cn(
        "flex w-full max-w-screen-2xl items-center gap-2 py-2 font-mono text-xs xl:-ml-2 xl:-mr-2 xl:bg-gray-200 xl:px-2",
        className,
      )}
    >
      <div className="flex items-center gap-2 text-nowrap">
        <span
          className="size-2 min-w-2"
          style={{ backgroundColor: "var(--accent-color-1)" }}
          aria-hidden
        />
        <span>eu</span>
      </div>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            aria-label="select countries to highlight"
            className={cn(
              "flex h-7 min-w-0 items-center justify-between gap-2 rounded-sm border border-gray-600 bg-gray-100 px-2 text-left font-mono text-xs hover:bg-gray-300",
              "w-full xl:w-72",
              isDrawer && "bg-gray-300",
            )}
          >
            <TriggerContent selected={selected} total={total} />
            <div className="flex shrink-0 items-center gap-1">
              {selected.length > 0 && selected.length < total && (
                <span
                  role="button"
                  tabIndex={0}
                  aria-label="clear selection"
                  onClick={(e) => {
                    e.stopPropagation();
                    clear();
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      e.stopPropagation();
                      clear();
                    }
                  }}
                  onPointerDown={(e) => e.stopPropagation()}
                  className="flex size-4 items-center justify-center rounded-sm text-gray-1000 hover:bg-gray-400 hover:text-gray-1200"
                >
                  <X className="size-3" />
                </span>
              )}
              <ChevronDown
                className={cn(
                  "size-3 text-gray-1000 transition-transform duration-150",
                  open && "rotate-180",
                )}
              />
            </div>
          </button>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          sideOffset={6}
          className={cn(
            "z-[600] w-[min(20rem,calc(100vw-1rem))] rounded-sm border border-gray-600 bg-gray-100 p-0 font-mono text-xs text-gray-1200 shadow-lg",
            isDrawer && "z-[500] bg-gray-300",
          )}
          onOpenAutoFocus={(e) => {
            e.preventDefault();
          }}
        >
          <Command
            loop
            className="bg-transparent text-gray-1200"
            filter={(value, search) =>
              value.toLowerCase().includes(search.toLowerCase()) ? 1 : 0
            }
          >
            <CommandInput
              placeholder="search country"
              className="h-8 font-mono text-xs"
            />
            <div className="flex items-center justify-between gap-2 border-b border-gray-600 px-2 py-1 text-xxs text-gray-1000">
              <span>
                {selected.length}/{total} highlighted
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={selectAll}
                  disabled={selected.length === total}
                  className="uppercase text-gray-1000 hover:text-gray-1200 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  all
                </button>
                <span className="text-gray-700">·</span>
                <button
                  type="button"
                  onClick={clear}
                  disabled={selected.length === 0}
                  className="uppercase text-gray-1000 hover:text-gray-1200 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  none
                </button>
              </div>
            </div>
            <CommandList className="thin-scroll max-h-72">
              <CommandEmpty className="py-3 text-center text-xs text-gray-1000">
                no matches
              </CommandEmpty>
              {countries.map((country) => {
                const idx = selected.indexOf(country);
                const isSelected = idx >= 0;
                const colorIdx = isSelected ? highlightColorIndex(idx) : null;

                function onCheckboxClick(e: MouseEvent) {
                  e.stopPropagation();
                  toggleAdd(country);
                }

                return (
                  <CommandItem
                    key={country}
                    value={country}
                    onSelect={() => selectOnly(country)}
                    className={cn(
                      "cursor-pointer rounded-none px-2 py-1.5 font-mono text-xs text-gray-1200 aria-selected:bg-gray-300 aria-selected:text-gray-1200",
                      isDrawer && "aria-selected:bg-gray-400",
                    )}
                  >
                    <span
                      role="checkbox"
                      aria-checked={isSelected}
                      tabIndex={-1}
                      onPointerDown={(e) => e.stopPropagation()}
                      onMouseDown={(e) => e.stopPropagation()}
                      onClick={onCheckboxClick}
                      className={cn(
                        "flex size-3.5 cursor-pointer items-center justify-center rounded-[2px] border outline-none [-webkit-tap-highlight-color:transparent]",
                        isSelected
                          ? "border-transparent"
                          : "border-gray-700 bg-gray-100 hover:border-gray-1000",
                        isDrawer && !isSelected && "bg-gray-300",
                      )}
                      style={
                        isSelected
                          ? {
                              backgroundColor: `var(--accent-color-${colorIdx})`,
                            }
                          : undefined
                      }
                    >
                      {isSelected && (
                        <Check className="size-3 text-white" strokeWidth={3} />
                      )}
                    </span>
                    <span className="flex-1">{country}</span>
                  </CommandItem>
                );
              })}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}

function TriggerContent({
  selected,
  total,
}: {
  selected: string[];
  total: number;
}) {
  if (selected.length === 0) {
    return (
      <span className="min-w-0 flex-1 text-gray-1000">none highlighted</span>
    );
  }
  if (selected.length === total) {
    return (
      <div className="flex min-w-0 flex-1 items-center gap-1.5">
        <div className="flex items-center -space-x-0.5">
          {selected.slice(0, 5).map((country, i) => (
            <span
              key={country}
              className="size-2.5 min-w-2.5 rounded-full ring-1 ring-gray-100"
              style={{
                backgroundColor: `var(--accent-color-${highlightColorIndex(i)})`,
              }}
              aria-hidden
            />
          ))}
        </div>
        <span className="text-gray-1200">all {total} countries</span>
      </div>
    );
  }
  if (selected.length <= 2) {
    return (
      <div className="flex min-w-0 flex-1 items-center gap-1 overflow-hidden">
        {selected.map((country, i) => (
          <span
            key={country}
            className="flex max-w-[7rem] items-center gap-1 truncate rounded-sm bg-gray-300 px-1.5 py-0.5"
          >
            <span
              className="size-2 min-w-2"
              style={{
                backgroundColor: `var(--accent-color-${highlightColorIndex(i)})`,
              }}
              aria-hidden
            />
            <span className="truncate">{country}</span>
          </span>
        ))}
      </div>
    );
  }
  return (
    <div className="flex min-w-0 flex-1 items-center gap-1.5">
      <div className="flex items-center -space-x-0.5">
        {selected.slice(0, 5).map((country, i) => (
          <span
            key={country}
            className="size-2.5 min-w-2.5 rounded-full ring-1 ring-gray-100"
            style={{
              backgroundColor: `var(--accent-color-${highlightColorIndex(i)})`,
            }}
            aria-hidden
          />
        ))}
      </div>
      <span className="text-gray-1200">{selected.length} countries</span>
    </div>
  );
}
