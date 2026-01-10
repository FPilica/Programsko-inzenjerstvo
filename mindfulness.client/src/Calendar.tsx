
import "./App.css";
import Header from "./components/Header";
import { CheckAuth } from "./components/CheckAuth";

function CalendarComponent() {
  return (
    <>
      <div className="background">
        <div className="calendarContainer">
          <Header />
          <h1>Kalendar</h1>
        </div>
      </div>
    </>
  );
}

const Calendar = CheckAuth(CalendarComponent);
export default Calendar;
