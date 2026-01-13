import { useEffect, useState } from "react";
import VideoPlayer from "./VideoPlayer";
import { createPortal } from "react-dom";
import "./ContentViewModal.css";

interface Review {
  id: number;
  rating: number;
  comment?: string;
  date: string;
  userId: string;
  contentId?: number;
}

interface Content {
  contentId?: number;
  title: string;
  description?: string;
  videoLink?: string;
  articleLink?: string;
  text?: string;
  posterLink?: string;
  subtitlesLink?: string;
  type: "video" | "article";
}

interface ContentViewProps {
  content: Content;
  isOpen: boolean;
  onClose: () => void;
}

function ContentViewModal({ content, isOpen, onClose }: ContentViewProps) {
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    loadReviews();
  }, [content.contentId]);
    
  const loadReviews = () => {
    const oldReviews = JSON.parse(localStorage.getItem("reviews") || "[]");
    const contentReviews = oldReviews.filter(
      (element: Review) => element.contentId === content.contentId
    );
    setReviews(contentReviews);
  }

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

  const renderContent = () => {
    switch (content.type) {
      case "video":
        return (
          <VideoPlayer
            videoLink={content.videoLink || ""}
            videoName={content.title}
            posterLink={content.posterLink}
          />
        );
      case "article":
        return <div className="content-article">{content.text}</div>;
      default:
        return <div>Nepoznat tip sadržaja</div>;
    }
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
        <button className="modal-close" onClick={onClose}>
          ✕
        </button>
        <div className="content-view">
          <div className="content-main">
            <h1>{content.title}</h1>
            <div className="content-player">{renderContent()}</div>
          </div>

          <div className="content-review">
            <div className="review-header">
              <h2>Recenzije</h2>
              <div className="rating-stats">
                <span className="average-rating">⭐ {averageRating}</span>
                <span className="review-count">({reviews.length})</span>
              </div>
            </div>

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
              <button onClick={handleAddReview} className="myButton review-submit">
                Objavi
              </button>
            </div>

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
