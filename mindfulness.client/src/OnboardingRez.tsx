import "./App.css";
import "./Profile.css";
import Header from "./components/Header.tsx";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

function OnboardingRez() {
  const [answers, setAnswers] = useState<{ [key: string]: any }>({});

  useEffect(() => {
    getAnswers();
  }, []);

  const getAnswers = async () => {
    try {
      const response = await fetch(
        `https://programsko-inzenjerstvo-x2fd.onrender.com/api/StartQuestionnaire`,
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

      const data = await response.json();
      setAnswers(data);
      console.log(data);
    } catch (error) {
      console.error("Greška: ", error);
    }
  };

  return (
    <>
      <div className="background">
        <div className="profileContainer">
          <Header />
          <div className="containerAnketa">
            <p className="res">Rezultati ankete</p>
            <div className="containerListQ">
              {Object.entries(answers).length > 0 ? (
                Object.entries(answers).map(([key, value]) =>
                  key === "id" ? null : (
                    <div key={key} className="containerQuestions">
                      <div>
                        <span className="question">{key}</span>
                      </div>
                      <div className="answer">{(value / 5) * 100}%</div>
                    </div>
                  )
                )
              ) : (
                <p>Nema dostupnih odgovora</p>
              )}
            </div>
            <Link className="fp" to="/profile">
              Natrag na profil
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default OnboardingRez;
