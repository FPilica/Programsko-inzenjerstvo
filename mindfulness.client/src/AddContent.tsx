import Header from "./components/Header";
import { useState, useEffect } from "react";
import ContentViewModal from "./components/ContentViewModal";
import ContentCard from "./components/ContentCard";
import "./AddContent.css";


interface ContentItem {
  contentId?: number;
  title: string;
  description?: string;
  videoLink?: string;
  articleLink?: string;
  text?: string;
  posterLink?: string;
  subtitlesLink?: string;
  type: "video" | "article";
  authorId: string;
  category?: string;
  duration?: number;
}

function AddContent() {
  const userRole = localStorage.getItem("userRole");

  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState<ContentItem | null>(null);

  const [myContent, setMyContent] = useState<ContentItem[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [contentType, setContentType] = useState("video");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [duration, setDuration] = useState("0");
  const [videoLink, setVideoLink] = useState("");
  const [thumbnailLink, setThumbnailLink] = useState("");
  const [articleText, setArticleText] = useState("");

  useEffect(() => {
    // fetchMyContent();
    let storedContent = JSON.parse(localStorage.getItem("contentItems") || "[]");
    storedContent = storedContent.filter((item: ContentItem) => item.authorId === "author1");
    setMyContent(storedContent);
  }, []);

  const fetchMyContent = async () => {
    try {
      const response = await fetch(
        "https://localhost:7070/api/content/mycontent",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("auth_token")}`,
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setMyContent(data);
      }
    } catch (error) {
      console.error("Error fetching content:", error);
    }
  };

  const handleSumbit = (e: React.FormEvent) => {
    e.preventDefault();

    const newContentItem: ContentItem = {
      contentId: Date.now(),
      title,
      description,
      type: contentType as "video" | "article",
      authorId: "author1",
      category,
      duration: contentType === "video" ? parseInt(duration) : undefined,
      videoLink: contentType === "video" ? videoLink : undefined,
      text: contentType === "article" ? articleText : undefined,
      posterLink: thumbnailLink || undefined,
    };

    setMyContent([...myContent, newContentItem]);
    const storedContent = JSON.parse(localStorage.getItem("contentItems") || "[]");
    localStorage.setItem("contentItems", JSON.stringify([...storedContent, newContentItem]));

    setShowForm(false);
    setTitle("");
    setContentType("video");
    setDescription("");
    setCategory("");
    setDuration("0");
    setVideoLink("");
    setThumbnailLink("");
    setArticleText("");
  };

  const handleClose = () => {
    setIsOpen(false);
    setContent(null);
  };

  return (
    <>
      <div className="background">
        <div className="addContentContainer">
          <Header userRole={userRole || ""} />
          
          {!showForm ? (
            <>
              <div className="contentHeader">
                <h1>Moj sadržaj</h1>
                <button 
                  className="myButton addContentButton" 
                  onClick={() => setShowForm(true)}
                >
                  + Dodaj sadržaj
                </button>
              </div>

              {myContent.length === 0 ? (
                <div className="emptyState">
                  <p>Niste dodali sadržaj</p>
                </div>
              ) : (
                <div className="addContentList">
                  {myContent.map((content: ContentItem) => (
                    <ContentCard
                      key={content.contentId}
                      content={content}
                      onClick={() => {
                        setContent(content);
                        setIsOpen(true);
                      }}
                    />
                  ))}
                </div>
              )}
            </>
          ) : (
            <>
              <button 
                className="myButton backButton" 
                onClick={() => setShowForm(false)}
              >
                Natrag
              </button>

              <form className="contentForm" onSubmit={handleSumbit}>
                <div className="formGroup">
                  <label>Tip sadržaja:</label>
                    <select
                      value={contentType}
                      onChange={(e) => setContentType(e.target.value)}
                      required>
                    <option value="video">Video</option>
                    <option value="article">Članak</option>
                  </select>
                </div>

                <div className="formGroup">
                  <label>Naslov:</label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => {setTitle(e.target.value)}}
                      required
                    />
                </div>

                <div className="formGroup">
                  <label>Opis:</label>
                    <textarea
                      rows={3}
                      value={description}
                      onChange={(e) => { setDescription(e.target.value) }}
                      required
                    />
                </div>

                <div className="formGroup">
                  <label>Kategorija:</label>
                    <select
                      value={category}
                      onChange={(e) => {setCategory(e.target.value)}}
                      required
                    >
                    <option value="">Odaberi kategoriju</option>
                    <option value="meditacija">Meditacija</option>
                    <option value="disanje">Disanje</option>
                    <option value="yoga">Yoga</option>
                    <option value="mindfulness">Mindfulness</option>
                  </select>
                </div>

                {contentType === "video" && (
                  <>
                    <div className="formGroup">
                      <label>Trajanje (min):</label>
                        <input
                          type="number"
                          value={duration}
                          onChange={(e) => setDuration(e.target.value)}
                          required
                        />
                    </div>

                    <div className="formGroup">
                      <label>YouTube link:</label>
                        <input
                          type="url"
                          placeholder="https://www.youtube.com/watch?v=..."
                          value={videoLink}
                          onChange={(e) => {setVideoLink(e.target.value); setThumbnailLink(`https://img.youtube.com/vi/${e.target.value.split("v=")[1]}/maxresdefault.jpg`);}}
                          required
                        />
                    </div>

                    {/* <div className="formGroup">
                      <label>Thumbnail link (opcionalno):</label>
                      <input 
                        type="url" 
                        placeholder="https://..."
                        value={thumbnailLink}
                        onChange={(e) => setThumbnailLink(e.target.value)}
                      />
                    </div> */}
                  </>
                )}

                {contentType === "article" && (
                  <div className="formGroup">
                    <label>Sadržaj članka:</label>
                    <textarea 
                      rows={10} 
                      value={articleText}
                      onChange={(e) => setArticleText(e.target.value)}
                      required 
                    />
                  </div>
                )}

                <button type="submit" className="myButton submitContentButton">
                  Dodaj sadržaj
                </button>
              </form>
            </>
          )}
          {isOpen && content && (
            <ContentViewModal 
              isOpen={isOpen} 
              onClose={handleClose} 
              content={content} 
            />
          )}
        </div>
      </div>
    </>
  );
}

export default AddContent;