import "./App.css";
import Header from "./components/Header";
import { CheckAuth } from "./components/CheckAuth";

function StatsComponent() {
  return (
    <>
      <div className="background">
        <div className="statsContainer">
          <Header />
          <h1>Statistics</h1>
        </div>
      </div>
    </>
  );
}

const Stats = CheckAuth(StatsComponent);
export default Stats;
