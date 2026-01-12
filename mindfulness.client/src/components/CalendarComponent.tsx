import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import { useState } from "react";
import ModalEventView from "./ModalEventView";
import ModalEventAdd from "./ModalEventAdd";
import "./CalendarComponent.css";

function CalendarComponent() {
    const [events, setEvents] = useState<any[]>([]);
    const [isOpenView, setIsOpenView] = useState(false);
    const [isOpenAdd, setIsOpenAdd] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<any>(null);
    const [selectInfo, setSelectInfo] = useState<any>(null);

    const handleSelect = (selectInfo: any) => {
        setSelectInfo(selectInfo);
        setIsOpenAdd(true);
    };

    const handleAddEvent = () => {

        const newEvent = JSON.parse(localStorage.getItem("newEvent") || "{}");
        if (newEvent && newEvent.title) {
            setEvents([...events, newEvent]);
            localStorage.removeItem("newEvent");
        }

        setSelectInfo(null);
        setIsOpenAdd(false);
    };

    const handleEventClick = (clickInfo: any) => {
        setSelectedEvent(clickInfo.event);
        setIsOpenView(true);
    };

    const handleDeleteEvent = () => {
        if (selectedEvent && window.confirm("Jeste li sigurni da želite izbrisati ovaj događaj?")) {
            setEvents(events.filter((event) => event.id !== selectedEvent.id));
            setIsOpenView(false);
            setSelectedEvent(null);
        }
    };

  return (
    <>
      <div className="calendarContent">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView={"dayGridMonth"}
          headerToolbar={{
            start: "today prev,next",
            center: "title",
            end: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          height={"78vh"}
          locale={"hr"}
          firstDay={1}
          buttonText={{
            today: "Danas",
            month: "Mjesec",
            week: "Tjedan",
            day: "Dan",
          }}
          noEventsText="Nema događaja za prikazati"
          nowIndicator={true}
          selectable={true}
          select={handleSelect}
          eventColor={"#957CFE"}
          events={events}
          eventClick={handleEventClick}
        />

        <FullCalendar
          plugins={[listPlugin, interactionPlugin]}
          initialView={"listWeek"}
          headerToolbar={{
            start: "today",
            center: "title",
            end: "prev,next",
          }}
          height={"78vh"}
          locale={"hr"}
          firstDay={1}
          buttonText={{
            today: "Danas",
            month: "Mjesec",
            week: "Tjedan",
            day: "Dan",
          }}
          noEventsText="Nema događaja za prikazati"
          events={events}
          eventColor={"#957CFE"}
          eventClick={handleEventClick}
        />
        {selectedEvent && (
          <ModalEventView isOpen={isOpenView} event={selectedEvent} onClose={() => {setIsOpenView(false); setSelectedEvent(null);} } deleteEvent={handleDeleteEvent} />
        )}
        {selectInfo && (
            <ModalEventAdd isOpen={isOpenAdd} onClose={() => {setIsOpenAdd(false); setSelectInfo(null);} } selectInfo={selectInfo} addEvent={handleAddEvent}/>
        )}
      </div>
    </>
  );
}

export default CalendarComponent;
