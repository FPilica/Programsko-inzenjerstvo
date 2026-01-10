import "./App.css";
import "./Dashboard.css";
import Header from "./components/Header.tsx";
import { CaretRightIcon } from "@phosphor-icons/react";
import { CheckAuth } from "./components/CheckAuth.tsx";

function DashboardComponent() {
  return (
    <>
      <div className="background">
        <div className="dashboardContainer">
          <Header />
          <p className="dashGreeting">Pozdrav, [Ime]</p>
          <div className="cardsContainer">
            <div className="dashCard dailyFocusCard">
              <CaretRightIcon className="cardArrow" size={16} color="gray" />
              <p>Dnevni</p>
              <p>fokus</p>
            </div>
            <div className="dashCard streakCard">
              <CaretRightIcon className="cardArrow" size={16} color="gray" />
              <p>Dan</p>
              <p>8</p>
              <p>Čestitamo</p>
            </div>
            <div className="dashCard dailyCheckCard">
              <CaretRightIcon className="cardArrow" size={16} color="gray" />
              <p>Dnevni</p>
              <p>check-in</p>
            </div>
          </div>
          <div className="recommendedPlan">Preporučeni plan</div>
          <div className="recommendedContent">Preporučeni sadržaj</div>
        </div>
      </div>
    </>
  );
}

const Dashboard = CheckAuth(DashboardComponent);
export default Dashboard;
