import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

// JuzView component to display the selected Juz with verses and translations
export const JuzView = () => {
  const [selectedJuz, setSelectedJuz] = useState("30"); // Default to Juz 30
  const [selectedEdition, setSelectedEdition] = useState("en.asad"); // Default translation: Muhammad Asad

  // Fetch Juz data based on selected Juz and edition
  const { data: juzData, isLoading, error } = useQuery({
    queryKey: ["juz", selectedJuz, selectedEdition],
    queryFn: async () => {
      const response = await fetch(
        `https://api.alquran.cloud/v1/juz/${selectedJuz}/${selectedEdition}`
      );
      if (!response.ok) {
        throw new Error('Failed to fetch juz');
      }
      const data = await response.json();
      return data.data;
    },
  });

  // Handling error state
  if (error) {
    return <div className="text-red-500">Failed to load Juz data. Please try again later.</div>;
  }

  return (
    <div className="space-y-6">
      {/* Juz and Edition Selection */}
      <div className="flex gap-4">
        <Select value={selectedJuz} onValueChange={setSelectedJuz}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select Juz" />
          </SelectTrigger>
          <SelectContent>
            {[...Array(30)].map((_, i) => (
              <SelectItem key={i + 1} value={(i + 1).toString()}>
                Juz {i + 1}
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
            <SelectItem value="quran-uthmani">Arabic</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      ) : (
        <Card className="p-6 bg-white rounded-lg shadow-md">
          {/* Displaying Juz data */}
          <div className="space-y-6">
            {juzData?.ayahs?.map((ayah: any) => (
              <div key={ayah.number} className="pb-4 border-b last:border-0">
                {/* Surah and Ayah Number */}
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-muted-foreground">
                    {ayah.surah.name} - Ayah {ayah.numberInSurah}
                  </span>
                </div>

                {/* Verse Text */}
                <p className="text-lg leading-relaxed font-semibold text-gray-800">{ayah.text}</p>

                {/* Optional: Display Arabic Text if needed */}
                {ayah.surah.name !== ayah.surah.englishName && (
                  <div className="mt-2">
                    <span className="text-sm text-gray-600">{ayah.surah.name}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};
