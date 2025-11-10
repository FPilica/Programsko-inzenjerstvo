// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'
import './Profile.css'
import Header from './components/Header.tsx'

import { Link } from 'react-router-dom'

function Profile() {
  return (
    <>
      <Header />
      <div className='containerProfile'>
        <p>Moj profil</p>
        <div className='containerList'>
          <p>Ime: </p> <p className='userInput'>Ivan</p>
          <p>Prezime: </p> <p className='userInput'>Lukić</p>
          <p>E-mail: </p> <p className='userInput'>a@a</p>
          <p>Datum rođenja: </p> <p className='userInput'>datum</p>
          <p>Spol: </p> <p className='userInput'>Muškarac</p>
          <Link className='fp' to="/SetProfile">Postavke profila</Link>
        </div>
      </div>
    </>
  )
}

export default Profile
