// import { useState } from 'react'
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
      <h1>Mindfulness</h1>
      
      
      <div className='gumbi_za_auth'>
        <button> 
            {/* ovako se ide na druge stranice */}
          <Link to = "auth/login" className='prijava'>Prijavi me</Link>
        </button>
        <p></p>
        <button>
          <Link to = "auth/reg" className='registracija'>Registriraj me</Link>
        </button>
      </div>
      
    </>
  )
}

export default App
