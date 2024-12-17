export function Box({
  children,
  label,
}: {
  children: React.ReactNode;
  label: string;
}) {
  return (
    <div className="h-64 w-full rounded-sm border border-gray-600 font-mono text-xs">
      <div className="flex h-10 w-full items-center justify-center border-b border-neutral-700">
        <span className="block font-sans text-sm font-semibold">{label}</span>
      </div>
      <div className="flex h-full w-full items-center justify-center">
        {children}
      </div>
    </div>
  );
}
