import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import * as QuranService from "@/services/quranService";

export const HizbView = () => {
  const [selectedHizb, setSelectedHizb] = useState("1");
  const [selectedEdition, setSelectedEdition] = useState("en.asad");

  const { data: hizbData, isLoading } = useQuery({
    queryKey: ["hizb", selectedHizb, selectedEdition],
    queryFn: () => QuranService.getHizbQuarter(selectedHizb, selectedEdition),
  });

  // Fetch Arabic text (quran-uthmani) separately for Hizb
  const { data: arabicData, isLoading: isArabicLoading } = useQuery({
    queryKey: ["hizb-arabic", selectedHizb],
    queryFn: () => QuranService.getHizbQuarter(selectedHizb, "quran-uthmani"),
  });

  if (isLoading || isArabicLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <Select value={selectedHizb} onValueChange={setSelectedHizb}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select Hizb Quarter" />
          </SelectTrigger>
          <SelectContent>
            {[...Array(240)].map((_, i) => (
              <SelectItem key={i + 1} value={(i + 1).toString()}>
                Hizb Quarter {i + 1}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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

      <Card className="p-6">
        <div className="space-y-6">
          {hizbData?.data?.ayahs?.map((ayah: any, index: number) => {
            const arabicAyah = arabicData?.data?.ayahs[index];
            return (
              <div key={ayah.number} className="pb-4 border-b last:border-0">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-muted-foreground">
                    {ayah.surah.name} - Verse {ayah.numberInSurah}
                  </span>
                </div>
                <div className="flex space-x-4">
                  {/* Arabic text */}
                  <p className="text-lg leading-relaxed flex-1" dir="rtl">{arabicAyah?.text}</p>
                  {/* English translation */}
                  <p className="text-lg leading-relaxed flex-1">{ayah.text}</p>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};

export default HizbView;
