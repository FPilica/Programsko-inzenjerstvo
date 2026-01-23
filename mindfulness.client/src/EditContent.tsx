import Header from "./components/Header";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { ContentItem } from "./types/ContentItem";
import "./AddContent.css";

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
    getContentItems();
  }, [id]);

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
        },
      );

      if (!response.ok) {
        throw new Error("Something went wrong!");
      }

      const contentItemsData = await response.json();
      console.log("Fetched content items:", contentItemsData);

      const contentToEdit = contentItemsData.find(
        (item: ContentItem) => item.id === id,
      );

      const category = JSON.parse(sessionStorage.getItem("categories") || "[]").find((cat: any) => cat.id === contentToEdit.categoryId);

      if (contentToEdit) {
        setContentType(contentToEdit.contentType);
        setTitle(contentToEdit.title);
        setDescription(contentToEdit.description);
        setCategory(category ? category.name : "");
        setDuration(contentToEdit.duration?.split(':')[0].split('.')[0] || "0");
        setVideoLink(contentToEdit.contentLink || "");
        setThumbnailLink(contentToEdit.thumbnailLink || "");
        setArticleText(contentToEdit.description || "");
      }

      console.log("Content to edit:", contentToEdit);
    } catch (error) {
      console.error("Error fetching content items:", error);
    }
  };

  const editContent = async (updatedContent: ContentItem) => {
    try {
      const response = await fetch(
        `https://localhost:7070/api/content/${id}`, 
        {
          method: "PUT",
          headers: {
            "Accept": "text/plain",
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("auth_token")}`,
          },
          body: JSON.stringify(updatedContent),
        },
      );

      if (!response.ok) {
        throw new Error("Something went wrong!");
      }

      console.log("Content updated successfully");
    } catch (error) {
      console.error("Error updating content:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const categoryId = JSON.parse(sessionStorage.getItem("categories") || "[]").find((cat: any) => cat.name === category)?.id || "";

    const updatedContent: ContentItem = {
      title,
      description: contentType === "article" ? articleText : description,
      contentType: contentType as "video" | "article",
      categoryId: categoryId,
      duration: contentType === "video" ? duration : "0",
      contentLink: contentType === "video" ? videoLink : undefined,
      thumbnailLink: thumbnailLink || undefined,
    };

    await editContent(updatedContent);
    navigate(-1);
  };

    const handleDelete = async () => {
      
    // potvrdi brisanje
    if (!window.confirm("Jeste li sigurni da želite izbrisati ovaj sadržaj?")) {
      return;
    }
      
      try {
        const response = await fetch(
          `https://localhost:7070/api/content/${id}`,
          {
            method: "DELETE",
            headers: {
              "Accept": "text/plain",
              "Content-Type": "application/json",
              "Authorization": `Bearer ${localStorage.getItem("auth_token")}`,
            },
          },
        );

        if (!response.ok) {
          throw new Error("Something went wrong!");
        }

        console.log("Content deleted successfully");
      } catch (error) {
        console.error("Error deleting content:", error);
      }

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
