import { Box } from "@/app/components/box";
import { Loader } from "lucide-react";

export function ChartLoader({ label }: { label: string }) {
  return (
    <Box label={label}>
      <Loader className="animate-spin text-gray-600" />
    </Box>
  );
}
