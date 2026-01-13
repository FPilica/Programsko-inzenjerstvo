
import { useState, useRef } from "react";
import "./App.css";
import Header from "./components/Header";
import ContentView from "./ContentViewModal";
import { CaretLeftIcon, CaretRightIcon } from "@phosphor-icons/react";
import "./Content.css"

function Content() {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState<any>(null);
  const videosRef = useRef<HTMLDivElement | null>(null);
  const articlesRef = useRef<HTMLDivElement | null>(null);

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

  const sampleContent = [
    {
      contentId: 1,
      type: "video" as const,
      title: "React Player Tutorial - Learn from Basics",
      videoLink: "https://www.youtube.com/watch?v=tVBZq2fq-WA&t=23s",
      posterLink: "https://img.youtube.com/vi/tVBZq2fq-WA/maxresdefault.jpg",
    },
    {
      contentId: 2,
      type: "video" as const,
      title: "Top 5 Techniques for Web Animation",
      videoLink: "https://www.youtube.com/watch?v=9eHEOAn2FOA",
      posterLink: "https://img.youtube.com/vi/9eHEOAn2FOA/maxresdefault.jpg",
    },
    {
      contentId: 3,
      type: "video" as const,
      title: "Mindfulness Meditation for Beginners",
      videoLink: "https://www.youtube.com/watch?v=2OEL4P1Rz04",
      posterLink: "https://img.youtube.com/vi/2OEL4P1Rz04/maxresdefault.jpg",
    },
    {
      contentId: 6,
      type: "video" as const,
      title: "10 Minute Morning Yoga Flow",
      videoLink: "https://www.youtube.com/watch?v=VaoV1PrYft4",
      posterLink: "https://img.youtube.com/vi/VaoV1PrYft4/maxresdefault.jpg",
    },
    {
      contentId: 7,
      type: "video" as const,
      title: "Breathing Exercises for Stress Relief",
      videoLink: "https://www.youtube.com/watch?v=tybOi4hjZFQ",
      posterLink: "https://img.youtube.com/vi/tybOi4hjZFQ/maxresdefault.jpg",
    },
    {
      contentId: 8,
      type: "video" as const,
      title: "Deep Sleep Meditation - Guided Relaxation",
      videoLink: "https://www.youtube.com/watch?v=1ZYbU82GVz4",
      posterLink: "https://img.youtube.com/vi/1ZYbU82GVz4/maxresdefault.jpg",
    },
    {
      contentId: 4,
      type: "article" as const,
      title: "The Science Behind Mindfulness",
      text: "Discover how mindfulness meditation affects your brain...",
      posterLink: "https://images.unsplash.com/photo-1516321318423-f06f70d504d0?auto=format&fit=crop&w=600&q=80",
    },
    {
      contentId: 5,
      type: "article" as const,
      title: "10 Tips for Better Sleep Quality",
      text: "Learn practical techniques to improve your sleep tonight...",
      posterLink: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&q=80",
    },
  ];

  const videos = sampleContent.filter(item => item.type === "video");
  const articles = sampleContent.filter(item => item.type === "article");

  return (
    <>
      <div className="background">
        <div className="contentContainer">
          <Header />
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
              {videos.map((item) => (
                <div 
                  key={item.contentId} 
                  className="contentCard" 
                  onClick={() => {
                    setContent(item);
                    setIsOpen(true);
                  }}
                >
                  <div className="cardThumbnail">
                    <img src={item.posterLink} alt={item.title}/>
                  </div>
                  <div className="cardContent">
                    <h3 className="cardTitle">{item.title}</h3>
                  </div>
                </div>
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
              {articles.map((item) => (
                <div 
                  key={item.contentId} 
                  className="contentCard" 
                  onClick={() => {
                    setContent(item);
                    setIsOpen(true);
                  }}
                >
                  <div className="cardThumbnail">
                    <img src={item.posterLink} alt={item.title}/>
                  </div>
                  <div className="cardContent">
                    <h3 className="cardTitle">{item.title}</h3>
                  </div>
                </div>
              ))}
            </div>
            </div>

            <div className="section">
              <div className="sectionHeader">
                <h2 className="sectionTitle">Sve</h2>
              </div>
              <div className="contentGrid">
                {sampleContent.map((item) => (
                  <div 
                    key={item.contentId} 
                    className="contentCard" 
                    onClick={() => {
                      setContent(item);
                      setIsOpen(true);
                    }}
                  >
                    <div className="cardThumbnail">
                      <img src={item.posterLink} alt={item.title}/>
                    </div>
                    <div className="cardContent">
                      <h3 className="cardTitle">{item.title}</h3>
                    </div>
                  </div>
                ))}
              </div>

            </div>
         {isOpen && <ContentView isOpen={isOpen} onClose={handleClose} content={content} />}
        </div>
        </div>
      </div>
    </>
  );
}

export default Content;

