
import './App.css'
// npx vite u cmd u folder

import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from "react-router-dom"
import Home from "./home"
import Auth from "./Auth"


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
            path="*"
            element={<Navigate to="/" />}
          />
        </Routes>
      </Router>
    </>
  )
}

export default App
