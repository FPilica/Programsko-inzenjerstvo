// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import "./App.css";
// auth
// npx vite u cmd u folder

import { Link } from "react-router-dom";
import Header from './components/Header';

function App() {
  return (
    <>
      <div className="dashboardContainer">
        <Header />
        <h1>Sadržaj</h1>
      </div>
    </>
  );
}

export default App;
