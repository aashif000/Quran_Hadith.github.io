import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import * as QuranService from "@/services/quranService";

// Function to fetch both English and Arabic translations concurrently
const fetchRukuData = async (rukuNumber: string, edition: string) => {
  const api1 = `https://api.alquran.cloud/v1/ruku/${rukuNumber}/${edition}`; // First API (English translation)
  const api2 = `https://api.alquran.cloud/v1/ruku/${rukuNumber}/quran-uthmani`; // Second API (Arabic script)

  const [response1, response2] = await Promise.all([fetch(api1), fetch(api2)]);

  // Check for successful responses before parsing JSON
  if (!response1.ok || !response2.ok) {
    throw new Error("Failed to fetch data from one or more APIs");
  }

  const data1 = await response1.json();
  const data2 = await response2.json();

  return { data1: data1.data, data2: data2.data };
};

export const RukuView = () => {
  const [selectedRuku, setSelectedRuku] = useState("1");
  const [selectedEdition, setSelectedEdition] = useState("en.asad");

  // Fetch data using the custom fetch function
  const { data: rukuData, isLoading } = useQuery({
    queryKey: ["ruku", selectedRuku, selectedEdition],
    queryFn: () => fetchRukuData(selectedRuku, selectedEdition),
  });

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 max-w-full overflow-x-hidden space-y-6">
      {/* Ruku and Edition Selection */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Select value={selectedRuku} onValueChange={setSelectedRuku}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select Ruku" />
          </SelectTrigger>
          <SelectContent>
            {[...Array(556)].map((_, i) => (
              <SelectItem key={i + 1} value={(i + 1).toString()}>
                Ruku {i + 1}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={selectedEdition} onValueChange={setSelectedEdition}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select Edition" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="en.asad">Muhammad Asad</SelectItem>
            <SelectItem value="en.pickthall">Pickthall</SelectItem> 
          </SelectContent>
        </Select>
      </div>

      {/* Loading Skeleton */}
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      ) : (
        <Card className="p-6">
          <div className="space-y-6">
            {/* Display Data */}
            {rukuData?.data1?.ayahs?.map((ayah: any, index: number) => (
              <div key={ayah.number} className="pb-4 border-b last:border-0">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-muted-foreground">
                    {ayah.surah.name} - Verse {ayah.numberInSurah}
                  </span>
                </div>

                {/* Display English and Arabic text on the same line */}
                <div className="flex items-center justify-between">
                  {/* English text on the left */}
                  <div className="text-lg text-muted-foreground flex-1 text-left">
                    {ayah.text}
                  </div>

                  {/* Arabic text on the right */}
                  <div
                    className="text-2xl font-arabic text-right leading-loose flex-1"
                    style={{ direction: "rtl" }}
                  >
                    {rukuData.data2.ayahs[index]?.text}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default RukuView;
