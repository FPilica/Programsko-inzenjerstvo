import "./OAuthContainer.css";
import googleLogo from "../assets/google-logo.png";

function OAuthContainer() {
    
    const baseUrl = window.location.origin;

  const handleOAuth = (provider : string) => {
      const returnUrl = encodeURIComponent(`${baseUrl}/auth/callback`);
      window.location.href = `https://programsko-inzenjerstvo-x2fd.onrender.com/api/Auth/external-login?provider=${provider}&returnUrl=${returnUrl}`;
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
        </div>
        <p>Ili putem e-maila i lozinke:</p>
      </div>
    </>
  );
}

export default OAuthContainer;
