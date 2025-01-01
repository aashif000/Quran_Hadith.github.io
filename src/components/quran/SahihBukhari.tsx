import { useState, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import sahihBukhari from "./data/sahih_bukhari.json"; // Adjust the path as needed
import debounce from "lodash/debounce"; // Import debounce function
import { Skeleton } from "@/components/ui/skeleton"; // Import Skeleton component

interface Hadith {
  Heading: string;
  Content: string;
  Reference?: string;
}

const SahihBukhari = () => {
  const [searchQuery, setSearchQuery] = useState(""); // State to hold the search query
  const [filteredHadiths, setFilteredHadiths] = useState(sahihBukhari); // Store filtered hadiths
  const [isLoading, setIsLoading] = useState(false); // Loading state

  // Debounced filter function
  const debouncedFilter = useCallback(
    debounce((query) => {
      setIsLoading(true); // Set loading to true when search is initiated
      const lowerCaseQuery = query.toLowerCase();
      const result = sahihBukhari.filter(
        (hadith) =>
          hadith.Heading.toLowerCase().includes(lowerCaseQuery) ||
          hadith.Content.toLowerCase().includes(lowerCaseQuery)
      );
      setFilteredHadiths(result); // Update filtered hadiths
      setIsLoading(false); // Set loading to false after filtering is done
    }, 300), // Delay of 300ms
    []
  );

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query); // Update the search query
  };

  const handleSearchSubmit = () => {
    debouncedFilter(searchQuery); // Call the debounced filter function
  };

  // Highlight the text matching the search query
  const highlightText = (text: string, query: string) => {
    if (!query) return text; // If no query, return the text as it is
    const regex = new RegExp(`(${query})`, "gi"); // Case-insensitive regex to match the query
    return text.split(regex).map((part, index) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <span key={index} className="bg-yellow-200">{part}</span>
      ) : (
        part
      )
    );
  };

  // Dynamically calculate card height based on content length
  const getCardHeight = (index) => {
    const hadith = filteredHadiths[index];
    const contentLength = hadith.Content ? hadith.Content.length : 0;
    const headingLength = hadith.Heading ? hadith.Heading.length : 0;
    const baseHeight = 120; // Minimum height for each card
    const additionalHeight = Math.ceil((contentLength + headingLength) / 100) * 30; // Dynamic height based on content
    return baseHeight + additionalHeight; // Return total height
  };

  // Render a single item for VariableSizeList
  const renderHadith = ({ index, style }) => {
    const hadith = filteredHadiths[index];
    return (
      <div style={style} key={hadith.Reference || index}>
        <Card className="p-6 hover:shadow-lg transition-shadow bg-white/90 dark:bg-gray-800/90">
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b pb-2">
              <h2 className="text-xl font-semibold text-primary truncate max-w-[90%]">
                {highlightText(hadith.Heading || "No Title", searchQuery)}
              </h2>
              <span className="text-sm px-3 py-1 bg-primary/10 rounded-full text-primary">
                Hadith #{hadith.Reference || "N/A"}
              </span>
            </div>

            <div className="prose prose-lg dark:prose-invert max-w-none">
              <p className="whitespace-pre-line leading-relaxed">
                {highlightText(hadith.Content || "No content available for this hadith.", searchQuery)}
              </p>
            </div>
          </div>
        </Card>
      </div>
    );
  };

  if (!filteredHadiths || filteredHadiths.length === 0) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <p className="text-lg text-muted-foreground">No Hadiths found.</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[calc(100vh-2rem)] overflow-y-auto">
      <div className="max-w-4xl mx-auto space-y-6 pb-8">
        <div className="text-center space-y-2 mb-8">
          <h1 className="text-3xl font-bold text-primary">Sahih Bukhari Collection</h1>
          <p className="text-muted-foreground">
            One of the most authentic collections of the Prophet's (ﷺ) traditions
          </p>

          {/* Search input and button */}
          <div className="flex items-center justify-center space-x-4">
            <input
              type="text"
              placeholder="Search Hadith..."
              className="w-3/4 px-4 py-2 border border-gray-300 rounded-lg dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
              value={searchQuery}
              onChange={handleSearchChange}
            />
            <button
              onClick={handleSearchSubmit}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/80 transition"
            >
              Search
            </button>
          </div>
        </div>

        {/* Show skeleton loader if loading */}
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="w-full h-20 mb-4" />
            <Skeleton className="w-full h-20 mb-4" />
            <Skeleton className="w-full h-20 mb-4" />
          </div>
        ) : (
          <div className="space-y-4">
            {filteredHadiths.map((hadith, index) => (
              <div key={index} className="flex flex-col space-y-4">
                <div className="flex-grow">
                  {renderHadith({ index, style: {} })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </ScrollArea>
  );
};

export default SahihBukhari;
