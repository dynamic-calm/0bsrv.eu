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
        "col-span-full mb-3 mt-36 text-4xl font-bold tracking-tighter xl:text-5xl xl:tracking-[-0.225rem]",
        className,
      )}
    >
      {children}
    </div>
  );
}
