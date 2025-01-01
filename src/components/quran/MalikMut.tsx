import React, { useState, useEffect } from "react";
import sahihBukhari from "./data/malik_muwatta.json"; // Adjust the path as needed
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton"; // Import Skeleton component

const MalikMut = () => {
  const [searchQuery, setSearchQuery] = useState(""); // Store the search query
  const [filteredHadiths, setFilteredHadiths] = useState(sahihBukhari); // Store the filtered hadiths
  const [isLoading, setIsLoading] = useState(false); // Loading state

  // Search filter function
  const filterHadiths = (query: string) => {
    setIsLoading(true); // Show loading indicator
    const lowerCaseQuery = query.toLowerCase();
    const result = sahihBukhari.filter(
      (hadith) =>
        hadith.Heading.toLowerCase().includes(lowerCaseQuery) ||
        hadith.Content.toLowerCase().includes(lowerCaseQuery)
    );
    setFilteredHadiths(result); // Update filtered hadiths
    setIsLoading(false); // Hide loading indicator
  };

  useEffect(() => {
    filterHadiths(searchQuery); // Apply filter whenever search query changes
  }, [searchQuery]);

  // Handle input change for search query
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <div className="text-center space-y-2 mb-8">
        <h1 className="text-3xl font-bold text-primary">Malik Muwatta Collection</h1>
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
          {/* Render filtered Hadiths */}
          {filteredHadiths.length === 0 ? (
            <div className="flex justify-center items-center h-[60vh]">
              <p className="text-lg text-muted-foreground">No Hadiths found.</p>
            </div>
          ) : (
            filteredHadiths.map((hadith, index) => (
              <Card
                key={index}
                className="p-6 hover:shadow-lg transition-shadow bg-white/90 dark:bg-gray-800/90"
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b pb-2">
                    <h2 className="text-xl font-semibold text-primary truncate max-w-[90%]">
                      {hadith.Heading || "No Title"}
                    </h2>
                    <span className="text-sm px-3 py-1 bg-primary/10 rounded-full text-primary">
                      Hadith #{hadith.Reference || "N/A"}
                    </span>
                  </div>

                  <div className="prose prose-lg dark:prose-invert max-w-none">
                    <p className="whitespace-pre-line leading-relaxed">
                      {hadith.Content?.split(" ").filter(Boolean).join(" ") ||
                        "No content available for this hadith."}
                    </p>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default MalikMut;
