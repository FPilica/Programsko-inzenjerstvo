import "./OAuthContainer.css";
import googleLogo from "../assets/google-logo.png";
import microsoftLogo from "../assets/microsoft-logo.png";

function OAuthContainer() {
  return (
    <>
      <div className="oAuthContainer">
        <p>Nastavi jednim od svojih računa:</p>
        <div className="authButtons">
          <button className="myButton googleButton">
            <img src={googleLogo} alt="google-logo" width="30" height="30" />
            <p>Google</p>
          </button>
          <button className="myButton microsoftButton">
            <img src={microsoftLogo} alt="microsoft-logo" width="30" height="30" />
            <p>Microsoft</p>
          </button>
        </div>
        <p>Ili putem e-maila i lozinke:</p>
      </div>
    </>
  );
}

export default OAuthContainer;
