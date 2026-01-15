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
  const [showAddToCalendarForm, setShowAddToCalendarForm] = useState(false);
  const [eventData, setEventData] = useState({
    title: content.title,
    start: "",
    end: "",
    allDay: false,
    description: "",
    contentId: content.contentId,
  });

  useEffect(() => {
    loadReviews();
  }, [content.contentId]);

  const loadReviews = () => {
    const oldReviews = JSON.parse(localStorage.getItem("reviews") || "[]");
    const contentReviews = oldReviews.filter(
      (element: Review) => element.contentId === content.contentId
    );
    setReviews(contentReviews);
  };

  const [newReview, setNewReview] = useState({
    userId: "user123",
    rating: 5,
    comment: "",
  });

  const handleAddReview = () => {
    const reviewToAdd: Review = {
      id: Date.now(),
      rating: newReview.rating,
      comment: newReview.comment,
      date: new Date().toLocaleDateString("hr-HR"),
      userId: newReview.userId,
      contentId: content.contentId,
    };

    const existingReviews = JSON.parse(localStorage.getItem("reviews") || "[]");
    localStorage.setItem(
      "reviews",
      JSON.stringify([reviewToAdd, ...existingReviews])
    );
    loadReviews();

    setNewReview({ userId: "user123", comment: "", rating: 5 });
  };

  const handleDeleteContent = () => {
    // potvrdi brisanje
    if (!window.confirm("Jeste li sigurni da želite izbrisati ovaj sadržaj?")) {
      return;
    }

    // Izbriši iz localStorage
    const existingContent: ContentItem[] = JSON.parse(
      localStorage.getItem("contentItems") || "[]"
    );
    const updatedContent = existingContent.filter(
      (item: ContentItem) => item.contentId !== content.contentId
    );
    localStorage.setItem("contentItems", JSON.stringify(updatedContent));
    onClose();
  };

  const handleDeleteReview = (reviewId: number) => {
    const existingReviews = JSON.parse(localStorage.getItem("reviews") || "[]");
    const updatedReviews = existingReviews.filter(
      (review: Review) => review.id !== reviewId
    );
    localStorage.setItem("reviews", JSON.stringify(updatedReviews));
    loadReviews();
  };

  const handleAddToCalendar = () => {
    setShowAddToCalendarForm(true);
  };

  const handleCancelAddToCalendar = () => {
    setShowAddToCalendarForm(false);
    setEventData({
      start: "",
      end: "",
      allDay: false,
      description: "",
      title: content.title,
      contentId: content.contentId,
    });
  };

  const handleSaveEvent = (e: React.FormEvent) => {
    e.preventDefault();
    
    const existingEvents = JSON.parse(localStorage.getItem("events") || "[]");
    const newEvent = {
      id: String(Date.now()),
      userId: "user123",
      title: content.title,
      start: eventData.start,
      end: eventData.end,
      allDay: eventData.allDay,
      description: eventData.description,
      contentId: content.contentId,
    };

    localStorage.setItem("events", JSON.stringify([...existingEvents, newEvent]));
    
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
              onChange={(e) => setEventData({ ...eventData, start: e.target.value })}
              required
            />
          </div>
          <div>
            <label htmlFor="end">Kraj:</label>
            <input
              type="datetime-local"
              id="end"
              value={eventData.end}
              onChange={(e) => setEventData({ ...eventData, end: e.target.value })}
              required
            />
          </div>
          <div>
            <label htmlFor="allDay">
              <input
                type="checkbox"
                id="allDay"
                checked={eventData.allDay}
                onChange={(e) => setEventData({ ...eventData, allDay: e.target.checked })}
              />
              Cjelodnevni događaj
            </label>
          </div>
          <div>
            <label htmlFor="description">Opis (opcionalno):</label>
            <textarea
              id="description"
              value={eventData.description}
              onChange={(e) => setEventData({ ...eventData, description: e.target.value })}
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
            <button className="myButton saveEventButton" onClick={handleSaveEvent}>
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

  console.log("ContentView render:", { isOpen, content });

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
                      navigate(`/editcontent/${content.contentId}`)
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
              {showAddToCalendarForm ? renderAddToCalendarForm() : renderContent()}
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
                <h3>Ostavi recenziju</h3>
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
                />
                <button
                  onClick={handleAddReview}
                  className="myButton review-submit"
                >
                  Objavi
                </button>
              </div>
            )}

            <div className="reviews-list">
              {reviews.map((review) => (
                <div key={review.id} className="review-item">
                  <div className="review-header-item">
                    <span className="review-author">{review.userId}</span>
                    <span className="review-date">{review.date}</span>
                  </div>
                  <div className="review-rating">
                    {"⭐".repeat(review.rating)}
                  </div>
                  <p className="review-text">{review.comment}</p>
                  {allowEdit && (
                    <button
                      className="myButton deleteReviewButton"
                      onClick={() => handleDeleteReview(review.id)}
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
