import Header from "./components/Header";
import { useState, useEffect } from "react";
import ContentViewModal from "./components/ContentViewModal";
import ContentCard from "./components/ContentCard";
import type {ContentItem} from "./types/ContentItem";
import "./AddContent.css";


function AddContent() {

  // const [contentItems, setContentItems] = useState<any[]>([]);
  const [user, setUser] = useState<any | null>(null);
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
    fetchUserAndContent();
    ensureDataLoaded();
  }, []);

  const fetchUserAndContent = async () => {
    try {
      const [userRes, contentRes] = await Promise.all([
        fetch("https://localhost:7070/api/userprofile/getprofile", {
          method: "GET",
          headers: {
            "accept": "text/plain",
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("auth_token")}`,
          },
        }),
        fetch("https://localhost:7070/api/content", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("auth_token")}`,
          },
        }),
      ]);

      if (userRes.ok && contentRes.ok) {
        const userData = await userRes.json();
        const contentData = await contentRes.json();
        
        setUser(userData);
        
        // Filtriraj content po user ID-u
        const filteredData = contentData.filter((item: ContentItem) => item.userId === userData.id);
        setMyContent(filteredData);
      }
    } catch (error) {
      console.error("Error fetching user and content:", error);
    }
  };

  const ensureDataLoaded = async () => {
    // Ako Dashboard još nije učitao kategorije, učitaj ih
    if (!sessionStorage.getItem("categories") || !sessionStorage.getItem("languages")) {
      try {
        const [categoriesRes, languagesRes] = await Promise.all([
          fetch("https://localhost:7070/api/contentcategory", {
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${localStorage.getItem("auth_token")}`,
            },
          }),
          fetch("https://localhost:7070/api/audiolanguage", {
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${localStorage.getItem("auth_token")}`,
            },
          }),
        ]);

        if (categoriesRes.ok) {
          const categories = await categoriesRes.json();
          sessionStorage.setItem("categories", JSON.stringify(categories));
        }
        if (languagesRes.ok) {
          const languages = await languagesRes.json();
          sessionStorage.setItem("languages", JSON.stringify(languages));
        }
      } catch (error) {
        console.error("Error loading categories/languages:", error);
      }
    }
  };

  const getCategoryIdByName = (contentCategory: string): string => {
    const categories = JSON.parse(sessionStorage.getItem("categories") || "[]");
    const category = categories.find((cat: any) => cat.name.toLowerCase() === contentCategory.toLowerCase());
    if (!category) {
      console.error(`Category "${contentCategory}" not found in sessionStorage`);
    }
    return category?.id || "";
  };

  const getAudioLanguageIdByName = (language: string): string => {
    const languages = JSON.parse(sessionStorage.getItem("languages") || "[]");
    const lang = languages.find((l: any) => l.name.toLowerCase() === language.toLowerCase());
    if (!lang) {
      console.error(`Language "${language}" not found in sessionStorage`);
    }
    return lang?.id || "";
  };

  const addContentItemToDatabase = async (item: ContentItem) => {
    try {  
      const response = await fetch(
        `https://localhost:7070/api/content`, 
        {
          method: "POST",
          headers: {
            "Accept": "text/plain",
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("auth_token")}`,
          },
          body: JSON.stringify({
            title: item.title,
            description: item.description,
            difficulty: "easy",
            duration: item.duration,
            contentType: item.contentType,
            contentLink: item.contentLink,
            thumbnailLink: item.thumbnailLink,
            categoryId: item.categoryId,
            audioLanguageId: item.audioLanguageId,
          }),
        },
      );

      if (!response.ok) {
        throw new Error("Something went wrong!");
      }

      // Dohvati sve content ponovno da dobijemo novi sadržaj s ID-em
      await fetchUserAndContent();

    } catch (error) {
      console.error("Error adding content item:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const categoryId = getCategoryIdByName(category || "mindfulness");
    const languageId = getAudioLanguageIdByName("eng");

    if (!categoryId) {
      alert("Kategorija nije pronađena. Provjerite da li su kategorije učitane.");
      return;
    }

    const newContentItem: ContentItem = {
      title,
      description: contentType === "article" ? articleText : description,
      contentType: contentType as "video" | "article",
      categoryId: categoryId,
      audioLanguageId: languageId || undefined,
      duration: contentType === "video" ? duration : "0",
      contentLink: contentType === "video" ? videoLink : undefined,
      thumbnailLink: thumbnailLink || undefined,
    };

    console.log("New content item:", newContentItem);

    // otkomentiraj za bazu
    await addContentItemToDatabase(newContentItem);

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

  const handleClose = async () => {
    setIsOpen(false);
    setContent(null);
    await fetchUserAndContent();
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
                          key={content.id}
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
                          onChange={(e) => {
                            setVideoLink(e.target.value);
                            try {
                              const url = new URL(e.target.value);
                              const videoId = url.searchParams.get("v");
                              if (videoId) {
                                setThumbnailLink(`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`);
                              }
                            } catch (error) {
                              setThumbnailLink("");
                            }
                          }}
                          required
                        />
                    </div>
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