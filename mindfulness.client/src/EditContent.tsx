import Header from "./components/Header";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./AddContent.css";

interface ContentItem {
  contentId: number;
  title: string;
  description: string;
  videoLink?: string;
  articleLink?: string;
  text?: string;
  posterLink?: string;
  type: "video" | "article";
  authorId: string;
  category: string;
  duration: string;
}

function EditContent() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [contentType, setContentType] = useState("video");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [duration, setDuration] = useState("0");
  const [videoLink, setVideoLink] = useState("");
  const [thumbnailLink, setThumbnailLink] = useState("");
  const [articleText, setArticleText] = useState("");

  useEffect(() => {
    // Učitaj sadržaj za uređivanje
    const storedContent = JSON.parse(
      localStorage.getItem("contentItems") || "[]"
    );
    const contentToEdit = storedContent.find(
      (item: ContentItem) => item.contentId === Number(id)
    );

    if (contentToEdit) {
      setContentType(contentToEdit.type);
      setTitle(contentToEdit.title);
      setDescription(contentToEdit.description);
      setCategory(contentToEdit.category);
      setDuration(contentToEdit.duration?.toString() || "0");
      setVideoLink(contentToEdit.videoLink || "");
      setThumbnailLink(contentToEdit.posterLink || "");
      setArticleText(contentToEdit.description || "");
    }
  }, [id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const updatedContent: ContentItem = {
      contentId: Number(id),
      title,
      description: contentType === "article" ? articleText : description,
      type: contentType as "video" | "article",
      authorId: "author1",
      category,
      duration: contentType === "video" ? duration : "",
      videoLink: contentType === "video" ? videoLink : undefined,
      posterLink: thumbnailLink || undefined,
    };

    // Ažuriraj u localStorage
    const storedContent = JSON.parse(
      localStorage.getItem("contentItems") || "[]"
    );
    const updatedList = storedContent.map((item: ContentItem) =>
      item.contentId === Number(id) ? updatedContent : item
    );
    localStorage.setItem("contentItems", JSON.stringify(updatedList));

    // Vrati se nazad
    navigate(-1);
  };

    const handleDelete = () => {
      
    // potvrdi brisanje
    if (!window.confirm("Jeste li sigurni da želite izbrisati ovaj sadržaj?")) {
      return;
    }
        
    // Izbriši iz localStorage
    const storedContent = JSON.parse(
      localStorage.getItem("contentItems") || "[]"
    );
    const updatedList = storedContent.filter(
      (item: ContentItem) => item.contentId !== Number(id)
    );

    localStorage.setItem("contentItems", JSON.stringify(updatedList));

    // Vrati se nazad
    navigate(-1);
  };

  return (
    <>
      <div className="background">
        <div className="addContentContainer">
          <Header userRole={localStorage.getItem("userRole") || ""} />
          <div className="editContentHeader">
            <button
              className="myButton backButtonEdit"
              onClick={() => navigate(-1)}
            >
              Odustani
            </button>
            <button
              className="myButton deleteContentButton"
              onClick={handleDelete}
            >
              Izbriši
            </button>
          </div>

          <form className="contentForm" onSubmit={handleSubmit}>

            <div className="formGroup">
              <label>Naslov:</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            {contentType === "video" && (
              <div className="formGroup">
                <label>Opis:</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            )}

            <div className="formGroup">
              <label>Kategorija:</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
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
              Spremi promjene
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default EditContent;
