import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import * as QuranService from "@/services/quranService";

export const PageView = () => {
  const [pageNumber, setPageNumber] = useState("1");
  const [selectedEdition, setSelectedEdition] = useState("en.asad");

  const { data: pageData, isLoading } = useQuery({
    queryKey: ["page", pageNumber, selectedEdition],
    queryFn: () => QuranService.getPage(pageNumber, selectedEdition),
  });

  // Fetch Arabic text (quran-uthmani) using the same page number
  const { data: arabicData, isLoading: isArabicLoading } = useQuery({
    queryKey: ["page", pageNumber, "quran-uthmani"],
    queryFn: () => QuranService.getPage(pageNumber, "quran-uthmani"),
  });

  // Combine the data from both Arabic and English texts
  const combinedData = pageData?.data?.ayahs.map((ayah: any) => {
    const arabicAyah = arabicData?.data?.ayahs.find((arabicAyah: any) => arabicAyah.number === ayah.number);
    return {
      ...ayah,
      arabicText: arabicAyah?.text || "",
    };
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <Input
          type="number"
          min="1"
          max="604"
          value={pageNumber}
          onChange={(e) => setPageNumber(e.target.value)}
          placeholder="Enter page number (1-604)"
          className="flex-1"
        />
        <Select value={selectedEdition} onValueChange={setSelectedEdition}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select Edition" />
          </SelectTrigger>
          <SelectContent>
          <SelectItem value="en.pickthall">Pickthall</SelectItem>
            <SelectItem value="en.asad">Muhammad Asad</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading || isArabicLoading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      ) : (
        <Card className="p-6 bg-white/90 dark:bg-gray-800/90">
          <div className="space-y-6">
            {combinedData?.map((ayah: any) => (
              <div key={ayah.number} className="pb-4 border-b last:border-0">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-muted-foreground">
                    {ayah.surah.englishName} - Verse {ayah.numberInSurah}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  {/* Arabic Text */}
                  <p className="text-lg leading-relaxed rtl-text w-1/2">{ayah.arabicText}</p>

                  {/* English Translation */}
                  <p className="text-lg leading-relaxed ltr-text w-1/2">{ayah.text}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};
