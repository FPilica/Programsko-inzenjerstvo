import "./App.css";
import "./Dashboard.css";
import Header from "./components/Header.tsx";

function Dashboard() {
  return (
    <>
      <div className="background">
        <div className="dashboardContainer">
          <Header />
          <h1>Dashboard</h1>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
