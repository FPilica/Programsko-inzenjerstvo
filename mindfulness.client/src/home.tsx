import "./App.css";
import "./home.css";

import { Link } from "react-router-dom";

function Home() {

  return (
    <>
      <div className="containerHomeAndAuth">
        <div className="containerHome">
          <h1 className="pageName">mindfulness</h1>

          <div className="gumbi_za_auth">
            <Link to="auth/login">
              <button className="myButton login-button">Prijava</button>
            </Link>

            <Link to="auth/reg">
              <button className="myButton reg-button">Registracija</button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
