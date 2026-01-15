
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
  const [contentItems, setContentItems] = useState<any[] | null>(null);
  const videosRef = useRef<HTMLDivElement | null>(null);
  const articlesRef = useRef<HTMLDivElement | null>(null);
  const userRole = localStorage.getItem("userRole");

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

  // napravljeno za spajanje sa bazom, ali jos nije spojeno
  const getContentItems = async () => {
    try {
      const response = await fetch(
        `https://localhost:7070/api/`, //treba dodati ostatl linka
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
  }

  // ovo nece ici u zavrsnu verziju, samo je za ubacivanje ovih pocetnih videa i clanaka u bazu
  const addContentItemToDatabase = async (item: ContentItem) => {
    try {
      const response = await fetch(
        `https://localhost:7070/api/`, //treba dodati ostatl linka
        {
          method: "POST",
          headers: {
            "Accept": "text/plain",
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("auth_token")}`,
          },
          body: `{
            "contentId": "${item.contentId}"
            "title": "${item.title}",
            "description": "${item.description}",
            "contentLink": "${item.contentLink || ""}",
            "thumbnailLink": "${item.thumbnailLink || ""}",
            "contentType": "${item.contentType}",
            "userId": "${item.userId}",
            "contentCategory": "${item.contentCategory}",
            "duration": "${item.duration || ""}"
          }`,
        }
      );

      if (!response.ok) {
        throw new Error("Something went wrong!");
      }

      console.log("Content items added successfully.");
    } catch (error) {
      console.error("Error adding content items:", error);
    }
  };

  const sampleContent : ContentItem[] = [
    {
      contentId: 1,
      contentType: "video" as const,
      title: "React Player Tutorial - Learn from Basics",
      contentLink: "https://www.youtube.com/watch?v=tVBZq2fq-WA&t=23s",
      thumbnailLink: "https://img.youtube.com/vi/tVBZq2fq-WA/maxresdefault.jpg",
      userId: "author1",
      contentCategory: "mindfulness",
      description: "A comprehensive tutorial on React Player library.",
      duration: "15"
    },
    {
      contentId: 2,
      contentType: "video" as const,
      title: "Top 5 Techniques for Web Animation",
      contentLink: "https://www.youtube.com/watch?v=9eHEOAn2FOA",
      thumbnailLink: "https://img.youtube.com/vi/9eHEOAn2FOA/maxresdefault.jpg",
      userId: "author1",
      contentCategory: "mindfulness",
      description: "Learn the top 5 techniques for creating stunning web animations.",
      duration: "10"
    },
    {
      contentId: 3,
      contentType: "video" as const,
      title: "Mindfulness Meditation for Beginners",
      contentLink: "https://www.youtube.com/watch?v=2OEL4P1Rz04",
      thumbnailLink: "https://img.youtube.com/vi/2OEL4P1Rz04/maxresdefault.jpg",
      userId: "author1",
      contentCategory: "mindfulness",
      description: "A guided mindfulness meditation session for beginners.",
      duration: "20"
    },
    {
      contentId: 4,
      contentType: "video" as const,
      title: "10 Minute Morning Yoga Flow",
      contentLink: "https://www.youtube.com/watch?v=VaoV1PrYft4",
      thumbnailLink: "https://img.youtube.com/vi/VaoV1PrYft4/maxresdefault.jpg",
      userId: "author1",
      contentCategory: "mindfulness",
      description: "Start your day with this energizing 10 minute yoga flow.",
      duration: "10"
    },
    {
      contentId: 5,
      contentType: "video" as const,
      title: "Breathing Exercises for Stress Relief",
      contentLink: "https://www.youtube.com/watch?v=tybOi4hjZFQ",
      thumbnailLink: "https://img.youtube.com/vi/tybOi4hjZFQ/maxresdefault.jpg",
      userId: "author1",
      contentCategory: "mindfulness",
      description: "Learn effective breathing exercises to help relieve stress.",
      duration: "8"
    },
    {
      contentId: 6,
      contentType: "video" as const,
      title: "Deep Sleep Meditation - Guided Relaxation",
      contentLink: "https://www.youtube.com/watch?v=1ZYbU82GVz4",
      thumbnailLink: "https://img.youtube.com/vi/1ZYbU82GVz4/maxresdefault.jpg",
      userId: "author1",
      contentCategory: "mindfulness",
      description: "A guided meditation to help you achieve deep, restful sleep.",
      duration: "30"
    },
    {
      contentId: 7,
      contentType: "article" as const,
      title: "The Science Behind Mindfulness",
      description: "Discover how mindfulness meditation affects your brain...",
      userId: "author1",
      contentCategory: "mindfulness",
    },
    {
      contentId: 8,
      contentType: "article" as const,
      title: "10 Tips for Better Sleep Quality",
      description: "Learn practical techniques to improve your sleep tonight...",
      thumbnailLink: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&q=80",
      userId: "author1",
      contentCategory: "mindfulness",
    },
  ];

  useEffect(() => {

    // aktivirati kad se spoji sa bazom
    // getContentItems();
    // if (contentItems === null || contentItems.length === 0) {
    //   setContentItems(sampleContent);
    //   sampleContent.forEach(item => {
    //     addContentItemToDatabase(item);
    //   });
    // }
    
    // maknuti kad se spoji sa bazom
    const contentFromStorage = localStorage.getItem("contentItems");
    if (contentFromStorage) {
      setContentItems(JSON.parse(contentFromStorage));
    } else {
      setContentItems(sampleContent);
      localStorage.setItem("contentItems", JSON.stringify(sampleContent));
    }
  }, []);


  const videos = contentItems?.filter((item: ContentItem) => item.contentType === "video");
  const articles = contentItems?.filter((item: ContentItem) => item.contentType === "article");

  return (
    <>
      <div className="background">
        <div className="contentContainer">
          <Header userRole={userRole || ""} />
          <div className="contentBody">
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
                  key={item.contentId} 
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
                  key={item.contentId} 
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
                <h2 className="sectionTitle">Sve</h2>
              </div>
              <div className="contentGrid">
                {contentItems?.map((item: ContentItem) => (
                  <ContentCard
                    key={item.contentId} 
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
         {isOpen && content && <ContentViewModal isOpen={isOpen} onClose={handleClose} content={content} allowEdit={userRole === "admin"} />}
        </div>
        </div>
      </div>
    </>
  );
}

export default Content;
