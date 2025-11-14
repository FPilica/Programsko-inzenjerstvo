import { useState } from "react";
import "./App.css";
import logoPurple from "./assets/logo_boja 2.png";
import questions from "./questions.tsx";
import { Link, useNavigate } from "react-router-dom";

function Onboarding() {
  const [currQuestionIdx, setCurrQuestionIdx] = useState(1);
  const [answers, setAnswers] = useState(Array(questions.length).fill(null));
  const currQuestion = questions[currQuestionIdx - 1];
  const navigate = useNavigate();

  const handleChange = (value: number) => {
    console.log("Odabrani odgovor:", value);
    const updatedAnswers = [...answers];
    updatedAnswers[currQuestionIdx - 1] = value;
    setAnswers(updatedAnswers);
  };

  const handleNext = () => {
    if (answers[currQuestionIdx - 1] !== null) {
      setCurrQuestionIdx(currQuestionIdx + 1);
    } else {
      alert("Molimo odaberite odgovor prije nego što nastavite.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // obrada
    try {
      const response = await fetch("https://programsko-inzenjerstvo-x2fd.onrender.com/api/StartQuestionnaire", {
        method: "POST",
        headers: {
          'accept': 'text/plain',
          'Content-Type': 'application/json', 
          'Authorization': `Bearer ${localStorage.getItem("auth_token")}`
        },
        body : `{
           "pFocus": ${answers[0]},
           "pSleep": ${answers[1]},
           "pBreathing": ${answers[2]},
           "pStress": ${answers[3]},
           "pAnxiety": ${answers[4]},
           "pGratefulness": ${answers[5]}
        }`
      });

      if (!response.ok) {
        throw new Error("Nije uspjelo");
      }

      console.log("Odgovori korisnika:", answers);
      alert("Hvala vam na ispunjavanju upitnika!");
      navigate("/dashboard");

    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      console.error(error.message);
    }
  };

  return (
    <>
      <div className="containerHomeAndAuth">
        <div className="onboardingContainer">
          <Link className="logoLink" to="/">
            <img src={logoPurple} alt="logo_purple" width="177" height="41" />
          </Link>
          <form className="onboardingForm" onSubmit={handleSubmit}>
            <p>{currQuestion.text}</p>
            <div className="radioOptions">
              {currQuestion.answers.map((answer, i) => (
                <div key={i} className="radioOption">
                  <input
                    type="radio"
                    id={`answer-${i + 1}`}
                    name={`question-${currQuestionIdx}`}
                    value={i + 1}
                    onChange={() => handleChange(i + 1)}
                    checked={answers[currQuestionIdx - 1] === i + 1}
                  />
                  <label htmlFor={`answer-${i + 1}`}>{answer}</label>
                </div>
              ))}
            </div>
            <button
              className="myButton onboardingButton"
              type="button"
              onClick={
                currQuestionIdx === questions.length ? handleSubmit : handleNext
              }
            >
              {currQuestionIdx === questions.length ? "Završi" : "Dalje"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default Onboarding;
