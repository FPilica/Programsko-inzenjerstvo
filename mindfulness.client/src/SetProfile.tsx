// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import "./App.css";
import "./Profile.css";
import Header from "./components/Header.tsx";

import { Link } from "react-router-dom";

function SetProfile() {
  return (
    <>
      <div className="background">
        <div className="profileContainer">
          <Header />
          <div className="containerProfile">
            <p>Uređivanje profila</p>
            <div className="containerList">
              <p>Ime: </p> <p className="userInput">Ivan</p>
              <p>Prezime: </p> <p className="userInput">Lukić</p>
              <p>E-mail: </p> <p className="userInput">a@a</p>
              <p>Datum rođenja: </p> <p className="userInput">datum</p>
              <p>Spol: </p> <p className="userInput">Muškarac</p>
              <Link className="fp" to="/auth/forgotpass">
                Promijeni lozinku
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default SetProfile;
