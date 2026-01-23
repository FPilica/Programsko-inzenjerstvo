import "./App.css";
import Header from "./components/Header";
import CalendarComponent from "./components/CalendarComponent";

function Calendar() {
  const userRole = localStorage.getItem("userRole");

  return (
    <>
      <div className="background">
        <div className="calendarContainer">
          <Header userRole={userRole || ""}/>
          <div className="calendarContent">
            <CalendarComponent />
          </div>
        </div>
      </div>
    </>
  );
}

export default Calendar;
