import Link from "next/link";
import { ExternalLink } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/app/components/ui/tooltip";

export function Box({
  children,
  label,
  dataSetCode,
  description,
}: {
  children: React.ReactNode;
  label: string;
  dataSetCode: string;
  description?: string;
}) {
  return (
    <div className="w-full rounded-sm border border-gray-600 font-mono text-xs">
      <div className="relative flex h-10 w-full items-center justify-center border-b border-gray-600">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <span className="block cursor-help font-sans text-sm font-semibold">
                {label}
              </span>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-pretty">{description}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <Link
          href={`https://ec.europa.eu/eurostat/databrowser/product/view/${dataSetCode}`}
          target="_blank"
          className="group absolute right-2 flex cursor-pointer items-center justify-center gap-1 text-xxs text-gray-1000 transition-colors duration-150 hover:text-gray-1200"
        >
          <span>{dataSetCode}</span>
          <ExternalLink className="mt-[0.1rem] size-[0.63rem] text-gray-700 transition-colors duration-150 group-hover:text-gray-1200 group-hover:underline" />
        </Link>
      </div>
      <div className="flex h-52 md:h-72 w-full items-center justify-center">
        {children}
      </div>
    </div>
  );
}
