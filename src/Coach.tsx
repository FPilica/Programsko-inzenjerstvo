// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'
// auth 
// npx vite u cmd u folder
import Header from './components/Header'

import { Link } from 'react-router-dom'

function App() {
  return (
    <>
      <Header />
      <div>
        <Link to = "home">home</Link>
      </div>
    </>
  )
}

export default App
