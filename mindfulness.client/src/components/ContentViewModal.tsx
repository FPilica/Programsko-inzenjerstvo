import { useEffect, useState } from "react";
import VideoPlayer from "./VideoPlayer";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import type { Review } from "../types/Review";
import type { ContentItem } from "../types/ContentItem";
import "./ContentViewModal.css";

interface ContentViewProps {
  content: ContentItem;
  isOpen: boolean;
  onClose: () => void;
  allowEdit?: boolean;
}

function ContentViewModal({
  content,
  isOpen,
  onClose,
  allowEdit = false,
}: ContentViewProps) {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [userReview, setUserReview] = useState<Review | null>(null);
  const [isEditingReview, setIsEditingReview] = useState(false);
  const [showAddToCalendarForm, setShowAddToCalendarForm] = useState(false);
  const [eventData, setEventData] = useState({
    title: content.title,
    start: "",
    end: "",
    allDay: false,
    description: "",
    contentId: content.id,
  });
  const [user, setUser] = useState<any | null>(null);
  const userRole = localStorage.getItem("userRole");

  const canDeleteReview = () => {
    // Admin može brisati sve
    if (userRole === "admin") return true;
    // Trener može brisati na svojim objavama
    if (userRole === "coach" && allowEdit) return true;
    // Obični korisnik NE vidi gumb ovdje (ima svoj gore kod forme)
    return false;
  };

  useEffect(() => {
    getUser();
    fetchReviews();
  }, [content.id]);

  useEffect(() => {
    if (user?.id && reviews.length > 0) {
      const existingUserReview = reviews.find((r: Review) => r.userId === user.id);
      setUserReview(existingUserReview || null);
      if (existingUserReview) {
        setNewReview({
          rating: existingUserReview.rating,
          comment: existingUserReview.comment || "",
        });
      } else {
        setNewReview({ rating: 5, comment: "" });
      }
    }
  }, [user, reviews]);

  const getUser = async () => {
    try {
      const response = await fetch(
        `https://programsko-inzenjerstvo-x2fd.onrender.com/api/UserProfile/getprofile`,
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

      const userData = await response.json();
      setUser(userData);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const fetchReviews = async () => {
    try {
      const [reviewsResponse, usersResponse] = await Promise.all([
        fetch(
          `https://programsko-inzenjerstvo-x2fd.onrender.com/api/review/by-content-id/${content.id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${localStorage.getItem("auth_token")}`,
            },
          }
        ),
        fetch(
          `https://programsko-inzenjerstvo-x2fd.onrender.com/api/UserProfile/getallusers`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${localStorage.getItem("auth_token")}`,
            },
          }
        ),
      ]);

      if (!reviewsResponse.ok) {
        console.error("Error fetching reviews");
      }

      if (!usersResponse.ok) {
        console.error("Error fetching users");
      }
      
      const reviewsData = await reviewsResponse.json();
      const usersData = await usersResponse.json();
      
      setReviews(reviewsData);
      setUsers(usersData);

    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: "",
  });

  const addReviewToDatabase = async (review: Review) => {
    try {
      const response = await fetch(
        `https://programsko-inzenjerstvo-x2fd.onrender.com/api/review`,
        {
          method: "POST",
          headers: {
            "Accept": "text/plain",
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("auth_token")}`,
          },
          body: JSON.stringify({
            rating: review.rating,
            comment: review.comment,
            contentId: review.contentId,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Something went wrong!");
      }
    } catch (error) {
      console.error("Error adding review:", error);
    }
  };

  const updateReviewInDatabase = async (reviewId: string, review: Review) => {
    try {
      const response = await fetch(
        `https://programsko-inzenjerstvo-x2fd.onrender.com/api/review/${reviewId}`,
        {
          method: "PUT",
          headers: {
            "Accept": "text/plain",
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("auth_token")}`,
          },
          body: JSON.stringify({
            rating: review.rating,
            comment: review.comment,
            contentId: review.contentId,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Something went wrong!");
      }
    } catch (error) {
      console.error("Error updating review:", error);
    }
  };

  const handleAddReview = async () => {
    const reviewData: Review = {
      rating: newReview.rating,
      comment: newReview.comment,
      contentId: content.id,
    };

    if (userReview?.id) {
      // Ažuriraj postojeću recenziju
      await updateReviewInDatabase(userReview.id, reviewData);
      setUserReview(reviewData)
      setIsEditingReview(false);
    } else {
      // Dodaj novu recenziju
      await addReviewToDatabase(reviewData);
    }

    setNewReview({ rating: 5, comment: "" });
    await fetchReviews();
  };

  const handleCancelEdit = () => {
    setIsEditingReview(false);
    if (userReview) {
      setNewReview({
        rating: userReview.rating,
        comment: userReview.comment || "",
      });
    } else {
      setNewReview({ rating: 5, comment: "" });
    }
  };

  const handleDeleteUserReview = async () => {
    if (!userReview?.id) return;
    
    if (!window.confirm("Jeste li sigurni da želite izbrisati svoju recenziju?")) {
      return;
    }

    await deleteReviewFromDatabase(userReview.id);
    setUserReview(null);
    setIsEditingReview(false);
    setNewReview({ rating: 5, comment: "" });
    await fetchReviews();
  };

  const deleteContentFromDatabase = async (contentId: string) => {
    try {
      const response = await fetch(
        `https://programsko-inzenjerstvo-x2fd.onrender.com/api/content/${contentId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("auth_token")}`,
          },
        }
      );
      
      if (!response.ok) {
        throw new Error("Something went wrong!");
      }

    } catch (error) {
      console.error("Error deleting content item:", error);
    }
  };

  const handleDeleteContent = async () => {
   
    if (!window.confirm("Jeste li sigurni da želite izbrisati ovaj sadržaj?")) {
      return;
    }
    
    await deleteContentFromDatabase(content.id || "");
    onClose();
  };

  const deleteReviewFromDatabase = async (reviewId: string) => {
    try {
      const response = await fetch(
        `https://programsko-inzenjerstvo-x2fd.onrender.com/api/review/${reviewId}`,
        {
          method: "DELETE",
          headers: {
            "Accept": "text/plain",
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("auth_token")}`,
          },
        }
      );

      console.log("Delete response status:", response.status);
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Delete failed:", errorText);
        throw new Error(`Delete failed: ${response.status} - ${errorText}`);
      }
      console.log("Review deleted successfully");

    } catch (error) {
      console.error("Error deleting review:", error);
      alert("Greška pri brisanju recenzije. Provjerite konzolu za detalje.");
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!window.confirm("Jeste li sigurni da želite izbrisati ovu recenziju?")) {
      return;
    }
    await deleteReviewFromDatabase(reviewId);
    await fetchReviews();
  };

  const handleAddToCalendar = () => {
    setShowAddToCalendarForm(true);
  };

  const addEventToDatabase = async (newEvent: any) => {
    try {
      const response = await fetch(
        `https://programsko-inzenjerstvo-x2fd.onrender.com/api/event`,
        {
          method: "POST",
          headers: {
            "Accept": "text/plain",
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("auth_token")}`,
          },
          body: JSON.stringify(newEvent),
        },
      );

      if (!response.ok) {
        throw new Error("Something went wrong!");
      }
    } catch (error) {
      console.error("Error adding event:", error);
    }
  };

  const handleCancelAddToCalendar = () => {
    setShowAddToCalendarForm(false);
    setEventData({
      start: "",
      end: "",
      allDay: false,
      description: "",
      title: content.title,
      contentId: content.id,
    });
  };

  const handleSaveEvent = async (e: React.FormEvent) => {
    e.preventDefault();

    const newEvent = {
      title: content.title,
      startTime: eventData.start,
      endTime: eventData.end,
      allDay: eventData.allDay,
      description: eventData.description,
      contentId: content.id,
    };

    await addEventToDatabase(newEvent);
    alert("Događaj uspješno dodan u kalendar!");
    handleCancelAddToCalendar();
  };

  const renderContent = () => {
    switch (content.contentType) {
      case "video":
        return (
          <VideoPlayer
            videoLink={content.contentLink || ""}
            videoName={content.title}
            posterLink={content.thumbnailLink}
          />
        );
      case "article":
        return <div className="content-article">{content.description}</div>;
      default:
        return <div>Nepoznat tip sadržaja</div>;
    }
  };

  const renderAddToCalendarForm = () => {
    return (
      <div className="addToCalendarFormContainer">
        <h2>Dodaj u kalendar</h2>
        <form className="addEventForm">
          <div>
            <label htmlFor="start">Početak:</label>
            <input
              type="datetime-local"
              id="start"
              value={eventData.start}
              onChange={(e) =>
                setEventData({ ...eventData, start: e.target.value })
              }
              required
            />
          </div>
          <div>
            <label htmlFor="end">Kraj:</label>
            <input
              type="datetime-local"
              id="end"
              value={eventData.end}
              onChange={(e) =>
                setEventData({ ...eventData, end: e.target.value })
              }
              required
            />
          </div>
          <div>
            <label htmlFor="allDay">
              <input
                type="checkbox"
                id="allDay"
                checked={eventData.allDay}
                onChange={(e) =>
                  setEventData({ ...eventData, allDay: e.target.checked })
                }
              />
              Cjelodnevni događaj
            </label>
          </div>
          <div>
            <label htmlFor="description">Opis (opcionalno):</label>
            <textarea
              id="description"
              value={eventData.description}
              onChange={(e) =>
                setEventData({ ...eventData, description: e.target.value })
              }
              rows={3}
              placeholder="Dodaj bilješku..."
            />
          </div>
        </form>
        <div className="formButtons">
          <button
            className="myButton cancelEventButton"
            onClick={handleCancelAddToCalendar}
          >
            Odustani
          </button>
          <button
            className="myButton saveEventButton"
            onClick={handleSaveEvent}
          >
            Spremi u kalendar
          </button>
        </div>
      </div>
    );
  };

  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        ).toFixed(1)
      : 0;

  if (!isOpen) return null;

  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="content-view">
          <div className="content-main">
            <div className="modal-header">
              <button className="myButton modal-close" onClick={onClose}>
                ✕
              </button>
              {allowEdit && (
                <>
                  <button
                    className="myButton editContentButtonModal"
                    onClick={() =>
                      navigate(`/editcontent/${content.id}`)
                    }
                  >
                    Uredi
                  </button>
                  <button
                    className="myButton deleteContentButtonModal"
                    onClick={handleDeleteContent}
                  >
                    Izbriši
                  </button>
                </>
              )}
              <button
                className="myButton addContentToCalendarButtonModal"
                onClick={handleAddToCalendar}
              >
                + Dodaj u kalendar
              </button>
            </div>
            <h1>{content.title}</h1>
            <div className="content-player">
              {showAddToCalendarForm
                ? renderAddToCalendarForm()
                : renderContent()}
            </div>
          </div>

          <div className="content-review">
            <div className="review-header">
              <h2>Recenzije</h2>
              <div className="rating-stats">
                <span className="average-rating">⭐ {averageRating}</span>
                <span className="review-count">({reviews.length})</span>
              </div>
            </div>

            {!allowEdit && (
              <div className="review-form">
                <h3>{userReview ? (isEditingReview ? "Uredi recenziju" : "Tvoja recenzija") : "Ostavi recenziju"}</h3>
                <div className="rating-input">
                  <label>Ocjena:</label>
                  <select
                    className="rating-select"
                    value={newReview.rating}
                    onChange={(e) =>
                      setNewReview({
                        ...newReview,
                        rating: parseInt(e.target.value),
                      })
                    }
                    disabled={!!userReview && !isEditingReview}
                  >
                    <option value="5">5 ⭐</option>
                    <option value="4">4 ⭐</option>
                    <option value="3">3 ⭐</option>
                    <option value="2">2 ⭐</option>
                    <option value="1">1 ⭐</option>
                  </select>
                </div>
                <textarea
                  className="review-textarea"
                  placeholder="Tvoja recenzija..."
                  value={newReview.comment}
                  onChange={(e) =>
                    setNewReview({ ...newReview, comment: e.target.value })
                  }
                  rows={4}
                  disabled={!!userReview && !isEditingReview}
                />
                {userReview && !isEditingReview ? (
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      onClick={() => setIsEditingReview(true)}
                      className="myButton review-submit"
                    >
                      Uredi
                    </button>
                    <button
                      onClick={handleDeleteUserReview}
                      className="myButton deleteMyReviewButton"
                    >
                      Izbriši
                    </button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <button
                      onClick={handleAddReview}
                      className="myButton review-submit"
                    >
                      {userReview ? "Spremi" : "Objavi"}
                    </button>
                    {isEditingReview && (
                      <button
                        onClick={handleCancelEdit}
                        className="myButton cancelEventButton"
                      >
                        Odustani
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}

            <div className="reviews-list">
              {reviews.map((review) => (
                <div key={review.id} className="review-item">
                  <div className="review-header-item">
                    <span className="review-author">{users.find((user) => user.id === review.userId)?.firstName || "Nepoznat korisnik"}</span>
                    <span className="review-date">{review.date}</span>
                  </div>
                  <div className="review-rating">
                    {"⭐".repeat(review.rating)}
                  </div>
                  <p className="review-text">{review.comment}</p>
                  {canDeleteReview() && (
                    <button
                      className="myButton deleteReviewButton"
                      onClick={() => handleDeleteReview(review.id || "")}
                    >
                      Izbriši
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default ContentViewModal;
