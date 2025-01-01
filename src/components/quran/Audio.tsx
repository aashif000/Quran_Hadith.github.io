import React, { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

// Define types for the API response
interface SurahAudioResponse {
  surahName: string;
  surahNameArabic: string;
  surahNameArabicLong: string;
  surahNameTranslation: string;
  revelationPlace: string;
  totalAyah: number;
  surahNo: number;
  audio: { [key: string]: { reciter: string; url: string; originalUrl: string } };
}

// Fetch Surah data from a given URL
const fetchSurah = async (surahNo: number): Promise<SurahAudioResponse> => {
  const response = await fetch(`https://quranapi.pages.dev/api/${surahNo}.json`);
  if (!response.ok) {
    throw new Error(`Failed to fetch Surah ${surahNo}`);
  }
  return response.json();
};

const SurahList = () => {
  const [surahs, setSurahs] = useState<SurahAudioResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [playingSurah, setPlayingSurah] = useState<number | null>(null); // Track which Surah is playing
  const [selectedReciters, setSelectedReciters] = useState<{ [key: number]: string }>({});
  const audioRef = useRef<HTMLAudioElement | null>(null); // Ref for the audio object

  // Fetch all 114 Surahs
  useEffect(() => {
    const fetchAllSurahs = async () => {
      try {
        setIsLoading(true);
        const surahPromises = Array.from({ length: 114 }, (_, i) => fetchSurah(i + 1));
        const results = await Promise.all(surahPromises);
        setSurahs(results);
      } catch (error) {
        console.error("Error fetching Surahs:", error);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllSurahs();
  }, []);

  // Handle audio playback
  const handlePlay = (audioUrl: string, surahNo: number) => {
    if (audioRef.current) {
      audioRef.current.pause(); // Stop any currently playing audio
      audioRef.current = null;
    }

    const audio = new Audio(audioUrl);
    audioRef.current = audio;
    audio.play();
    setPlayingSurah(surahNo);

    audio.onended = () => {
      setPlayingSurah(null); // Reset when audio finishes
      audioRef.current = null;
    };
  };

  // Handle audio stop
  const handleStop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0; // Reset audio to the beginning
      setPlayingSurah(null);
    }
  };

  // Handle reciter selection
  const handleReciterChange = (surahNo: number, reciterUrl: string) => {
    setSelectedReciters((prev) => ({ ...prev, [surahNo]: reciterUrl }));
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(10)].map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  if (isError) {
    return <div>Error loading Surahs. Please try again later.</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {surahs.map((surah) => {
        const reciters = Object.entries(surah.audio).map(([key, value]) => ({
          reciterName: value.reciter,
          audioUrl: value.url,
        }));

        return (
          <Card key={surah.surahNo} className="p-4 bg-white/90 dark:bg-gray-800/90">
            <h3 className="text-xl font-bold">{surah.surahName}</h3>
            <p className="text-gray-600">{surah.surahNameTranslation}</p>
            <p className="text-gray-500">{surah.surahNameArabicLong}</p>
            <p className="text-sm text-gray-400">
              Revelation: {surah.revelationPlace}, Ayahs: {surah.totalAyah}
            </p>

            {reciters.length > 0 && (
              <div className="mt-4">
                <Select
                  value={selectedReciters[surah.surahNo] || reciters[0].audioUrl}
                  onValueChange={(value) => handleReciterChange(surah.surahNo, value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Reciter" />
                  </SelectTrigger>
                  <SelectContent>
                    {reciters.map((reciter, index) => (
                      <SelectItem key={index} value={reciter.audioUrl}>
                        {reciter.reciterName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {selectedReciters[surah.surahNo] && (
              <div className="mt-4 flex space-x-4">
                <button
                  onClick={() => handlePlay(selectedReciters[surah.surahNo], surah.surahNo)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md"
                  disabled={playingSurah === surah.surahNo} // Disable play button if the Surah is already playing
                >
                  {playingSurah === surah.surahNo ? "Playing..." : "Play"}
                </button>
                <button
                  onClick={handleStop}
                  className="px-4 py-2 bg-red-500 text-white rounded-md"
                  disabled={playingSurah !== surah.surahNo} // Disable stop button if this Surah isn't playing
                >
                  Stop
                </button>
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
};

export default SurahList;
