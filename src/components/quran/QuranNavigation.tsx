import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Search, Book, Bookmark, Scroll, BookOpen, FileText, SplitSquareHorizontal } from "lucide-react";
import SurahView from "./SurahView";
import { JuzView } from "./JuzView";
import { SearchView } from "./SearchView";

const QuranNavigation = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <Card className="p-6 bg-gradient-to-br from-emerald-50 to-blue-50 dark:from-emerald-950 dark:to-blue-950 shadow-lg">
      <div className="space-y-6">
        <div className="relative">
          <Input
            placeholder="Search the Quran..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm"
          />
          <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
        </div>

        <Tabs defaultValue="surah" className="w-full">
          <TabsList className="grid grid-cols-3 lg:grid-cols-6 gap-2 bg-white/80 dark:bg-gray-800/80 p-1 rounded-lg">
            <TabsTrigger value="surah" className="flex items-center gap-2">
              <Book className="h-4 w-4" /> Surah
            </TabsTrigger>
            <TabsTrigger value="juz" className="flex items-center gap-2">
              <Bookmark className="h-4 w-4" /> Juz
            </TabsTrigger>
            <TabsTrigger value="ruku" className="flex items-center gap-2">
              <Scroll className="h-4 w-4" /> Ruku
            </TabsTrigger>
            <TabsTrigger value="page" className="flex items-center gap-2">
              <FileText className="h-4 w-4" /> Page
            </TabsTrigger>
            <TabsTrigger value="hizb" className="flex items-center gap-2">
              <SplitSquareHorizontal className="h-4 w-4" /> Hizb
            </TabsTrigger>
            <TabsTrigger value="search" className="flex items-center gap-2">
              <Search className="h-4 w-4" /> Search
            </TabsTrigger>
          </TabsList>

          <TabsContent value="surah" className="mt-6">
            <SurahView />
          </TabsContent>
          <TabsContent value="juz" className="mt-6">
            <JuzView />
          </TabsContent>
          <TabsContent value="search" className="mt-6">
            <SearchView searchQuery={searchQuery} />
          </TabsContent>
        </Tabs>
      </div>
    </Card>
  );
};

export default QuranNavigation;