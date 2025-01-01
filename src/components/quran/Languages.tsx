import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

export const Languages = () => {
  const [selectedSura, setSelectedSura] = useState("1"); // Default to Surah 1
  const [selectedTranslation, setSelectedTranslation] = useState("tamil_baqavi"); // Default translation

  // Translation options with corresponding API URLs
  const translations = [
    { label: "Tamil - Abdulhamid Albaqoi", value: "tamil_baqavi", api: "https://quranenc.com/api/v1/translation/sura/tamil_baqavi/1" },
    { label: "Tamil - Omar Sharif", value: "tamil_omar", api: "https://quranenc.com/api/v1/translation/sura/tamil_omar/1" },
    { label: "Hindi - Azizul-Haqq Al-Umary", value: "hindi_omari", api: "https://quranenc.com/api/v1/translation/sura/hindi_omari/1" },
    { label: "Urdu - Muhammad Ibrahim Gunakry", value: "urdu_junagarhi", api: "https://quranenc.com/api/v1/translation/sura/urdu_junagarhi/1" },
    { label: "Telugu - Abder-Rahim ibn Muhammad", value: "telugu_muhammad", api: "https://quranenc.com/api/v1/translation/sura/telugu_muhammad/1" },
    { label: "Gujarati - Rabila Al-Umry", value: "gujarati_omari", api: "https://quranenc.com/api/v1/translation/sura/gujarati_omari/1" },
    { label: "Malayalam - Abdul-Hamid Haidar Al-Madany and Kanhi Muhammad", value: "malayalam_kunhi", api: "https://quranenc.com/api/v1/translation/sura/malayalam_kunhi/1" },
    { label: "Kannada - Muhammad Hamza Battur", value: "kannada_hamza", api: "https://quranenc.com/api/v1/translation/sura/kannada_hamza/1" },
    { label: "Assamese - Arif Halim", value: "assamese_rafeeq", api: "https://quranenc.com/api/v1/translation/sura/assamese_rafeeq/1" },
    { label: "Punjabi - Arif Halim", value: "punjabi_arif", api: "https://quranenc.com/api/v1/translation/sura/punjabi_arif/1" },
    { label: "Sinhalese - Rowwad", value: "sinhalese_mahir", api: "https://quranenc.com/api/v1/translation/sura/sinhalese_mahir/1" },
    { label: "Swahili - Ali Muhsen Alberwany", value: "swahili_barawani", api: "https://quranenc.com/api/v1/translation/sura/swahili_barawani/1" },
    { label: "Hausa - Abu Bakr Jomy", value: "hausa_gummi", api: "https://quranenc.com/api/v1/translation/sura/hausa_gummi/1" },
    { label: "Yoruba - Abu Rahima Mikhail Aikweiny", value: "yoruba_mikail", api: "https://quranenc.com/api/v1/translation/sura/yoruba_mikail/1" },
    { label: "Dutch - Dutch Islamic Center", value: "dutch_center", api: "https://quranenc.com/api/v1/translation/sura/dutch_center/1" },
    { label: "German - Abu Reda Muhammad ibn Ahmad ibn Rasoul", value: "german_bubenheim", api: "https://quranenc.com/api/v1/translation/sura/german_bubenheim/1" },
    { label: "Turkish - Rowwad Translation Center", value: "turkish_rwwad", api: "https://quranenc.com/api/v1/translation/sura/turkish_rwwad/1" },
    { label: "Spanish - Isa Garcia", value: "spanish_garcia", api: "https://quranenc.com/api/v1/translation/sura/spanish_garcia/1" },
    { label: "French - Muhammad Hamidullah", value: "french_hameedullah", api: "https://quranenc.com/api/v1/translation/sura/french_hameedullah/1" },
  ];

  // Fetch translation data based on the selected Surah and translation
  const { data: surahData, isLoading, error } = useQuery({
    queryKey: ["translation", selectedSura, selectedTranslation],
    queryFn: async () => {
      const selectedTranslationData = translations.find(t => t.value === selectedTranslation);
      if (selectedTranslationData) {
        const response = await fetch(
          `https://quranenc.com/api/v1/translation/sura/${selectedTranslationData.value}/${selectedSura}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch surah translations");
        }
        const data = await response.json();
        return data.result;
      }
      throw new Error("Translation not found");
    },
  });

  // Handle error state
  if (error) {
    return <div className="text-red-500">Failed to load translations. Please try again later.</div>;
  }

  return (
    <div className="space-y-6">
      {/* Surah Selection */}
      <div className="flex gap-4">
        <Select value={selectedSura} onValueChange={setSelectedSura}>
          <SelectTrigger className="w-[200px]">
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

        {/* Translation Selection */}
        <Select value={selectedTranslation} onValueChange={setSelectedTranslation}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select Translation" />
          </SelectTrigger>
          <SelectContent>
            {translations.map((translation) => (
              <SelectItem key={translation.value} value={translation.value}>
                {translation.label}
              </SelectItem>
            ))}
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
          {/* Display Translations */}
          <div className="space-y-6">
            {surahData?.map((ayah: any) => (
              <div key={ayah.id} className="pb-4 border-b last:border-0">
                {/* Ayah Number */}
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-muted-foreground">
                    Ayah {ayah.aya}
                  </span>
                </div>

                {/* Arabic Text */}
                <p className="text-lg leading-relaxed font-semibold text-gray-800">
                  {ayah.arabic_text}
                </p>

                {/* Translation */}
                <p className="text-base leading-relaxed text-gray-600">
                  {ayah.translation}
                </p>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};
