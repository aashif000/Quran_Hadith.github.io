import {
  Search,
  Book,
  Bookmark,
  Layout,
  FileText,
  BookOpen,
  FileText as AyahIcon,
  BookMarked,
  Star,
  Music,
  Library,
  ScrollText,
  Globe, // Icon for Languages
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useNavigate } from "react-router-dom";

export const QuranSidebar = () => {
  const navigate = useNavigate();

  const menuItems = [
    { icon: Search, label: "Search", path: "/search" },
    { icon: Book, label: "Complete Quran", path: "/quran" },
    { icon: Globe, label: "Quran in Wide Languages", path: "/languages" }, 
    { icon: Book, label: "Surahs", path: "/surahs" }, 
    { icon: Music, label: "Audio", path: "/audio" },
    { icon: Bookmark, label: "Juz", path: "/juz" },
    { icon: Layout, label: "Ruku", path: "/ruku" },
    { icon: FileText, label: "Page", path: "/page" },
    { icon: BookOpen, label: "Hizb Quarter", path: "/hizb" },
    { icon: AyahIcon, label: "Ayah", path: "/ayah" },
    { icon: BookMarked, label: "Manzil", path: "/manzil" },
    { icon: Star, label: "Sajda", path: "/sajda" },
    { icon: Library, label: "Sahih Bukhari", path: "/sahihbukhari" },
    { icon: Library, label: "Sahih Muslim", path: "/sahihmuslim" },
    { icon: ScrollText, label: "Malik Muwatta", path: "/malikmut" },
    { icon: ScrollText, label: "Hudsi", path: "/hudsi" },
    { icon: ScrollText, label: "Nawawi", path: "/nawawi" },
    { icon: ScrollText, label: "Hadith 500", path: "/hadith500" },
    
     
  ];

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Quran & Hadiths</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton onClick={() => navigate(item.path)} className="w-full">
                    <item.icon className="w-4 h-4 mr-2" />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};
