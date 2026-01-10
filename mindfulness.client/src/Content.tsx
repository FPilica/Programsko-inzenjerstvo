
import "./App.css";
import { CheckAuth } from "./components/CheckAuth";

import { Link } from "react-router-dom";
import Header from "./components/Header";

function ContentComponent() {
  return (
    <>
      <div className="background">
        <div className="contentContainer">
          <Header />
          <h1>Sadržaj</h1>
        </div>
      </div>
    </>
  );
}

const Content = CheckAuth(ContentComponent);
export default Content;
