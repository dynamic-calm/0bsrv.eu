import { ChevronDown } from "lucide-react";

export function HeaderFallback() {
  return (
    <header className="sticky top-0 z-20 -ml-2 -mr-2 flex h-12 items-center justify-center border-b border-gray-600 bg-gray-200 px-2 font-mono text-xs shadow-sm xl:justify-start">
      <div className="hidden w-full max-w-screen-2xl items-center gap-2 py-2 font-mono text-xs xl:-ml-2 xl:-mr-2 xl:flex xl:bg-gray-200 xl:px-2">
        <div className="flex items-center gap-2 text-nowrap">
          <span
            className="size-2 min-w-2"
            style={{ backgroundColor: "var(--accent-color-1)" }}
            aria-hidden
          />
          <span>eu</span>
        </div>
        <div className="flex h-7 min-w-0 flex-1 items-center justify-between gap-2 rounded-sm border border-gray-600 bg-gray-100 px-2">
          <span className="text-gray-1000">highlight countries</span>
          <ChevronDown className="size-3 text-gray-1000" />
        </div>
      </div>
      <div className="absolute right-2 xl:hidden">
        <div className="size-5 cursor-pointer text-gray-1000" />
      </div>
    </header>
  );
}
