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
        <p>Zaboravili se lozinku?</p>
        <form>
          <label>E-mail*</label><br/>
          <input type="text" id="email" name="email" ></input><br/>
          <input className='submit' type="submit" value="Prijavi me"></input>
        </form>
        <div>
            <button>
                <Link to = "home">Odustani</Link>
            </button>
        </div>
        <div>
            <button>
                <Link to = "home">Pošalji</Link>
            </button>
        </div>
        <div>
          </div>
      </div>
      
    </>
  )
}

export default App
