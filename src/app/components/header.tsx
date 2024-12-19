"use client";

import { MenuIcon } from "lucide-react";
import VaulDrawer from "@/app/components/drawer";
import CountrySelector from "@/app/components/country-selector";

export function Header() {
  return (
    <header className="sticky top-0 z-20 -ml-2 -mr-2 flex h-12 items-center justify-center border-b border-gray-600 bg-gray-200 px-2 font-mono text-xs shadow-sm">
      <CountrySelector className="hidden xl:grid" />
      <div className="absolute right-2 xl:hidden">
        <VaulDrawer>
          <MenuIcon className="size-5 cursor-pointer text-gray-1000 transition-colors duration-150 hover:text-gray-1200 active:scale-95" />
        </VaulDrawer>
      </div>
    </header>
  );
}
