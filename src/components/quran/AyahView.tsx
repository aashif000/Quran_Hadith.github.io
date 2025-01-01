import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAyah } from "@/services/quranService";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export const AyahView = () => {
  const [reference, setReference] = useState("");
  const [edition, setEdition] = useState("en.asad");

  const { data, isLoading, refetch, isError } = useQuery({
    queryKey: ["ayah", reference, edition],
    queryFn: () => getAyah(reference, edition),
    enabled: false,
  });

  const handleSearch = () => {
    if (reference) {
      refetch();
    }
  };

  return (
    <div className="bg-white min-h-screen text-gray-900">
      <div className="max-w-screen-lg mx-auto p-6 w-full">
        <Card className="p-8 bg-white rounded-lg shadow-lg border border-gray-200">
          <div className="space-y-6">
            <div className="flex gap-6 items-center">
              <Input
                placeholder="Enter ayah reference (e.g., 2:255 or 262)"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                className="flex-1 p-4 text-lg rounded-lg border border-gray-300"
              />
              <Button
                onClick={handleSearch}
                disabled={isLoading}
                className="p-4 text-lg bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  "Search"
                )}
              </Button>
            </div>

            {isError && (
              <div className="text-red-500 text-center">
                <p>Sorry, we couldn't find the ayah. Please check the reference and try again.</p>
              </div>
            )}

            {data?.data && (
              <div className="space-y-4">
                <div className="text-3xl font-arabic text-right leading-relaxed">
                  {data.data.text}
                </div>
                {data.data.translation && (
                  <div className="text-lg text-gray-800 italic">
                    {data.data.translation}
                  </div>
                )}
                <div className="text-sm text-gray-600">
                  Surah {data.data.surah.name} ({data.data.surah.englishName}) - Verse{" "}
                  {data.data.numberInSurah}
                </div>
              </div>
            )}

            {!data?.data && !isLoading && (
              <div className="text-gray-600 text-center">
                <p>No data found. Please try searching for a different ayah.</p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};
