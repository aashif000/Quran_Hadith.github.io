import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import * as QuranService from "@/services/quranService";

const QuranContent = () => {
  const { data: surahData, isLoading } = useQuery({
    queryKey: ["surah", "1", "en.asad"],
    queryFn: async () => {
      const response = await QuranService.getSurah("1", "en.asad");
      return response.data;
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(7)].map((_, i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>
    );
  }

  return (
    <Card className="p-6 bg-white/80 backdrop-blur-sm dark:bg-gray-900/80">
      <div className="space-y-6">
        {surahData?.ayahs?.map((ayah: any) => (
          <div key={ayah.number} className="pb-4 border-b last:border-0">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-muted-foreground">
                Verse {ayah.numberInSurah}
              </span>
            </div>
            <p className="text-lg leading-relaxed">{ayah.text}</p>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default QuranContent;