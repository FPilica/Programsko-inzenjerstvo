import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'
// glavni 
// npx vite u cmd u folder

import { Link } from 'react-router-dom'

function App() {
//   const [count, setCount] = useState(0)

  return (
    <>
      <h1>Mindfulness stranica</h1>
      
      <p className="read-the-docs">
        Dobrodošli na Mindfulness stranicu.
      </p>
      <div>
        <p>
          kratki opis stranice, slika
        </p>
      </div>
      <div>
        <button> 
            {/* ovako se ide na druge stranice */}
          <Link to = "auth" >Prijavi me</Link>
        </button>
        <button>
          <Link to = "auth" >Registriraj me</Link>
        </button>
      </div>
      
    </>
  )
}

export default App
