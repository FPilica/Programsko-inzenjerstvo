// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'
// auth 
// npx vite u cmd u folder

import { Link } from 'react-router-dom'

function App() {
  return (
    <>
      <h1>Mindfulness stranica</h1>
      <h1>
        AUTH
      </h1>
      <div>
        <p>
          kratki opis stranice, slika
        </p>
      </div>
      <form>
        <label>e-Mail:</label><br/>
        <input type="text" id="email" name="email"></input><br/>
        <label>Username:</label><br/>
        <input type="text" id="uname" name="uname"></input><br/>
        <label>Password:</label><br/>
        <input type="text" id="pass" name="pass"></input><br/>
        <input type="submit" value="Submit"></input>
      </form>
      <div>
        <Link to = "home">home</Link>
      </div>
    </>
  )
}

export default App
