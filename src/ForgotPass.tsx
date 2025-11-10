// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import { useState } from "react";
import "./App.css";
import "./Auth.css";
import logoPurple from "./assets/logo_boja 2.png";
// auth
// npx vite u cmd u folder
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

function ForgotPass() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Email za reset lozinke:", email);
    // logika
  };

  return (
    <>
      <div className="containerHomeAndAuth">
        <div className="containerForgot">
          <Link className="logoLink" to="/">
            <img src={logoPurple} alt="logo_purple" width="177" height="41" />
          </Link>
          <div className="forgotpassInfo">
            <h3>Zaboravili ste lozinku?</h3>
            <p>
              Poslat ćemo Vam link za ponovno postavljanje lozinke na vašu
              e-mail adresu.
            </p>
          </div>
          <form className="formForgotpass" onSubmit={handleSubmit}>
            <label htmlFor="email">E-mail*</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              placeholder="Unesi e-mail adresu"
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            ></input>
            <div className="buttonsForgotpass">
              <button
                className="myButton cancel"
                type="button"
                onClick={() => navigate("/auth/login")}
              >
                Odustani
              </button>
              <button className="myButton submit" type="submit">
                Pošalji
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default ForgotPass;
