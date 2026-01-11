import "./App.css";
import Header from "./components/Header";
import CalendarComponent from "./components/CalendarComponent";

function Calendar() {
  return (
    <>
      <div className="background">
        <div className="calendarContainer">
          <Header />
          {/* <h1>Kalendar</h1> */}
          <div className="calendarContent">
            <CalendarComponent />
          </div>
        </div>
      </div>
    </>
  );
}

export default Calendar;
