import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'
// glavni 
// npx vite u cmd u folder
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <h1>Mindfulness stranica</h1>
      <div className="card">
        <button onClick={
            () => setCount((count) => count + 1)
          }>
          count is {count}
        </button>
        
      </div>
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
          Prijavi me
        </button>
        <button>
          Registriraj me
        </button>
      </div>
    </>
  )
}

export default App
