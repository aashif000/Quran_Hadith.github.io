import { useState, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import hadith500Data from "./data/hadith500.json"; // Path to your Hadith 500 JSON data
import debounce from "lodash/debounce"; // Import debounce function
import { VariableSizeList as List } from "react-window"; // Use VariableSizeList for dynamic item sizes
import { Skeleton } from "@/components/ui/skeleton"; // Import Skeleton component

const Hadith500 = () => {
  const [searchQuery, setSearchQuery] = useState(""); // State to hold the search query
  const [filteredHadiths, setFilteredHadiths] = useState(hadith500Data); // Store filtered hadiths
  const [isLoading, setIsLoading] = useState(false); // Loading state

  // Debounced filter function
  const debouncedFilter = useCallback(
    debounce((query) => {
      setIsLoading(true); // Set loading to true when search is initiated
      const lowerCaseQuery = query.toLowerCase();
      const result = hadith500Data.filter(
        (hadith) =>
          hadith.Introduction.toLowerCase().includes(lowerCaseQuery)
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

  // Dynamically calculate card height based on content length
  const getCardHeight = (index) => {
    const hadith = filteredHadiths[index];
    // Adjust height dynamically based on content length
    const contentLength = hadith.Introduction ? hadith.Introduction.length : 0;
    const baseHeight = 120; // Minimum height for each card
    const additionalHeight = Math.ceil(contentLength / 100) * 30; // Dynamic height based on content
    return baseHeight + additionalHeight; // Return total height
  };

  // Render a single item for VariableSizeList
  const renderHadith = ({ index, style }) => {
    const hadith = filteredHadiths[index];
    return (
      <div style={style} key={index}>
        <Card className="p-6 hover:shadow-lg transition-shadow bg-white/90 dark:bg-gray-800/90">
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b pb-2">
              <h2 className="text-xl font-semibold text-primary truncate max-w-[90%]">
                Hadith # {index + 1}
              </h2>
            </div>

            <div className="prose prose-lg dark:prose-invert max-w-none">
              <p className="whitespace-pre-line leading-relaxed">
                {hadith.Introduction?.split("\n").map((line, index) => (
                  <span key={index}>
                    {line}
                    <br />
                  </span>
                )) || "No content available for this Hadith."}
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
    <ScrollArea className="h-[calc(100vh-2rem)]">
      <div className="max-w-4xl mx-auto space-y-6 pb-8">
        <div className="text-center space-y-2 mb-8">
          <h1 className="text-3xl font-bold text-primary">Hadith 500 Collection</h1>
          <p className="text-muted-foreground">
            A collection of important Hadiths related to the teachings of Islam
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
          <List
            height={600} // Height of the visible area
            itemCount={filteredHadiths.length}
            itemSize={getCardHeight} // Use dynamic height for each item
            width="100%"
          >
            {renderHadith}
          </List>
        )}
      </div>
    </ScrollArea>
  );
};

export default Hadith500;
