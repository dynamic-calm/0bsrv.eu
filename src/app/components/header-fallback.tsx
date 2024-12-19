import { Select, SelectTrigger, SelectValue } from "@/app/components/ui/select";
import { MenuIcon } from "lucide-react";

export function HeaderFallback() {
  return (
    <header className="sticky top-0 z-20 -ml-2 -mr-2 flex items-center justify-center border-b border-gray-600 bg-gray-200 px-2 font-mono text-xs">
      <div className="mx-auto -ml-2 -mr-2 hidden w-full max-w-screen-2xl grid-cols-1 justify-start gap-x-8 gap-y-2 bg-gray-200 px-2 py-2 font-mono text-xs xl:grid xl:grid-cols-5">
        <Select>
          <div className="flex items-center gap-2">
            <span
              className="size-2 min-w-2"
              style={{ backgroundColor: "var(--accent-color-1)" }}
            />
            <span className="mr-[3.22rem] lg:mr-0">eu</span>
            <SelectTrigger className="h-7 w-full cursor-not-allowed font-mono text-xs">
              <SelectValue placeholder="eu" />
            </SelectTrigger>
          </div>
        </Select>
        {new Array(4).fill(null).map((_, index) => {
          return (
            <Select key={`country${index + 1}`}>
              <div className="flex items-center gap-2 text-nowrap">
                <span
                  className="size-2 min-w-2"
                  style={{
                    backgroundColor: `var(--accent-color-${index + 2})`,
                  }}
                />
                <span>country {index + 1}</span>
                <SelectTrigger className="h-7 w-full font-mono text-xs">
                  <SelectValue placeholder="none" />
                </SelectTrigger>
              </div>
            </Select>
          );
        })}
      </div>
      <div className="absolute right-2 xl:hidden">
        <MenuIcon className="size-5 cursor-pointer text-gray-1000 transition-colors duration-150 hover:text-gray-1200 active:scale-95" />
      </div>
    </header>
  );
}
