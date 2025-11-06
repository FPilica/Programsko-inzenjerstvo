
import './App.css'
// npx vite u cmd u folder

import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from "react-router-dom"
import Auth from "./Auth"
import Home from "./home"
import Reg from "./Reg"
import ForgotPass from "./ForgotPass"
import Content from "./Content"
import Calendar from "./Calendar"
import Profile from "./Profile"
import Admin from "./Admin"
import Coach from "./Coach"
// nezz kako dash i stats ?


function App() {
  // app sada radi kao server.js odnosno sadrži rute na druge stranice
  return (
    <>
      <Router>
        <Routes>
          <Route
            // exact
            path="/"
            element={<Home />}
          />
          <Route
            path="/auth"
            element={<Auth />}
          />
          <Route
            path="/auth/login"
            element={<Auth />}
          />
          <Route
            path="/auth/reg"
            element={<Reg />}
          />
          <Route
            path="/auth/forgotpass"
            element={<ForgotPass />}
          />
          <Route
            path="/content"
            element={<Content />}
          />
          <Route
            path="/calendar"
            element={<Calendar />}
          />
          <Route
            path="/profile"
            element={<Profile />}
          />
          <Route
            path="/admin"
            element={<Admin />}
          />
          <Route
            path="/coach"
            element={<Coach />}
          />
          <Route
            path="*"
            element={<Navigate to="/" />}
          />
        </Routes>
      </Router>
    </>
  )
}

export default App;