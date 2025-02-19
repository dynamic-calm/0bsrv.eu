import { cn } from "@/lib/utils";

export function Title({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "col-span-full mb-3 mt-36 text-5xl font-bold tracking-[-0.225rem]",
        className,
      )}
    >
      {children}
    </div>
  );
}
