import { useState, useEffect } from 'react';
import "./App.css";
import "./Daily.css"
import logoPurple from "./assets/logo_boja 2.png";
import { Link, useNavigate } from "react-router-dom";

const DailyCheckIn = () => {
    const navigate = useNavigate();
    const [hasCheckedIn, setHasCheckedIn] = useState(false);
    const [checkInMessage, setCheckInMessage] = useState('');
  
    const [user, setUser] = useState(null);
    const [userRole, setUserRole] = useState<string | null>(null); // neću trebat

    const fetchUserData = async () => {
      // dohvaća daily data za user
        try {
        const response = await fetch(
            `https://localhost:7070/api/userprofile/getprofile`, // api/dailytasks/inputDailyData
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
        localStorage.setItem("userRole", userData.role); // neću trebat

        } catch (error) {
        console.error("Error fetching user data:", error);
        }
    };
    
    useEffect(() => {
        // trebam provjeriti ako je user prvi put danas login
        // onda trebam povećat streak
        
        const today = new Date().toDateString();
        const lastCheckIn = localStorage.getItem('lastCheckInDate');
        fetchUserData();
        if (lastCheckIn === today) {
        setHasCheckedIn(true);
        setCheckInMessage("You've already checked in today!");
        }
    }, []);
  
    const handleCheckIn = () => {
      const today = new Date().toDateString();
      
      // Save check-in to localStorage
      localStorage.setItem('lastCheckInDate', today);
      // localStorage.setItem('checkInStreak', 
      //   parseInt(localStorage.getItem('checkInStreak') || '0') + 1
      // );
      
      setHasCheckedIn(true);
      setCheckInMessage("Successfully checked in for today!");
      
      // Optional: Trigger any additional actions
      onCheckInSuccess();
    };
  
  const onCheckInSuccess = () => {
    // Add your reward logic here
    console.log("Check-in successful!");
  };
  
  const getStreak = () => {
    return localStorage.getItem('checkInStreak') || '0';
  };
  
  return (
    <>
      <div className="containerHomeAndAuth">
        <div className="onboardingContainer">
          <Link className="logoLink" to="/">
            <img src={logoPurple} alt="logo_purple" width="177" height="41" />
          </Link>
          <div className="title">
            Daily Check-In
          </div>
          <div className="streak">
            <p>Dobrodošli!</p>
            <p>Broj Daily Check-In:</p>
            <p>8</p>
          </div>
          <div>
            <form className="formContainer">
              <div className="questionContainer">
                <label>
                  
                  Kako se danas osjećate na skali od 1 (jako loše) do 10 (jako dobro)? 
                </label>
                <input
                  type="number"
                  id="mood"
                  min = "1"
                  max = "10"
                  required
                />
              </div>
              <div className="questionContainer">
                <label>
                  Kako ste spavali na skali od 1 (jako loše) do 10 (jako dobro)? 
                </label>
                <input
                  type="number"
                  id="sleep"
                  min = "1"
                  max = "10"
                  required
                />
              </div>
              <div className="questionContainer">
                <label>
                  Kolika je Vaša razina stresa na skali od 1 (jako niska) do 10 (jako visika)? 
                </label>
                <input
                  type="number"
                  id="stress"
                  min = "1"
                  max = "10"
                  required
                />
              </div>
              <div className="questionContainer">
                <label>
                  Koliko ste fokusirani danas na skali od 1 (jako loše) do 10 (jako dobro)? 
                </label>
                <input
                  type="number"
                  id="focus"
                  min = "1"
                  max = "10"
                  required
                />
              </div>
              <div className="questionContainer">
                <label>
                  Kolika je Vaša razina alkohola ili kofeina danas na skali od 1 (jako niska) do 10 (jako visoka)? 
                </label>
                <input
                  type="number"
                  id="alcohol"
                  min = "1"
                  max = "10"
                  required
                />
              </div>
              <div className="questionContainer">
                <label>
                  Koliko ste bili fizički aktivni danas na skali od 1 (jako malo) do 10 (jako puno)? 
                </label>
                <input
                  type="number"
                  id="activity"
                  min = "1"
                  max = "10"
                  required
                />
              </div>
              <div className="notesContainer">
                <label className="">
                  Dodatne napomene o raspoloženju
                </label>
                <textarea
                  id="notes"
                  placeholder="Opcionalno..."
                  rows={4}
                  cols={50}
                />
              </div>
              <button className="myButton submit" type="submit">
                Pošalji
              </button>
            </form>
          </div>
          <button className="myButton return" onClick={() => navigate(-1)}>
            Odustani
          </button>
        </div>
      </div>
    </>
  );
};

export default DailyCheckIn;