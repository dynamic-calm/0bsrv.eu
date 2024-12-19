import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { countries } from "@/lib/config";
import { cn } from "@/lib/utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function CountrySelector({
  className,
  isDrawer,
}: {
  className?: string;
  isDrawer?: boolean;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);

  function handleChange(value: string) {
    const [key, valueToSet] = value.split(":");
    if (valueToSet === "none") {
      params.delete(key);
    } else {
      params.set(key, valueToSet);
    }
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

  const selectedCountries = [1, 2, 3, 4].map((index) => {
    const countryKey = `country${index}`;
    return { country: params.get(countryKey) ?? "none", countryKey };
  });

  return (
    <div
      className={cn(
        "w-full max-w-screen-2xl space-y-2 py-2 font-mono text-xs xl:mx-auto xl:-ml-2 xl:-mr-2 xl:grid xl:grid-cols-5 xl:gap-x-8 xl:gap-y-2 xl:space-y-0 xl:bg-gray-200 xl:px-2",
        className,
      )}
    >
      <Select>
        <div className="flex items-center gap-2">
          <span
            className="size-2 min-w-2"
            style={{ backgroundColor: "var(--accent-color-1)" }}
          />
          <span className="mr-[3.22rem] lg:mr-0">eu</span>
          <SelectTrigger className="h-7 w-full cursor-not-allowed font-mono text-xs">
            <SelectValue placeholder="eu" />
          </SelectTrigger>
        </div>
      </Select>
      {new Array(4).fill(null).map((_, index) => {
        const countryKey = `country${index + 1}`;

        function filterCountry(country: string) {
          if (country === "none") return true;
          for (const selectedCountry of selectedCountries) {
            if (
              selectedCountry.country === country &&
              countryKey !== selectedCountry.countryKey
            ) {
              return false;
            }
          }

          return true;
        }
        return (
          <Select
            onValueChange={handleChange}
            key={`country${index + 1}`}
            defaultValue={`${countryKey}:${params.get(countryKey) ?? "none"}`}
          >
            <div className="flex items-center gap-2 text-nowrap">
              <span
                className="size-2 min-w-2"
                style={{
                  backgroundColor: `var(--accent-color-${index + 2})`,
                }}
              />
              <span>country {index + 1}</span>
              <SelectTrigger className="h-7 w-full font-mono text-xs">
                <SelectValue
                  placeholder={params.get(`country${index + 1}`) ?? "none"}
                />
              </SelectTrigger>
            </div>
            <SelectContent
              className={cn("font-mono", isDrawer && "z-[500] bg-gray-300")}
            >
              {["none", ...countries].filter(filterCountry).map((country) => (
                <SelectItem
                  value={`${countryKey}:${country}`}
                  key={`${countryKey}:${country}`}
                  className={cn(
                    "cursor-pointer text-xs",
                    isDrawer && "focus:background-gray-400",
                  )}
                >
                  {country}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      })}
    </div>
  );
}
