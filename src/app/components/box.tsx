export function Box({
  children,
  label,
  dataSetCode,
}: {
  children: React.ReactNode;
  label: string;
  dataSetCode: string;
}) {
  // TODO add tooltip to link to data source
  return (
    <div className="w-full rounded-sm border border-gray-600 font-mono text-xs">
      <div className="relative flex h-10 w-full items-center justify-center border-b border-gray-600">
        <span className="block font-sans text-sm font-semibold">{label}</span>
        <span className="absolute right-2 cursor-help text-xxs text-gray-1000">
          {dataSetCode}
        </span>
      </div>
      <div className="flex h-80 w-full items-center justify-center">
        {children}
      </div>
    </div>
  );
}
