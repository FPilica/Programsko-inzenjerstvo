import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import "./App.css";
import "./Profile.css";
import Header from "./components/Header.tsx";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

function SetProfile() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [gender, setGender] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Mapiranje spola na odg. broj iz enumeracije
    let genderValue = 0;
    if (gender === "F") genderValue = 1;
    else if (gender === "O") genderValue = 2;

    try {
      console.log("Promjena s imenom", name, ", prezimenom", surname, 
        ", datumom rođenja", birthDate, "i spolom", gender);
      
      // ovdje treba biti funkcija za promjenit ig
      const response = await fetch('https://localhost:7070/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: name,
          lastName: surname,
          dateOfBirth: birthDate,
          gender: genderValue
        })
      });

      console.log('Response status:', response.status);
      const responseData = await response.text();
      console.log('Response body:', responseData);

      if (!response.ok) {
        throw new Error(`Neupsjela registracija: ${response.status} ${responseData}`);
      }

      // Na login nakon registracije
      console.log("Promjena uspjesna");
      navigate("/profile");
    } catch (error) {
      console.error('Neupsjela registracija:', error);
      alert('Neupsjela registracija: ' + (error as Error).message);
    }
  };
  return (
    <>
      <div className="background">
        <div className="profileContainer">
          <Header />
          <div className="containerProfile">
            <p className="title">Uređivanje profila</p>
            <form className='authForm' onSubmit={handleSubmit}>
              <div className="containerList">
                <label htmlFor="name">Ime: </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Staro ime"
                  autoComplete="given-name"
                  required
                />
                <label htmlFor="surname">Prezime: </label>
                <input
                  type="text"
                  id="surname"
                  value={surname}
                  onChange={(e) => setSurname(e.target.value)}
                  placeholder="Staro prezime"
                  autoComplete="family-name"
                  required
                />
                <label htmlFor="bd">Datum rođenja: </label>
                <input
                  type="date"
                  id="bd"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  required
                />
                <label>Rod: </label>
              <div className="genderOptions">
                <div>
                  <input
                    type="radio"
                    id="M"
                    name="choice"
                    value="M"
                    onChange={(e) => setGender(e.target.value)}
                    checked={gender === "M"}
                  />
                  <label htmlFor="M">M</label>
                  </div>
                  <div>
                    <input
                      type="radio"
                      id="F"
                      name="choice"
                      value="F"
                      onChange={(e) => setGender(e.target.value)}
                      checked={gender === "F"}
                    />
                    <label htmlFor="F">Ž</label>
                  </div>
                  <div>
                    <input
                      type="radio"
                      id="O"
                      name="choice"
                      value="O"
                      onChange={(e) => setGender(e.target.value)}
                      checked={gender === "O"}
                    />
                    <label htmlFor="O">Ostalo</label>
                  </div>
                </div>
                <button className="myButton submit" type="submit">
                  Spremi promjene
                </button> 
              </div>
            </form>
            <Link className="fp" to="/profile">Odustani</Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default SetProfile;
