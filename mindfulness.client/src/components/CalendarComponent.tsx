import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import { useEffect, useState } from "react";
import ModalEventView from "./ModalEventView";
import ModalEventAdd from "./ModalEventAdd";
import "./CalendarComponent.css";

function CalendarComponent() {
  const [events, setEvents] = useState<any[]>([]);
  const [isOpenView, setIsOpenView] = useState(false);
  const [isOpenAdd, setIsOpenAdd] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [selectInfo, setSelectInfo] = useState<any>(null);

  // kad se bude moglo sa drugih stranica dodat da se moze ucitat samo ce svi localStorage ic na bazu
  useEffect(() => {
    const eventsData = localStorage.getItem("events");
    if (eventsData) {
      try {
        const newEvents = JSON.parse(eventsData);
        setEvents(newEvents);
      } catch (e) {
        console.error("Greška pri parsiranju novih događaja:", e);
      }
    }
  }, []);

  const handleSelect = (selectInfo: any) => {
    setSelectInfo(selectInfo);
    setIsOpenAdd(true);
  };

  const handleAddEvent = () => {
    const eventsData = localStorage.getItem("events");
    if (eventsData) {
      try {
        const allEvents = JSON.parse(eventsData);
        setEvents(allEvents);
      } catch (e) {
        console.error("Greška pri parsiranju događaja:", e);
      }
    }
    setSelectInfo(null);
    setIsOpenAdd(false);
  };

  const handleEventClick = (clickInfo: any) => {
    setSelectedEvent(clickInfo.event);
    setIsOpenView(true);
  };

  const handleDeleteEvent = () => {
    if (
      selectedEvent &&
      window.confirm("Jeste li sigurni da želite izbrisati ovaj događaj?")
    ) {
      const updatedEvents = events.filter(
        (event) => event.id !== selectedEvent.id
      );
      setEvents(updatedEvents);
      localStorage.setItem("events", JSON.stringify(updatedEvents));
      setIsOpenView(false);
      setSelectedEvent(null);
    }
  };

  return (
    <>
      <div className="calendarContent">
        <button className="myButton addEventButton nonDesktop" onClick={handleSelect}>+ Dodaj događaj</button>
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
          allDayText="Cijeli dan"
        />

        <div className="rightSideCalendar">
          <button className="myButton addEventButton desktopOnly" onClick={handleSelect}>+ Dodaj događaj</button>
          <FullCalendar
            plugins={[listPlugin, interactionPlugin]}
            initialView={"listWeek"}
            headerToolbar={{
              start: "today",
              center: "title",
              end: "prev,next",
            }}
            height={"70vh"}
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
            allDayText="Cijeli dan"
          />
              </div>
              
        {selectedEvent && (
          <ModalEventView
            isOpen={isOpenView}
            event={selectedEvent}
            onClose={() => {
              setIsOpenView(false);
              setSelectedEvent(null);
            }}
            deleteEvent={handleDeleteEvent}
          />
        )}
        {selectInfo && (
          <ModalEventAdd
            isOpen={isOpenAdd}
            onClose={() => {
              setIsOpenAdd(false);
              setSelectInfo(null);
            }}
            selectInfo={selectInfo}
            addEvent={handleAddEvent}
          />
        )}
      </div>
    </>
  );
}

export default CalendarComponent;
