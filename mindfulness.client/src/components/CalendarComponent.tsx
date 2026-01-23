import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import { useEffect, useState } from "react";
import ModalEventView from "./ModalEventView";
import ModalEventAdd from "./ModalEventAdd";
import type { Event } from "../types/Event";
import "./CalendarComponent.css";

function CalendarComponent() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isOpenView, setIsOpenView] = useState(false);
  const [isOpenAdd, setIsOpenAdd] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [selectInfo, setSelectInfo] = useState<any>(null);

  useEffect(() => {
    getEvents();
  }, []);

  const getEvents = async () => {
    try {
      const response = await fetch(
        `https://programsko-inzenjerstvo-x2fd.onrender.com/api/event`,
        {
          method: "GET",
          headers: {
            "Accept": "text/plain",
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("auth_token")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Something went wrong!");
      }

      const eventsData = await response.json();

      const formattedEvents = eventsData.map((event: any) => ({
        id: event.id,
        title: event.title,
        start: event.startTime,
        end: event.endTime,
        allDay: event.allDay,
        description: event.description,
        userId: event.userId,
        contentId: event.contentId,
      }));

      setEvents(formattedEvents);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const handleSelect = (selectInfo: any) => {
    setSelectInfo(selectInfo);
    setIsOpenAdd(true);
  };

  const handleAddEvent = async () => {
    setSelectInfo(null);
    setIsOpenAdd(false);
    await getEvents(); 
  };

  const handleEventClick = (clickInfo: any) => {
    setSelectedEvent(clickInfo.event);
    setIsOpenView(true);
  };

  const handleDeleteEventDatabase = async (eventId: string) => {
    try {
      const response = await fetch(
        `https://programsko-inzenjerstvo-x2fd.onrender.com/api/event/${eventId}`,
        {
          method: "DELETE",
          headers: {
            "Accept": "text/plain",
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("auth_token")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Something went wrong!");
      }

    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  const handleDeleteEvent = async () => {

    if (
      selectedEvent &&
      window.confirm("Jeste li sigurni da želite izbrisati ovaj događaj?")
    ) {
      
      await handleDeleteEventDatabase(selectedEvent.id);
      setIsOpenView(false);
      setSelectedEvent(null);
      await getEvents(); 
    }
  };

  return (
    <>
      <div className="calendarContent">
        <button className="myButton addEventButton nonDesktopAddEventButton" onClick={handleSelect}>+ Dodaj događaj</button>
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
          <button className="myButton addEventButton desktopOnlyAddEventButton" onClick={handleSelect}>+ Dodaj događaj</button>
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
