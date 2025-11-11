import "./OAuthContainer.css";
import googleLogo from "../assets/google-logo.png";
import microsoftLogo from "../assets/microsoft-logo.png";

function OAuthContainer() {
    
    const baseUrl = window.location.origin;

  const handleOAuth = (provider : string) => {
      const returnUrl = encodeURIComponent(`${baseUrl}/auth/callback`);
      window.location.href = `https://localhost:7070/api/Auth/external-login?provider=${provider}&returnUrl=${returnUrl}`;
  }
  
  return (
    <>
      <div className="oAuthContainer">
        <p>Nastavi jednim od svojih računa:</p>
        <div className="authButtons">
          <button className="myButton googleButton" onClick={() => handleOAuth("Google")} >
            <img src={googleLogo} alt="google-logo" width="30" height="30" />
            <p>Google</p>
          </button>
          <button className="myButton microsoftButton" onClick={() => handleOAuth("Microsoft")} >
            <img
              src={microsoftLogo}
              alt="microsoft-logo"
              width="30"
              height="30"
            />
            <p>Microsoft</p>
          </button>
        </div>
        <p>Ili putem e-maila i lozinke:</p>
      </div>
    </>
  );
}

export default OAuthContainer;
