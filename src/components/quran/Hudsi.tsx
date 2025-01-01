import { useState, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import sahihBukhari from "./data/sahih_bukhari.json"; // Adjust the path as needed
import debounce from "lodash/debounce";

interface Hadith {
  Heading: string;
  Content: string;
  Reference?: string;
}

const Hudsi = () => {
  const [searchQuery, setSearchQuery] = useState<string>(""); // Search query state
  const [filteredHadiths, setFilteredHadiths] = useState<Hadith[]>(sahihBukhari as Hadith[]); // Type as array of Hadith
  const [isLoading, setIsLoading] = useState<boolean>(false); // Loading state

  const debouncedFilter = useCallback(
    debounce((query: string) => {
      setIsLoading(true);
      const lowerCaseQuery = query.toLowerCase();
      const result = sahihBukhari.filter(
        (hadith: Hadith) =>
          hadith.Heading.toLowerCase().includes(lowerCaseQuery) ||
          hadith.Content.toLowerCase().includes(lowerCaseQuery)
      );
      setFilteredHadiths(result);
      setIsLoading(false);
    }, 300),
    []
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    debouncedFilter(query);
  };

  const renderHadith = (hadith: Hadith, index: number) => (
    <Card key={index} className="p-6 hover:shadow-lg transition-shadow bg-white/90 dark:bg-gray-800/90 rounded-lg">
      <div className="space-y-6">
        <div className="border-b pb-4">
          <h2 className="text-xl font-semibold text-primary truncate">
            {hadith.Heading || "No Title"}
          </h2>
          <span className="text-sm px-3 py-1 bg-primary/10 rounded-full text-primary mt-2 inline-block">
            Hadith #{hadith.Reference || "N/A"}
          </span>
        </div>
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <p className="whitespace-pre-line leading-relaxed">
            {hadith.Content || "No content available for this hadith."}
          </p>
        </div>
      </div>
    </Card>
  );

  if (!filteredHadiths || filteredHadiths.length === 0) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <p className="text-lg text-muted-foreground">No Hadiths found.</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[calc(100vh-2rem)]">
      <div className="max-w-4xl mx-auto space-y-6 pb-8">
        <div className="text-center space-y-2 mb-8">
          <h1 className="text-3xl font-bold text-primary">Hudsi Collection</h1>
          <p className="text-muted-foreground">
            One of the most authentic collections of the Prophet's (ﷺ) traditions
          </p>
          <div className="flex items-center justify-center space-x-4">
            <input
              type="text"
              placeholder="Search Hadith..."
              className="w-3/4 px-4 py-2 border border-gray-300 rounded-lg dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
        </div>
        <div className="space-y-4">
          {filteredHadiths.map((hadith, index) => renderHadith(hadith, index))}
        </div>
      </div>
    </ScrollArea>
  );
};

export default Hudsi;
