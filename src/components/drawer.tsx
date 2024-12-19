"use client";

import { Drawer } from "vaul";
import CountrySelector from "@/components/country-selector";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";

export default function VaulDrawer({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Drawer.Root direction="right">
      <Drawer.Trigger asChild>{children}</Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-[350] bg-black/40" />
        <Drawer.Content className="fixed bottom-0 right-0 top-0 z-[400] flex w-[310px] outline-none">
          <div className="isolate flex h-full w-full grow flex-col rounded-sm border border-gray-600 bg-gray-200 p-4 text-gray-1200">
            <VisuallyHidden.Root>
              <Drawer.Title className="mb-2 font-medium">
                Select a country
              </Drawer.Title>
              <Drawer.Description className="mb-2">
                Select a country to see the data
              </Drawer.Description>
            </VisuallyHidden.Root>
            <CountrySelector isDrawer />
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
