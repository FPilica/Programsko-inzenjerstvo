import { createPortal } from "react-dom";
import { useState } from "react";
import type { Event } from "../types/Event";
import "./ModalEvent.css";

function ModalEventAdd({
  isOpen,
  onClose,
  selectInfo,
  addEvent,
  contentId
}: {
  isOpen: boolean;
  onClose: () => void;
  selectInfo: any;
    addEvent: () => void;
  contentId? : number;
}) {
    if (!isOpen) return null;
    
  const formatDateTimeLocal = (dateStr: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  };

  const [title, setTitle] = useState("");
  const [start, setStart] = useState(selectInfo?.startStr ? formatDateTimeLocal(selectInfo.startStr) : "");
  const [end, setEnd] = useState(selectInfo?.endStr ? formatDateTimeLocal(selectInfo.endStr) : "");
  const [allDay, setAllDay] = useState(selectInfo?.allDay ? selectInfo.allDay : false);
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const existingEvents = JSON.parse(localStorage.getItem("events") || "[]");
    const newEvent : Event = {
      id: String(Date.now()),
      userId: "user123", // treba promijeniti posli
      title: title,
      start: start,
      end: end,
      allDay: allDay,
      description: description,
      contentId: contentId || undefined,
    };

    localStorage.setItem("events", JSON.stringify([...existingEvents, newEvent]));
    addEvent();
  };

  return createPortal(
    <div className="modalOverlay">
      <div className="modalContent">
        <button className="myButton modalCloseButton" onClick={onClose}>
          x
        </button>

        <h2>Dodaj događaj</h2>
        <form className="addEventForm" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="title">Naziv: </label>
            <input
              type="text"
              id="title"
              name="title"
              placeholder="Unesi naziv događaja"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="start">
              Početak:{" "}
              {start
                ? new Date(start).toLocaleString("hr-HR", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "Odaberi"}
            </label>
            <input
              type="datetime-local"
              id="start"
              name="start"
              value={start}
              onChange={(e) => setStart(e.target.value)}
              required={!start}
            />
          </div>
          <div>
            <label htmlFor="end">
              Kraj:{" "}
              {end
                ? new Date(end).toLocaleString("hr-HR", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "Odaberi"}
            </label>
            <input
              type="datetime-local"
              id="end"
              name="end"
              value={end}
              onChange={(e) => setEnd(e.target.value)}
              required={!end}
            />
          </div>
          <div>
            <label htmlFor="allDay">Cjelodnevni događaj: </label>
            <input
              type="checkbox"
              id="allDay"
              name="allDay"
              checked={allDay}
              onChange={() => setAllDay(!allDay)}
            />
          </div>
          <div>
            <label htmlFor="description">Opis: </label>
            <textarea
              id="description"
              name="description"
              placeholder="Unesi opis događaja"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <button type="submit" className="myButton modalAddButton">
            Dodaj
          </button>
        </form>
      </div>
    </div>,
    document.body
  );
}

export default ModalEventAdd;
