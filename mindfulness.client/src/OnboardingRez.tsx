import "./App.css";
import "./Profile.css";
import Header from "./components/Header.tsx";
import questions from "./questions.tsx";
import { Link } from "react-router-dom";

function OnboardingRez() {
  return (
    <>
      <div className="background">
        <div className="profileContainer">
          <Header />
          <div className="containerAnketa">
            <p className="rez">Rezultati ankete</p>
            <div className="containerListQ">
              {questions.map(question => (
                    <div className="containerQuestions">
                      <div>
                        <span className="question">
                          {question.text}
                        </span>
                      </div>
                      <div className="odgovori">
                        {question.answers.map(answer => (
                          <span className="answer"> {answer} </span>
                        ))}
                      </div>
                    </div>
                  )) }
            </div>
            <Link className="fp" to="/profile">Natrag na profil</Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default OnboardingRez;
