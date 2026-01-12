import { createPortal } from "react-dom";
import { useState } from "react";
import "./ModalEvent.css";

function ModalEventAdd({ isOpen, onClose, selectInfo, addEvent}: { isOpen: boolean; onClose: () => void; selectInfo: any; addEvent: () => void;}) {
    if (!isOpen) return null;

    const [title, setTitle] = useState("");
    const [start, setStart] = useState(selectInfo.startStr ? selectInfo.startStr : "");
    const [end, setEnd] = useState(selectInfo.endStr ? selectInfo.endStr : "");
    const [allDay, setAllDay] = useState(selectInfo.allDay ? selectInfo.allDay : false);
    const [description, setDescription] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        localStorage.setItem("newEvent", JSON.stringify({
            id: String(Date.now()),
            title: title,
            start: start,
            end: end,
            allDay: allDay,
            description: description
        }));

        addEvent();
    }

    return createPortal(
      <div className="modalOverlay">
        <div className="modalContent">
          <button className="myButton modalCloseButton" onClick={onClose}>x</button>

          <h2>Dodaj novi događaj</h2>
          <form className="addEventForm" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="title">Naziv događaja: </label>
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
                Početak: {new Date(start).toLocaleString("hr-HR", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </label>
              <input
                type="datetime-local"
                id="start"
                name="start"
                value={start}
                onChange={(e) => setStart(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="end">
                Kraj: {new Date(end).toLocaleString("hr-HR", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </label>
              <input
                type="datetime-local"
                id="end"
                name="end"
                value={end}
                onChange={(e) => setEnd(e.target.value)}
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