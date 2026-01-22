
import { useState, useRef, useEffect } from "react";
import "./App.css";
import Header from "./components/Header";
import ContentViewModal from "./components/ContentViewModal";
import ContentCard from "./components/ContentCard";
import { CaretLeftIcon, CaretRightIcon } from "@phosphor-icons/react";
import type { ContentItem } from "./types/ContentItem";
import "./Content.css"

function Content() {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState<ContentItem | null>(null);
  const [contentItems, setContentItems] = useState<ContentItem[] | null>(null);
  const videosRef = useRef<HTMLDivElement | null>(null);
  const articlesRef = useRef<HTMLDivElement | null>(null);
  const userRole = localStorage.getItem("userRole");
  
  // Search state
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<"all" | "video" | "article">("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [categories, setCategories] = useState<any[]>([]);

  const handleClose = () => {
    setIsOpen(false);
  };

  const scroll = (ref: React.RefObject<HTMLDivElement | null>, direction: 'left' | 'right') => {
    if (ref.current) {
      const scrollAmount = 300;
      ref.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const getContentItems = async () => {
    try {
      const response = await fetch(
        `https://localhost:7070/api/content`,
        {
          method: "GET",
          headers: {
            "Accept": "text/plain",
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("auth_token")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Something went wrong!");
      }

      const contentItemsData = await response.json();
      setContentItems(contentItemsData);
    } catch (error) {
      console.error("Error fetching content items:", error);
    }
  };

  
  useEffect(() => {
    getContentItems();
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const stored = sessionStorage.getItem("categories");
      if (stored) {
        setCategories(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // Filter function
  const filterContent = (items: ContentItem[] | null) => {
    if (!items) return [];
    
    return items.filter(item => {
      const matchesSearch = item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ?? true;
      const matchesType = selectedType === "all" || item.contentType === selectedType;
      const matchesCategory = selectedCategory === "all" || item.categoryId === selectedCategory;
      
      return matchesSearch && matchesType && matchesCategory;
    });
  };

  const filteredContent = filterContent(contentItems);
  const videos = filteredContent?.filter((item: ContentItem) => item.contentType === "video");
  const articles = filteredContent?.filter((item: ContentItem) => item.contentType === "article");
  
  // Check if search is active
  const isSearchActive = searchTerm !== "" || selectedType !== "all" || selectedCategory !== "all";

  return (
    <>
      <div className="background">
        <div className="contentContainer">
          <Header userRole={userRole || ""} />
          
          {/* Search Section */}
          <div className="searchSection">
            <div className="searchContainer">
              <input
                type="text"
                className="searchInput"
                placeholder="Pretraži po nazivu..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              
              <select
                className="searchSelect"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value as "all" | "video" | "article")}
              >
                <option value="all">Svi tipovi</option>
                <option value="video">Video</option>
                <option value="article">Članak</option>
              </select>
              
              <select
                className="searchSelect"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="all">Sve kategorije</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="contentBody">
            {!isSearchActive && (
              <>
                <div className="section">
                <div className="sectionHeader">
                  <h2 className="sectionTitle">Video sadržaji</h2>
                  <div className="scrollButtons">
                    <button onClick={() => scroll(videosRef, 'left')} className="scrollBtn"><CaretLeftIcon size={20} /></button>
                    <button onClick={() => scroll(videosRef, 'right')} className="scrollBtn"><CaretRightIcon size={20} /></button>
                  </div>
                </div>
                <div className="contentList" ref={videosRef}>
                  {videos?.map((item : ContentItem) => (
                    <ContentCard
                      key={item.id} 
                      content={item}
                      onClick={() => {
                        setContent(item);
                        setIsOpen(true);
                      }}
                      allowEdit={userRole === "admin"}
                    />
                  ))}
                </div>
                </div>

                <div className="section">
                <div className="sectionHeader">
                  <h2 className="sectionTitle">Članci</h2>
                  <div className="scrollButtons">
                    <button onClick={() => scroll(articlesRef, 'left')} className="scrollBtn"><CaretLeftIcon size={20} /></button>
                    <button onClick={() => scroll(articlesRef, 'right')} className="scrollBtn"><CaretRightIcon size={20} /></button>
                  </div>
                </div>
                <div className="contentList" ref={articlesRef}>
                  {articles?.map((item : ContentItem) => (
                    <ContentCard
                      key={item.id} 
                      content={item}
                      onClick={() => {
                        setContent(item);
                        setIsOpen(true);
                      }}
                      allowEdit={userRole === "admin"}
                    />
                  ))}
                </div>
                </div>
              </>
            )}

            <div className="section">
              <div className="sectionHeader">
                <h2 className="sectionTitle">{isSearchActive ? "Rezultati pretrage" : "Sve"}</h2>
              </div>
              <div className="contentGrid">
                {filteredContent?.map((item: ContentItem) => (
                  <ContentCard
                    key={item.id} 
                    content={item}
                    onClick={() => {
                      setContent(item);
                      setIsOpen(true);
                    }}
                    allowEdit={userRole === "admin"} 
                  />
                ))}
              </div>

            </div>
         {isOpen && content && <ContentViewModal isOpen={isOpen} onClose={() => { handleClose(); getContentItems(); }} content={content} allowEdit={userRole === "admin"} />}
        </div>
        </div>
      </div>
    </>
  );
}

export default Content;
