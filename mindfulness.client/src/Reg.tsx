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
      
      <div className='container_auth'>
        <h1>mindfulness</h1>
        <p>Registracija</p>
        <form>
          <label>E-mail*</label><br/>
          <input type="text" id="email" name="email" ></input><br/>
          <label>Lozinka*</label><br/>
          <input type="text" id="pass" name="pass"></input><br/>
          <input className='submit' type="submit" value="Registriraj me"></input>
        </form>
        <div>
          <Link to = "home">home</Link>
        </div>
      </div>
      
    </>
  )
}

export default App
