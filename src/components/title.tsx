export function Title({ children }: { children: React.ReactNode }) {
  return (
    <div className="col-span-full mb-1 mt-20 text-3xl font-bold tracking-tighter">
      {children}
    </div>
  );
}
