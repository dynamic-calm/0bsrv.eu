import { Box } from "@/app/components/box";
import { Loader } from "lucide-react";

export function ChartLoader({
  label,
  dataSetCode,
}: {
  label: string;
  dataSetCode: string;
}) {
  return (
    <Box label={label} dataSetCode={dataSetCode}>
      <Loader className="animate-spin text-gray-600" />
    </Box>
  );
}
