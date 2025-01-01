import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

const SurahView = () => {
  const [selectedSurah, setSelectedSurah] = useState("1");
  const [selectedEdition, setSelectedEdition] = useState("en.asad");

  const { data: surahData, isLoading } = useQuery({
    queryKey: ["surah", selectedSurah, selectedEdition],
    queryFn: async () => {
      const response = await fetch(
        `https://api.alquran.cloud/v1/surah/${selectedSurah}/${selectedEdition}`
      );
      if (!response.ok) {
        throw new Error('Failed to fetch surah');
      }
      const data = await response.json();
      return data.data;
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <Select value={selectedSurah} onValueChange={setSelectedSurah}>
          <SelectTrigger className="w-full sm:w-[200px] bg-white/80 dark:bg-gray-800/80">
            <SelectValue placeholder="Select Surah" />
          </SelectTrigger>
          <SelectContent>
            {[...Array(114)].map((_, i) => (
              <SelectItem key={i + 1} value={(i + 1).toString()}>
                Surah {i + 1}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={selectedEdition} onValueChange={setSelectedEdition}>
          <SelectTrigger className="w-full sm:w-[200px] bg-white/80 dark:bg-gray-800/80">
            <SelectValue placeholder="Select Edition" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="en.asad">Muhammad Asad</SelectItem>
            <SelectItem value="en.pickthall">Pickthall</SelectItem>
            <SelectItem value="quran-uthmani">Arabic</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      ) : (
        <Card className="p-6 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">{surahData?.name}</h2>
            <p className="text-muted-foreground">
              {surahData?.englishName} - {surahData?.englishNameTranslation}
            </p>
          </div>
          <div className="space-y-6">
            {surahData?.ayahs?.map((ayah: any) => (
              <div key={ayah.number} className="pb-6 border-b last:border-0 dark:border-gray-700">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm text-muted-foreground bg-muted px-3 py-1 rounded-full">
                    Verse {ayah.numberInSurah}
                  </span>
                </div>
                <p className="text-lg leading-relaxed">{ayah.text}</p>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default SurahView;