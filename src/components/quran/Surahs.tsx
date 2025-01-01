import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input"; // Assuming you have an input component for search

// Main Component for Surahs
export const Surahs = () => {
  const [searchTerm, setSearchTerm] = useState(""); // Search term for filtering
  const [selectedSurah, setSelectedSurah] = useState<number | null>(null); // Selected Surah for details
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility state

  // Fetch Surah list from API
  const { data: surahData, isLoading } = useQuery({
    queryKey: ["surahs"],
    queryFn: async () => {
      const response = await fetch("https://api.alquran.cloud/v1/surah");
      const data = await response.json();
      return data.data;
    },
  });

  // Fetch details of selected Surah (Arabic Text)
  const { data: arabicData, isLoading: isArabicLoading } = useQuery(
    {
      queryKey: ["surahDetailsArabic", selectedSurah],
      queryFn: async () => {
        if (selectedSurah === null) return null;
        const response = await fetch(
          `https://api.alquran.cloud/v1/surah/${selectedSurah}`
        );
        const data = await response.json();
        return data.data;
      },
      enabled: selectedSurah !== null, // Only fetch if a Surah is selected
    }
  );

  // Fetch English translation for the selected Surah
  const { data: englishData, isLoading: isEnglishLoading } = useQuery(
    {
      queryKey: ["surahDetailsEnglish", selectedSurah],
      queryFn: async () => {
        if (selectedSurah === null) return null;
        const response = await fetch(
          `https://api.alquran.cloud/v1/surah/${selectedSurah}/en.asad`
        );
        const data = await response.json();
        return data.data;
      },
      enabled: selectedSurah !== null, // Only fetch if a Surah is selected
    }
  );

  // Filter Surahs based on search term (exact match for numbers)
  const filteredSurahs = surahData?.filter((surah: any) => {
    const surahText = surah.englishName.toLowerCase();
    // Match the number exactly or the name
    return (
      surahText.includes(searchTerm.toLowerCase()) ||
      surah.number.toString() === searchTerm
    );
  });

  // Open the modal with Surah details
  const openModal = (surahNumber: number) => {
    setSelectedSurah(surahNumber);
    setIsModalOpen(true);
  };

  // Close the modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedSurah(null);
  };

  return (
    <div className="space-y-6">
      {/* Search Input */}
      <Input
        type="text"
        placeholder="Search Surah by Name or Number"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full max-w-[300px] p-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {/* Surah Cards */}
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filteredSurahs?.map((surah: any) => (
            <Card
              key={surah.number}
              className="cursor-pointer p-4 rounded-lg shadow-lg transition-transform transform hover:scale-105 hover:bg-gray-100 hover:shadow-xl"
              onClick={() => openModal(surah.number)}
            >
              <div className="space-y-2">
                {/* Surah Name */}
                <h3 className="text-xl font-semibold text-gray-800">{surah.englishName}</h3>
                {/* Surah Number */}
                <p className="text-sm text-gray-500">Surah Number: {surah.number}</p>
              </div>
              <div className="mt-2">
                {/* Surah Name in Arabic */}
                <p className="text-lg text-gray-600">{surah.name}</p>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Pop-up Modal for Surah Details */}
      {isModalOpen && arabicData && englishData && !isArabicLoading && !isEnglishLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          {/* Close Button Outside the Modal */}
          <button
            className="absolute top-2 right-2 text-white text-4xl hover:text-gray-300"
            onClick={closeModal}
          >
            ×
          </button>

          <div className="bg-white p-8 w-[90vw] max-w-[1000px] h-[90vh] rounded-lg shadow-lg relative overflow-auto">
            <h2 className="text-2xl font-semibold mb-6">{arabicData.englishName}</h2>
            <div className="flex space-x-6 h-full">
              {/* Arabic Text Column */}
              <div className="w-full sm:w-1/2 overflow-y-auto pr-4 border-r border-gray-200 max-h-[70vh]">
                <h3 className="text-xl font-semibold mb-4">Arabic</h3>
                {arabicData.ayahs.map((ayah: any, index: number) => (
                  <div key={ayah.number} className="space-y-3">
                    <p className="text-2xl font-arabic">{ayah.text}</p>
                    <p className="text-sm text-muted-foreground">{`Ayah ${ayah.numberInSurah}`}</p>
                  </div>
                ))}
              </div>

              {/* English Text Column */}
              <div className="w-full sm:w-1/2 overflow-y-auto pl-4 max-h-[70vh]">
                <h3 className="text-xl font-semibold mb-4">English Translation</h3>
                {englishData.ayahs.map((ayah: any, index: number) => (
                  <div key={ayah.number} className="space-y-3">
                    <p className="text-xl">{ayah.text}</p>
                    <p className="text-sm text-muted-foreground">{`Ayah ${ayah.numberInSurah}`}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
