// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import "./App.css";
// auth
// npx vite u cmd u folder

import { Link } from "react-router-dom";
import Header from "./components/Header";

function App() {
  return (
    <>
      <div className="background">
        <div className="profileContainer">
          <Header />
          <div className="containerProfile">
            <p className="title">Moj profil</p>
            <div className="containerList">
              <p>Ime: </p> <p className="userInput">Ivan</p>
              <p>Prezime: </p> <p className="userInput">Lukić</p>
              <p>E-mail: </p> <p className="userInput">a@a</p>
              <p>Datum rođenja: </p> <p className="userInput">datum</p>
              <p>Spol: </p> <p className="userInput">Muškarac</p>
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
