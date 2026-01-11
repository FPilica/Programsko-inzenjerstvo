import "./App.css";
import "./home.css";
// glavni
// npx vite u cmd u folder

import { Link } from "react-router-dom";

function Home() {
  //   const [count, setCount] = useState(0)

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
