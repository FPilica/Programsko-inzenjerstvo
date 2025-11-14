import { useState, useEffect } from 'react'
import "./App.css";
// auth
// npx vite u cmd u folder

import { Link } from "react-router-dom";
import Header from "./components/Header";

function App() {
  const [userP, setUser] = useState<{ [key: string]: any }>({});
  
  useEffect(() => {
      getUser();
  }, []);
   
  const getUser = async () => {
    try {
      const response = await fetch(
        `https://programsko-inzenjerstvo-x2fd.onrender.com/api/userprofile/getprofile`,
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
      console.log(user);
      if (user.dateOfBirth) {
        const date = new Date(user.dateOfBirth);
        user.dateOfBirth = `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}.`;
        if(user.dateOfBirth === "1.1.1.")
          user.dateOfBirth = "01.01.2000."
      }
      // slučaj kada nije dan gender, ne radi ATM
      if (user.gender === "Undefined"){ 
        user.gender = "O"
      }
    } catch (error) {
      console.error("Greška: ", error);
    }
  };

  return (
    <>
      <div className="background">
        <div className="profileContainer">
          <Header />
          <div className="containerProfile">
            <p className="title">Moj profil</p>
            <div className="containerList">
              <p>Ime: </p> <p className="userInput">{userP.firstName}</p>
              <p>Prezime: </p> <p className="userInput">{userP.lastName}</p>
              <p>E-mail: </p> <p className="userInput">mail</p>
                                        {/* user.email */}
              <p>Datum rođenja: </p> <p className="userInput">{userP.dateOfBirth}</p>
              <p>Rod: </p> 
              {userP.gender === "Male" &&<p className="userInput">Muškarac</p>}
              {userP.gender === "Female" &&<p className="userInput">Žena</p>}
              {userP.gender === "Other" &&<p className="userInput">Ostalo</p>}
              <Link className="fp" to="/profile/setprofile">
                Postavke profila
              </Link>
              <Link className="fp" to="/profile/onboardingrez">Anketa</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
