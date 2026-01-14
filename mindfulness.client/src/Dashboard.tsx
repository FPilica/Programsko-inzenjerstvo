import "./App.css";
import "./Dashboard.css";
import Header from "./components/Header.tsx";
import { CaretRightIcon } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import AdminDash from "./AdminDash.tsx";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState<string | null>(null);

  const fetchUserData = async () => {
    try {
      const response = await fetch(
        `https://localhost:7070/api/userprofile/getprofile`,
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

      const userData = await response.json();
      setUser(userData);
      setUserRole(userData.role);
      localStorage.setItem("userRole", userData.role);

    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };
  useEffect(() => {
    // fetchUserData();
    if (!userRole) {
      localStorage.setItem("userRole", "user"); // (user, coach, admin) postavi ulogu za koju zelis da bude dok ne spojimo sa backendom
    }
    setUserRole(localStorage.getItem("userRole") || "");
  }, []);

  if (userRole === "admin") {

    return (
      <>
        <AdminDash />
      </>
    )

  } else if (userRole === "coach" || userRole === "user") {

    return (
      <>
        <div className="background">
          <div className="dashboardContainer">
            <Header userRole={userRole || ""} />
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
}

export default Dashboard; 
