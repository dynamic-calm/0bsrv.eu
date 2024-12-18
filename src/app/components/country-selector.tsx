"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { countries } from "@/lib/config";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function CountrySelector() {
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
    router.replace(`${pathname}?${params.toString()}`);
  }

  const selectedCountries = [1, 2, 3, 4].map((index) => {
    const countryKey = `country${index}`;
    return { country: params.get(countryKey) ?? "none", countryKey };
  });

  return (
    <header className="sticky top-0 z-20 -ml-2 -mr-2 grid grid-cols-1 gap-x-4 gap-y-2 border-b border-gray-600 bg-gray-200 px-2 py-2 font-mono text-xs sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      <Select>
        <div className="flex items-center gap-2">
          <span
            className="size-2 min-w-2"
            style={{ backgroundColor: "var(--accent-color-1)" }}
          />
          <span className="mr-[3.22rem] lg:mr-0">eu</span>
          <SelectTrigger className="h-7 w-full cursor-not-allowed font-mono text-xs sm:max-w-56">
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
                style={{ backgroundColor: `var(--accent-color-${index + 2})` }}
              />
              <span>country {index + 1}</span>
              <SelectTrigger className="h-7 w-full font-mono text-xs sm:max-w-56">
                <SelectValue
                  placeholder={params.get(`country${index + 1}`) ?? "none"}
                />
              </SelectTrigger>
            </div>
            <SelectContent className="font-mono">
              {["none", ...countries].filter(filterCountry).map((country) => (
                <SelectItem
                  value={`${countryKey}:${country}`}
                  key={`${countryKey}:${country}`}
                  className="cursor-pointer text-xs"
                >
                  {country}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      })}
    </header>
  );
}
