import "./App.css";
import Header from "./components/Header";

function Stats() {
  const userRole = localStorage.getItem("userRole");
  return (
    <>
      <div className="background">
        <div className="statsContainer">
          <Header userRole={userRole || ""}/>
          <h1>Statistics</h1>
        </div>
      </div>
    </>
  );
}

export default Stats;
