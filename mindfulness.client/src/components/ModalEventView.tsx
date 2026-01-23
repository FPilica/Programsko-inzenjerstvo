import { createPortal } from "react-dom";
import { useEffect, useState } from "react";
import ContentViewModal from "./ContentViewModal";
import "./ModalEvent.css";

function ModalEventView({
  isOpen,
  event,
  onClose,
  deleteEvent,
}: {
  isOpen: boolean;
  event: any;
  onClose: () => void;
  deleteEvent: () => void;
}) {
  const [showContentModal, setShowContentModal] = useState(false);
  const [eventContent, setEventContent] = useState<any | null>(null);

  const userRole = localStorage.getItem("userRole");

  if (!isOpen) return null;

  const getContentItems = async () => {
    try {
      const response = await fetch(`https://programsko-inzenjerstvo-x2fd.onrender.com/api/content`, {
        method: "GET",
        headers: {
          Accept: "text/plain",
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Something went wrong!");
      }

      const contentItemsData = await response.json();
      console.log("Fetched content items:", contentItemsData);
      const dataContent =
        contentItemsData.find(
          (item: any) => item.id === event.extendedProps?.contentId,
        ) || null;
      console.log("contentitems:", dataContent);
      setEventContent(dataContent);
    } catch (error) {
      console.error("Error fetching content items:", error);
    }
  };

  useEffect(() => {
    getContentItems();
  }, []);

  return createPortal(
    <div className="modalOverlay">
      <div className="modalContent">
        <button className="myButton modalCloseButton" onClick={onClose}>
          ✕
        </button>
        <h2>{event.title}</h2>

        <div className="eventDetails">
          <p>
            <span>Početak:</span>
            <b>
              {new Date(event.start).toLocaleString("hr-HR", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </b>
          </p>
          <p>
            <span>Kraj:</span>
            <b>
              {new Date(event.end).toLocaleString("hr-HR", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </b>
          </p>
          <p>
            <span>Opis:</span>
            <span>
              {event.description ||
                event.extendedProps?.description ||
                "Nema opisa ovog događaja."}
            </span>
          </p>
          {eventContent && (
            <p>
              <span>Sadržaj:</span>
              <b
                className="clickableContentTitle"
                onClick={() => setShowContentModal(true)}
              >
                {eventContent.title}
              </b>
            </p>
          )}
        </div>

        <button className="myButton modalDeleteButton" onClick={deleteEvent}>
          Izbriši događaj
        </button>
      </div>
      {eventContent && (
        <ContentViewModal
          content={eventContent}
          isOpen={showContentModal}
          onClose={() => setShowContentModal(false)}
          allowEdit={userRole === "admin"}
        />
      )}
    </div>,
    document.body,
  );
}

export default ModalEventView;
