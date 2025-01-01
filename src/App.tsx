// In App.tsx
import React, { useState, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QuranLayout } from "@/components/layout/QuranLayout";
import { CompleteQuran } from "@/components/quran/CompleteQuran";
import { JuzView } from "@/components/quran/JuzView";
import { RukuView } from "@/components/quran/RukuView";
import { PageView } from "@/components/quran/PageView";
import { HizbView } from "@/components/quran/HizbView";
import { SearchView } from "@/components/quran/SearchView";
import { AyahView } from "@/components/quran/AyahView";
import { ManzilView } from "@/components/quran/ManzilView";
import { Surahs } from "@/components/quran/Surahs";
import Sajda from "@/components/quran/Sajda";
import SahihBukhari from "@/components/quran/SahihBukhari";
import SahihMuslim from "./components/quran/SahihMuslim";
import MalikMut from "./components/quran/MalikMut";
import Hudsi from "./components/quran/Hudsi"; 
import Nawawi from "./components/quran/Nawawi"; 
import Hadith500 from "./components/quran/Hadith500"; 
import Audio from './components/quran/Audio'; // Make sure to import Audio
import { Languages } from './components/quran/Languages';

const queryClient = new QueryClient();

const App = () => {
  const [isMobile, setIsMobile] = useState(false);

  // Detect screen size
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); // Mobile if screen width < 768px
    };

    handleResize(); // Initial check
    window.addEventListener("resize", handleResize); // Add resize listener

    return () => window.removeEventListener("resize", handleResize); // Cleanup
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter basename="/">
          <div className={`min-h-screen flex flex-col bg-gray-50 ${isMobile ? "overflow-x-hidden" : ""}`}>
            <QuranLayout isMobile={isMobile}>
              <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-4">
                <Routes>
                  <Route path="/" element={<CompleteQuran />} />
                  <Route path="/quran" element={<CompleteQuran />} />
                  <Route path="/search" element={<SearchView />} />
                  <Route path="surahs" element={<Surahs />} />
                  <Route path="/juz" element={<JuzView />} />
                  <Route path="/ruku" element={<RukuView />} />
                  <Route path="/page" element={<PageView />} />
                  <Route path="/hizb" element={<HizbView />} />
                  <Route path="/ayah" element={<AyahView />} />
                  <Route path="/manzil" element={<ManzilView />} />
                  <Route path="/sajda" element={<Sajda />} />
                  <Route path="/sahihbukhari" element={<SahihBukhari />} /> 
                  <Route path="/sahihmuslim" element={<SahihMuslim />} />
                  <Route path="/malikmut" element={<MalikMut />} />
                  <Route path="/hudsi" element={<Hudsi />} />
                  <Route path="/nawawi" element={<Nawawi />} />
                  <Route path="/hadith500" element={<Hadith500 />} />
                  
                  <Route path="/audio" element={<Audio surahNo={1} />} /> 
                  <Route path="/languages" element={<Languages />} />
                </Routes>
              </div>
            </QuranLayout>
          </div>
        </BrowserRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
