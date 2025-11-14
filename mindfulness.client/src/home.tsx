import "./App.css";
import "./home.css";
import logoWhite from "./assets/logo_bijeli.png";
// glavni
// npx vite u cmd u folder

import { Link } from "react-router-dom";

function Home() {
  //   const [count, setCount] = useState(0)

  return (
    <>
      <div className="containerHomeAndAuth">
        <div className="containerHome">
          <img src={logoWhite} alt="logo_bijeli" width="688" height="auto" />

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
