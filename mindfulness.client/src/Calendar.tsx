// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import "./App.css";
// auth
// npx vite u cmd u folder
import Header from "./components/Header";

function App() {
  return (
    <>
      <div className="background">
        <div className="calendarContainer">
          <Header />
          <h1>Kalendar</h1>
        </div>
      </div>
    </>
  );
}

export default App;
