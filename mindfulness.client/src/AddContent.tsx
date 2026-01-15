import Header from "./components/Header";
import { useState, useEffect } from "react";
import ContentViewModal from "./components/ContentViewModal";
import ContentCard from "./components/ContentCard";
import type {ContentItem} from "./types/ContentItem";
import "./AddContent.css";


function AddContent() {

  const [contentItems, setContentItems] = useState<any[]>([]);
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
    loadContent();
  }, []);

  const loadContent = () => {
    let storedContent : ContentItem[] = JSON.parse(localStorage.getItem("contentItems") || "[]");
    storedContent = storedContent.filter((item: ContentItem) => item.userId === "author1");
    setMyContent(storedContent);
  }
    
  const fetchMyContent = async () => {
    try {
      const response = await fetch(
        "https://localhost:7070/api/", // dodati ostatak
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
            title: ${item.title},
            description: ${item.description},
            contentType: ${item.contentType},
            userId: ${item.userId},
            contentCategory: ${item.contentCategory},
            duration: ${item.duration},
            contentLink: ${item.contentLink},
            thumbnailLink: ${item.thumbnailLink}
          }`,
        }
      );

      if (!response.ok) {
        throw new Error("Something went wrong!");
      }

      setMyContent([...myContent, item]);

    } catch (error) {
      console.error("Error adding content item:", error);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newContentItem: ContentItem = {
      contentId: Date.now(),
      title,
      description: contentType === "article" ? articleText : description,
      contentType: contentType as "video" | "article",
      userId: "author1",
      contentCategory: category,
      duration: contentType === "video" ? duration : "",
      contentLink: contentType === "video" ? videoLink : undefined,
      thumbnailLink: thumbnailLink || undefined,
    };

    // otkomentiraj za bazu
    // addContentItemToDatabase(newContentItem);

    // trenutno se spremaju u localStorage, posli na backend
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
    loadContent();
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
                          allowEdit={true}
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

              <form className="contentForm" onSubmit={handleSubmit}>
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
                  
                  {contentType === "video" && (
                    <div className="formGroup">
                      <label>Opis:</label>
                      <textarea
                        rows={3}
                        value={description}
                        onChange={(e) => { setDescription(e.target.value) }}
                        required
                      />
                    </div>
                  )}

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
                  Dodaj
                </button>
              </form>
            </>
          )}
          {isOpen && content && (
            <ContentViewModal 
              isOpen={isOpen} 
              onClose={handleClose} 
              content={content} 
              allowEdit={true}
            />
          )}
        </div>
      </div>
    </>
  );
}

export default AddContent;