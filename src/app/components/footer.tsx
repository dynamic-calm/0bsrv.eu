import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-2 flex h-10 w-full items-center justify-center border-t border-gray-700 bg-gray-200 px-2 py-2 font-mono text-xs text-gray-900">
      <Link href="https://github.com/mateopresa/eu-lens" className="w-fit">
        <span className="block w-fit cursor-pointer underline decoration-gray-400 transition-colors duration-150 hover:text-gray-1200 hover:decoration-gray-900">
          by mateo
        </span>
      </Link>
    </footer>
  );
}
