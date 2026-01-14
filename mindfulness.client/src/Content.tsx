
import { useState, useRef } from "react";
import "./App.css";
import Header from "./components/Header";
import ContentViewModal from "./components/ContentViewModal";
import ContentCard from "./components/ContentCard";
import { CaretLeftIcon, CaretRightIcon } from "@phosphor-icons/react";
import "./Content.css"

function Content() {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState<any>(null);
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

  const sampleContent = localStorage.getItem("contentItems") ? JSON.parse(localStorage.getItem("contentItems") || "[]") : [
    {
      contentId: 1,
      type: "video" as const,
      title: "React Player Tutorial - Learn from Basics",
      videoLink: "https://www.youtube.com/watch?v=tVBZq2fq-WA&t=23s",
      posterLink: "https://img.youtube.com/vi/tVBZq2fq-WA/maxresdefault.jpg",
      authorId: "author1",
      category: "mindfulness",
      description: "A comprehensive tutorial on React Player library.",
      duration: "15"
    },
    {
      contentId: 2,
      type: "video" as const,
      title: "Top 5 Techniques for Web Animation",
      videoLink: "https://www.youtube.com/watch?v=9eHEOAn2FOA",
      posterLink: "https://img.youtube.com/vi/9eHEOAn2FOA/maxresdefault.jpg",
      authorId: "author1",
      category: "mindfulness",
      description: "Learn the top 5 techniques for creating stunning web animations.",
      duration: "10"
    },
    {
      contentId: 3,
      type: "video" as const,
      title: "Mindfulness Meditation for Beginners",
      videoLink: "https://www.youtube.com/watch?v=2OEL4P1Rz04",
      posterLink: "https://img.youtube.com/vi/2OEL4P1Rz04/maxresdefault.jpg",
      authorId: "author1",
      category: "mindfulness",
      description: "A guided mindfulness meditation session for beginners.",
      duration: "20"
    },
    {
      contentId: 4,
      type: "video" as const,
      title: "10 Minute Morning Yoga Flow",
      videoLink: "https://www.youtube.com/watch?v=VaoV1PrYft4",
      posterLink: "https://img.youtube.com/vi/VaoV1PrYft4/maxresdefault.jpg",
      authorId: "author1",
      category: "mindfulness",
      description: "Start your day with this energizing 10 minute yoga flow.",
      duration: "10"
    },
    {
      contentId: 5,
      type: "video" as const,
      title: "Breathing Exercises for Stress Relief",
      videoLink: "https://www.youtube.com/watch?v=tybOi4hjZFQ",
      posterLink: "https://img.youtube.com/vi/tybOi4hjZFQ/maxresdefault.jpg",
      authorId: "author1",
      category: "mindfulness",
      description: "Learn effective breathing exercises to help relieve stress.",
      duration: "8"
    },
    {
      contentId: 6,
      type: "video" as const,
      title: "Deep Sleep Meditation - Guided Relaxation",
      videoLink: "https://www.youtube.com/watch?v=1ZYbU82GVz4",
      posterLink: "https://img.youtube.com/vi/1ZYbU82GVz4/maxresdefault.jpg",
      authorId: "author1",
      category: "mindfulness",
      description: "A guided meditation to help you achieve deep, restful sleep.",
      duration: "30"
    },
    {
      contentId: 7,
      type: "article" as const,
      title: "The Science Behind Mindfulness",
      text: "Discover how mindfulness meditation affects your brain...",
      authorId: "author1",
      category: "mindfulness",
      description: "An in-depth look at the scientific research on mindfulness."
    },
    {
      contentId: 8,
      type: "article" as const,
      title: "10 Tips for Better Sleep Quality",
      text: "Learn practical techniques to improve your sleep tonight...",
      posterLink: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&q=80",
      authorId: "author1",
      category: "mindfulness",
      description: "Simple and effective tips to enhance your sleep quality."
    },
  ];

  localStorage.setItem("contentItems", JSON.stringify(sampleContent));

  const videos = sampleContent.filter((item: any) => item.type === "video");
  const articles = sampleContent.filter((item: any) => item.type === "article");

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
              {videos.map((item : any) => (
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
              {articles.map((item : any) => (
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
                {sampleContent.map((item: any) => (
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
         {isOpen && <ContentViewModal isOpen={isOpen} onClose={handleClose} content={content} allowEdit={userRole === "admin"} />}
        </div>
        </div>
      </div>
    </>
  );
}

export default Content;

