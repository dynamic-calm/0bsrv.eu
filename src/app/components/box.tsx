export function Box({
  children,
  label,
}: {
  children: React.ReactNode;
  label: string;
}) {
  return (
    <div className="h-60 w-full rounded-sm border border-gray-600 font-mono text-xs">
      <div className="flex h-10 w-full items-center justify-center border-b border-gray-600">
        <span className="block font-sans text-sm font-semibold">{label}</span>
      </div>
      <div className="flex h-full w-full items-center justify-center">
        {children}
      </div>
    </div>
  );
}
