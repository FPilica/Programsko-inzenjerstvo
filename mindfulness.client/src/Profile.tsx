import { useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import Header from "./components/Header";

function Profile() {
  const navigate = useNavigate();

  const [userP, setUser] = useState<{ [key: string]: any }>({});
  const userRole = localStorage.getItem("userRole");
  
  useEffect(() => {
      getUser();
  }, []);
   
  const getUser = async () => {
    try {
      const response = await fetch(
        `https://localhost:7070/api/userprofile/getprofile`,
        {
          method: "GET",
          headers: {
            "accept": "text/plain",
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("auth_token")}`,
          },
        }
      );
    
      if (!response.ok) {
        throw new Error("Something went wrong!");
      }
    
      const user = await response.json();
      setUser(user);
      if (user.dateOfBirth) {
        const date = new Date(user.dateOfBirth);
        user.dateOfBirth = `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}.`;
        if(user.dateOfBirth === "1.1.1.")
          user.dateOfBirth = "01.01.2000."
      }

      if (user.gender === "Undefined"){ 
        user.gender = "O"
      }
    } catch (error) {
      console.error("Greška: ", error);
    }
  };

  const handleLogout = () => {
    if (window.confirm("Jeste li sigurni da se želite odjaviti?")) {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("userRole");
      navigate("/auth/login");
    }
  };

  return (
    <>
      <div className="background">
        <div className="profileContainer">
          <Header userRole={userRole || ""}/>
          <div className="containerProfile">
            <p className="title">Moj profil</p>
            <div className="containerList">
              <p>Ime: </p> <p className="userInput">{userP.firstName}</p>
              <p>Prezime: </p> <p className="userInput">{userP.lastName}</p>
              <p>E-mail: </p> <p className="userInput">{userP.email}</p>
              <p>Datum rođenja: </p> <p className="userInput">{userP.dateOfBirth}</p>
              <p>Rod: </p> 
              {userP.gender === "Male" &&<p className="userInput">Muškarac</p>}
              {userP.gender === "Female" &&<p className="userInput">Žena</p>}
              {userP.gender === "O" &&<p className="userInput">Ostalo</p>}
            </div>
            
            <div className="profileActions">
              <button className="myButton setProfileButton" onClick={() => navigate("/profile/setprofile")}>
                Uredi profil
              </button>
              <button className="myButton onboardingRezButton" onClick={() => navigate("/profile/onboardingrez")}>
                Rezultati ankete
              </button>
              <button className="myButton logoutButton" onClick={handleLogout}>
                Odjavi se
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Profile;
