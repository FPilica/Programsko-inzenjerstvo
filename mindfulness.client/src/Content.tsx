
import { useState } from "react";
import "./App.css";
import Header from "./components/Header";
import ContentView from "./ContentViewModal";

function Content() {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState<any>(null);

  const handleClick = () => {
    setIsOpen(true);
    setContent(sampleContent[0]);
  };

  const handleClick2 = () => {
    setIsOpen(true);
    setContent(sampleContent[1]);
  }

  const handleClose = () => {
    setIsOpen(false);
  };

  const sampleContent = [
    {
      contentId: 1,
      type: "video" as const,
      title: "React Player Tutorial",
      videoLink: "https://www.youtube.com/watch?v=tVBZq2fq-WA&t=23s",
    },
    {
      contentId: 2,
      title: "Top 5 Techniques for Web Animation",
      type: "video" as const,
      videoLink: "https://www.youtube.com/watch?v=9eHEOAn2FOA",
    },
  ];

  return (
    <>
      <div className="background">
        <div className="contentContainer">
          <Header />
          <h1>Sadržaj</h1>
          <button onClick={handleClick}>Otvori video</button>
          <button onClick={handleClick2}>Otvori drugi video</button>
          {isOpen && (
            <ContentView
              isOpen={isOpen}
              content={content}
              onClose={handleClose}
            />
          )}
        </div>
      </div>
    </>
  );
}

export default Content;

