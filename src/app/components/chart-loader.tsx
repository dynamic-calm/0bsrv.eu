import { Box } from "@/app/components/box";
import { Loader } from "lucide-react";

export function ChartLoader(props: { label: string; dataSetCode: string }) {
  return (
    <Box {...props}>
      <Loader className="animate-spin text-gray-600" />
    </Box>
  );
}
