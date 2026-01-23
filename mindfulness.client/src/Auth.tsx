import "./App.css";
import "./Auth.css";
import logoPurple from "./assets/logo_boja 2.png";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { Link } from "react-router-dom";
import OAuthContainer from "./components/OAuthContainer";
import * as React from "react";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Prijava s e-mailom:", email, "i lozinkom:", pass);
    
    try {
      const response = await fetch('https://programsko-inzenjerstvo-x2fd.onrender.com/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password: pass })
      });

      console.log('Response status:', response.status);
      const responseData = await response.text();
      console.log('Response body:', responseData);

      if (!response.ok) {
        throw new Error(`Login failed: ${response.status} ${responseData}`);
      }

      const data = JSON.parse(responseData);
      console.log("Prijava uspjesna, token primljen");
      const token = data.token;
      localStorage.setItem("auth_token", token);

      try {
        const response = await fetch(
            "https://programsko-inzenjerstvo-x2fd.onrender.com/api/startquestionnaire",
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
              },
            }
        );

        if (!response.ok) {
          throw new Error("Korisnik nije rješio početni upitnik...");
        }

        console.log("Korisnik rješio upitnik, /dash");
        navigate("/dashboard");
      } catch (error) {
        console.log(": ", error);
        navigate("/auth/onboarding");
      }

    } catch (error) {
      console.error('Neuspjesna prijava:', error);
      alert('Neuspješna prijava: ' + (error as Error).message);
    }
  };

  return (
    <>
      <div className="containerHomeAndAuth">
        <div className="containerAuth">
          <Link className="logoLink" to="/">
            <img src={logoPurple} alt="logo_purple" width="177" height="41" />
          </Link>
          <div className="optionLogReg">
            <NavLink className="loginLink" to="/auth/login">
              Prijava
            </NavLink>
            <NavLink className="regLink" to="/auth/reg">
              Registracija
            </NavLink>
          </div>
          <OAuthContainer />
          <form className="authForm" onSubmit={handleSubmit}>
            <div className="emailContainer">
              <label htmlFor="email">E-mail*</label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Unesi e-mail adresu"
                autoComplete="email"
                required
              />
            </div>
            <div className="passContainer">
              <label htmlFor="pass">Lozinka*</label>
              <input
                type="password"
                id="pass"
                name="pass"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                placeholder="Unesi lozinku"
                autoComplete="current-password"
                required
              />
            </div>
            <Link to="/auth/forgotpass">Zaboravljena lozinka?</Link>
            <button className="myButton submit" type="submit">
              Prijavi se
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default Login;
