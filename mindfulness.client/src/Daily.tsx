import { useState, useEffect } from 'react';
import "./App.css";
import "./Daily.css"
import logoPurple from "./assets/logo_boja 2.png";
import { Link, useNavigate } from "react-router-dom";


const DailyCheckIn = () => {
    const navigate = useNavigate();  
    
    const [_, setUser] = useState<{ [key: string]: any }>({});
    let [streak, setStreak] = useState(0);
    const [mood, setMood] = useState("");
    const [active, setPhysicalActivity] = useState("");
    const [cofein, setCaffeine] = useState("");
    const [sleep, setSleepScore] = useState("");
    const [alcohol, setAlcohol] = useState("");
    const [notes, setDailyNotes] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    
    try {
      console.log(
        
      );

      // ovdje treba biti funkcija za promjenit ig
      const response = await fetch(
        "https://programsko-inzenjerstvo-x2fd.onrender.com/api/dailytasks",
        {
          method: "POST",
          headers: {
            accept: "text/plain",
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          },
          body: JSON.stringify({
            mood: mood,
            Caffeine: cofein,
            PhysicalActivity: active,
            Alcohol: alcohol,
            SleepScore: sleep,
            DailyNotes: notes
          }),
        }
      );

      console.log("Response status:", response.status);
      const responseData = await response.text();
      console.log("Response body:", responseData);

      if (!response.ok) {
        throw new Error(
          `Neuspjela promjena: ${response.status} ${responseData}`
        );
      }

      // Na login nakon registracije
      console.log("Promjena uspjesna");
      navigate("/dashboard");
    } catch (error) {
      console.error("Neuspjela promjena:", error);
      alert("Neuspjela promjena: " + (error as Error).message);
    }
  };

    const streakUp = async (newStreak: number) =>{
    
      try {
        const response = await fetch('https://programsko-inzenjerstvo-x2fd.onrender.com/api/userprofile/setprofile', {
          method: 'POST',
          headers: {
            accept: "text/plain",
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          },
          body: JSON.stringify({
            streak: newStreak
          }),
        });

        console.log('Response status:', response.status);
        const responseData = await response.text();
        console.log('Response body:', responseData);

        if (!response.ok) {
          throw new Error(`streak update failed: ${response.status} ${responseData}`);
        }

        return true;

      } catch (error) {
        console.error('Neuspjesan update:', error);
        alert('Neuspješan: ' + (error as Error).message);
        return false;
      }
    };

    const fetchUserData = async () => {
      // dohvaća daily data za user
        try {
          const response = await fetch(
              `https://programsko-inzenjerstvo-x2fd.onrender.com/api/userprofile/getprofile`,
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
          // za streak
          const today = new Date();
          // const userDay = new Date(user.lastCheckin);
          // const userCreate = new Date(user.createdAt);
          // console.log(user);
          // console.log(today);
          // console.log(today.toISOString().split('T')[0]);
          // console.log(userDay.toISOString().split('T')[0]);
          // streak = user.streak;
          // if (today.toISOString().split('T')[0] === userCreate.toISOString().split('T')[0]){
          //   streak = 1;
          // }
          // else if(userDay.toISOString().split('T')[0] !== today.toISOString().split('T')[0]){
          //   const td = today.toISOString().split('T')[0];
          //   const ud = userDay.toISOString().split('T')[0]
          //   const tdarr = td.split('-');
          //   const udarr = ud.split('-');
          //   if(Number(tdarr[2]) === (Number(udarr[2]) + 1)){   
          //     streak = user.streak + 1;
          //   }
          // }else{
          //   streak = 1;
          // }

          // setStreak(streak);
          // streakUp(streak);

          // novo
           const getValidDate = (value: any): Date | null => {
            if (!value) return null;
            const d = new Date(value);
            return isNaN(d.getTime()) ? null : d;
          };
          const userDay = getValidDate(user.lastCheckin);
          const userCreate = getValidDate(user.createdAt);
          const hasUserStreak = typeof user.streak === "number" && !isNaN(user.streak);
          let computedStreak = 0;
          if (userDay && userCreate && hasUserStreak) {
            console.log(user);
            console.log(today);
            const todayStr = today.toISOString().split('T')[0];
            const userDayStr = userDay.toISOString().split('T')[0];
            const userCreateStr = userCreate.toISOString().split('T')[0];
            console.log(todayStr);
            console.log(userDayStr);
            computedStreak = user.streak;
            if (todayStr === userCreateStr) {
              computedStreak = 1;
            } else if (userDayStr !== todayStr) {
              const [tYear, tMonth, tDay] = todayStr.split('-').map(Number);
              const [uYear, uMonth, uDay] = userDayStr.split('-').map(Number);
              // Check if today is exactly one day after the last check-in (same month/year)
              if (tYear === uYear && tMonth === uMonth && tDay === (uDay + 1)) {
                computedStreak = user.streak + 1;
              } else {
                // Break in streak
                computedStreak = 1;
              }
            } else {
              computedStreak = 1;
            }
          }
          setStreak(computedStreak);
          streakUp(computedStreak);
        } catch (error) {
        console.error("Error fetching user data:", error);
        }
    };
    
    useEffect(() => {
        // trebam provjeriti ako je user prvi put danas login
        // onda trebam povećat streak
        fetchUserData();
    }, []);
  
  return (
    <>
      <div className="containerDailyFull">
        <div className="containerDaily">
          <Link className="logoLink" to="/">
            <img src={logoPurple} alt="logo_purple" width="177" height="41" />
          </Link>
          <div className="title">
            Daily Check-In
          </div>
          <div className="streak">
            <p>Dobrodošli!</p>
            <p>Broj Daily Check-In:</p>
            <p>{streak}</p>
          </div>
          <div>
            <form className="formDailyContainer" onSubmit={handleSubmit}>
              <div className="questionContainer">
                <label htmlFor="mood">
                  Kako se danas osjećate na skali od 1 (jako loše) do 10 (jako dobro)? 
                </label>
                <input
                  type="number"
                  id="mood"
                  min = "1"
                  max = "10"
                  value={mood}
                  onChange={(e) => setMood(e.target.value)}
                  required
                />
              </div>
              <div className="questionContainer">
                <label htmlFor="sleep">
                  Kako ste spavali na skali od 1 (jako loše) do 10 (jako dobro)? 
                </label>
                <input
                  type="number"
                  id="sleep"
                  min = "1"
                  max = "10"
                  value={sleep}
                  onChange={(e) => setSleepScore(e.target.value)}
                  required
                />
              </div>
              <div className="questionContainer">
                <label htmlFor="cofein">
                  Kolika je Vaša razina kofeina danas na skali od 1 (jako niska) do 10 (jako visoka)?
                </label>
                <input
                  type="number"
                  id="cofein"
                  min = "1"
                  max = "10"
                  value={cofein}
                  onChange={(e) => setCaffeine(e.target.value)}
                  required
                />
              </div>
              <div className="questionContainer">
                <label htmlFor="alcohol">
                  Kolika je Vaša razina alkohola danas na skali od 1 (jako niska) do 10 (jako visoka)? 
                </label>
                <input
                  type="number"
                  id="alcohol"
                  min = "1"
                  max = "10"
                  value={alcohol}
                  onChange={(e) => setAlcohol(e.target.value)}
                  required
                />
              </div>
              <div className="questionContainer">
                <label htmlFor="active">
                  Koliko ste bili fizički aktivni danas na skali od 1 (jako malo) do 10 (jako puno)? 
                </label>
                <input
                  type="number"
                  id="active"
                  min = "1"
                  max = "10"
                  value={active}
                  onChange={(e) => setPhysicalActivity(e.target.value)}
                  required
                />
              </div>
              <div className="notesContainer">
                <label htmlFor="notes">
                  Dodatne napomene o raspoloženju
                </label>
                <textarea
                  id="notes"
                  placeholder="Opcionalno..."
                  rows={4}
                  cols={50}
                  value={notes}
                  onChange={(e) => setDailyNotes(e.target.value)}
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