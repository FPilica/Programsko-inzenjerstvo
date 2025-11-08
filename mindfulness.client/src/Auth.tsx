import "./App.css";
import "./Auth.css";
import logoPurple from "./assets/logo_boja 2.png";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { Link } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Prijava s e-mailom:", email, "i lozinkom:", pass);
    // logika
    // za primjer
    let ok = true;
    if (ok) {
      // idemo na dashboard
      navigate("/dashboard");
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
