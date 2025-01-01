import { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

// Function to fetch data from both APIs concurrently
const fetchManzilData = async (manzilNumber: string) => {
  const api1 = `https://api.alquran.cloud/v1/manzil/${manzilNumber}/en.asad`; // First API (translation)
  const api2 = `https://api.alquran.cloud/v1/manzil/${manzilNumber}/quran-uthmani`; // Second API (Uthmani script)

  const [response1, response2] = await Promise.all([fetch(api1), fetch(api2)]);

  // Check for successful responses before parsing JSON
  if (!response1.ok || !response2.ok) {
    throw new Error("Failed to fetch data from one or more APIs");
  }

  const data1 = await response1.json();
  const data2 = await response2.json();

  return { data1: data1.data, data2: data2.data };
};

export const ManzilView = () => {
  const [manzilNumber, setManzilNumber] = useState("7");

  // Fetch the data only when a Manzil is selected
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["manzil", manzilNumber],
    queryFn: () => fetchManzilData(manzilNumber),
    enabled: false, // Disable automatic fetching, fetch only when manually triggered
    staleTime: 5 * 60 * 1000, // Cache the data for 5 minutes to avoid unnecessary refetching
    retry: 1, // Retry once in case of failure
  });

  // Memoized handler for Manzil selection
  const handleManzilSelect = useCallback(
    (number: string) => {
      setManzilNumber(number);
      refetch(); // Refetch data for the selected Manzil
    },
    [refetch]
  );

  // Display error if fetching fails
  if (error) {
    return (
      <div className="text-center text-red-500">
        <p>Error: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="space-y-4">
          {/* Manzil Selection */}
          <div className="flex gap-4">
            <div className="flex-1">
              <h2 className="text-xl font-bold">Select a Manzil (Double click to Open)</h2>
              <div className="grid grid-cols-3 gap-4 mt-4">
                {[1, 2, 3, 4, 5, 6, 7].map((number) => (
                  <Button
                    key={number}
                    onClick={() => handleManzilSelect(number.toString())}
                    className="w-full"
                    disabled={isLoading}
                  >
                    Manzil {number}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Display Data */}
          {isLoading ? (
            <div className="flex justify-center">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : (
            data?.data1?.ayahs && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold">Manzil {manzilNumber}</h3>
                {/* Display both translations and Uthmani script on the same line */}
                <div className="space-y-6">
                  {data.data1.ayahs.map((ayah: any, index: number) => (
                    <div
                      key={ayah.number}
                      className="space-y-2 border-b border-border pb-4 last:border-0"
                    >
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
                          {data.data2.ayahs[index]?.text}
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Surah {ayah.surah.name} - Verse {ayah.numberInSurah}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          )}
        </div>
      </Card>
    </div>
  );
};
