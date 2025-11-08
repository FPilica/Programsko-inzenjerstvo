// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import "./App.css";
import "./Auth.css";
import logoPurple from "./assets/logo_boja 2.png";
// auth
// npx vite u cmd u folder
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

function validatePass(password: string) {
  let returns = { success: true, msg: '' };
  
  if (password.length < 8) {
    returns.success = false;
    returns.msg = 'Lozinka mora imati barem 8 znakova!';
    return returns;
  }

  let hasUpperCase = false;
  let hasLowerCase = false;
  let hasNumber = false;
  let hasSpecialChar = false;

  for (let i = 0; i < password.length; i++) {
    const char = password[i];

    if (char >= 'A' && char <= 'Z') {
      hasUpperCase = true;
    } else if (char >= 'a' && char <= 'z') {
      hasLowerCase = true;
    } else if (char >= '0' && char <= '9') {
      hasNumber = true;
    } else if (
      (char >= '!' && char <= '/') ||
      (char >= ':' && char <= '@') ||
      (char >= '[' && char <= '`') ||
      (char >= '{' && char <= '~') 
    ) {
      hasSpecialChar = true;
    }

  }

  returns.success = hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;
  if (!returns.success) {
    returns.msg = 'Lozinka mora sadržavati barem jedan broj, velika i mala slova te jedan poseban znak!';
  }

  return returns;
}

function Reg() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validatePass(pass)
    if (!validation?.success) {
      alert(validation.msg);
    } else {
      console.log("Registracija s e-mailom:", email, "i lozinkom:", pass);
      // logika
      // za primjer
      let ok = true;
      if (ok) {
        // idemo na dashboard
        navigate("/auth/onboarding");
      }
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
                autoComplete="new-password"
                required
              />
            </div>
            <button className="myButton submit" type="submit">
              Registriraj se
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default Reg;
