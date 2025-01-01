import React, { useState, useEffect, useCallback, useMemo } from "react";
import sahihMuslim from "./data/sahih_muslim.json"; // Adjust the path as needed
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton"; // Import Skeleton component
import debounce from "lodash/debounce"; // Import debounce function
import { VariableSizeList as List } from "react-window"; // Import react-window for virtualization

const SahihMuslim = () => {
  const [searchQuery, setSearchQuery] = useState(""); // Store the search query
  const [filteredHadiths, setFilteredHadiths] = useState(sahihMuslim); // Store the filtered hadiths
  const [isLoading, setIsLoading] = useState(false); // Loading state

  // Debounced filter function
  const debouncedFilter = useCallback(
    debounce((query) => {
      setIsLoading(true); // Set loading to true when search is initiated
      const lowerCaseQuery = query.toLowerCase();
      const result = sahihMuslim.filter(
        (hadith) =>
          hadith.Heading.toLowerCase().includes(lowerCaseQuery) ||
          hadith.Content.toLowerCase().includes(lowerCaseQuery)
      );
      setFilteredHadiths(result); // Update filtered hadiths
      setIsLoading(false); // Set loading to false after filtering is done
    }, 300), // Delay of 300ms
    []
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value); // Update the search query
    debouncedFilter(e.target.value); // Trigger debounced filter
  };

  const highlightText = (text: string, query: string) => {
    if (!query) return text;
    const parts = text.split(new RegExp(`(${query})`, "gi"));
    return parts.map((part, index) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <span key={index} className="bg-yellow-200">{part}</span>
      ) : (
        part
      )
    );
  };

  // Dynamically calculate card height based on content length
  const getCardHeight = (index: number) => {
    const hadith = filteredHadiths[index];
    const contentLength = hadith.Content ? hadith.Content.length : 0;
    const headingLength = hadith.Heading ? hadith.Heading.length : 0;
    const baseHeight = 120; // Base height for each card
    const additionalHeight = Math.ceil((contentLength + headingLength) / 100) * 30; // Dynamic height based on content
    return baseHeight + additionalHeight;
  };

  // Memoize the list item heights to avoid unnecessary recalculations
  const itemHeights = useMemo(() => {
    return filteredHadiths.map((_, index) => getCardHeight(index));
  }, [filteredHadiths]);

  if (!filteredHadiths || filteredHadiths.length === 0) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <p className="text-lg text-muted-foreground">No Hadiths found.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <div className="text-center space-y-2 mb-8">
        <h1 className="text-3xl font-bold text-primary">Sahih Muslim Collection</h1>
        <p className="text-muted-foreground">
          One of the most authentic collections of the Prophet's (ﷺ) traditions
        </p>

        {/* Search input */}
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

      {/* Show skeleton loader if loading */}
      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="w-full h-20 mb-4" />
          <Skeleton className="w-full h-20 mb-4" />
          <Skeleton className="w-full h-20 mb-4" />
        </div>
      ) : (
        <div className="space-y-6">
          {/* Virtualized list to avoid card overlap */}
          <List
            height={window.innerHeight - 200} // Adjust based on the visible area
            itemCount={filteredHadiths.length}
            itemSize={(index) => itemHeights[index]} // Dynamic height based on content
            width="100%"
          >
            {({ index, style }) => {
              const hadith = filteredHadiths[index];
              return (
                <div style={style} key={index}>
                  <Card className="p-6 hover:shadow-lg transition-shadow bg-white/90 dark:bg-gray-800/90 rounded-lg shadow-lg">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center border-b pb-2">
                        <h2 className="text-xl font-semibold text-primary truncate max-w-[90%]">
                          {highlightText(hadith.Heading, searchQuery) || "No Title"}
                        </h2>
                        <span className="text-sm px-3 py-1 bg-primary/10 rounded-full text-primary">
                          Hadith #{hadith.Reference || "N/A"}
                        </span>
                      </div>

                      <div className="prose prose-lg dark:prose-invert max-w-none">
                        <p className="whitespace-pre-line leading-relaxed">
                          {highlightText(hadith.Content, searchQuery) ||
                            "No content available for this hadith."}
                        </p>
                      </div>
                    </div>
                  </Card>
                </div>
              );
            }}
          </List>
        </div>
      )}
    </div>
  );
};

export default SahihMuslim;
