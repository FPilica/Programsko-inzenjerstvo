import { useState, useEffect } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import "./App.css";
import "./Profile.css";
import Header from "./components/Header.tsx";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

function SetProfile() {
  const baseURL = 'https://localhost:7070/'
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [gender, setGender] = useState("");

  const [userP, setUser] = useState<{ [key: string]: any }>({});

  useEffect(() => {
      getUser();
  }, []);
  
  const getUser = async () => {
    try {
      const response = await fetch(
        `${baseURL}api/userprofile/getprofile`,
        {
          method: "GET",
          headers: {
            "accept": "text/plain",
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("auth_token")}`,
          },
        }
      );
  
      if (!response.ok) {
        throw new Error("Something went wrong!");
      }
  
      const user = await response.json();
      setUser(user);
      console.log(user);
      if(user.dateOfBirth){
        user.dateOfBirth = user.dateOfBirth.split('T')[0]; // "2000-01-01"
        setBirthDate(user.dateOfBirth);
        
      }
      if(user.gender){
        if(user.gender === "Male")
          user.gender = "M"
        else if(user.gender === "Female")
          user.gender = "F"
        else user.gender = "O"
        setGender(user.gender);
      }

    } catch (error) {
      console.error("Greška: ", error);
    }
  };

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
      const response = await fetch('https://localhost:7070/api/userprofile/setprofile', {
        method: 'POST',
        headers: {
          'accept': 'text/plain',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem("auth_token")}`
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
        throw new Error(`Neupsjela promjena: ${response.status} ${responseData}`);
      }

      // Na login nakon registracije
      console.log("Promjena uspjesna");
      navigate("/profile");
    } catch (error) {
      console.error('Neupsjela promjena:', error);
      alert('Neupsjela promjena: ' + (error as Error).message);
    }
  };
  return (
    <>
      <div className="background">
        <div className="profileContainer">
          <Header />
          <div className="containerProfile">
            <p className="title">Uređivanje profila</p>
            <form className='setFrom' onSubmit={handleSubmit}>
              <div className="containerList">
                <label htmlFor="name">Ime: </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={userP.firstName}
                  autoComplete="given-name"
                  required
                />
                <label htmlFor="surname">Prezime: </label>
                <input
                  type="text"
                  id="surname"
                  value={surname}
                  onChange={(e) => setSurname(e.target.value)}
                  placeholder={userP.lastName}
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
