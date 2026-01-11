import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import { useState } from "react";
import "./CalendarComponent.css";

function CalendarComponent() {
  const [events, setEvents] = useState<any[]>([]);

  const handleSelect = (selectInfo: any) => {
    let title = prompt("Unesite naziv događaja:");

    selectInfo.view.calendar.unselect(); // clear date selection

    if (title) {
      const newEvent = {
        id: String(Date.now()),
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        allDay: selectInfo.allDay,
      };
      setEvents([...events, newEvent]);
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
        />
      </div>
    </>
  );
}

export default CalendarComponent;
