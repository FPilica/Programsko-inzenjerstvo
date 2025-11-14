import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { jwtDecode} from "jwt-decode";

function OAuthCallback() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    
    useEffect(() => {
        const token = searchParams.get("token");
        const error = searchParams.get("error");

        if (token) {
            localStorage.setItem("auth_token", token);

            const tokenDecoded = jwtDecode(token);
            const userId = tokenDecoded.sub;
            console.log(userId);

            if (userId) {
                localStorage.setItem("userId", userId);
            }

            const fetchOnboarding = async () => {

                try {
                    const response = await fetch(`https://programsko-inzenjerstvo-x2fd.onrender.com/api/StartQuestionnaire`, {
                        method: "GET",
                        headers: {
                            'accept': 'text/plain',
                            'Content-Type': 'application/json', 
                            'Authorization': `Bearer ${localStorage.getItem("auth_token")}`
                        }
                    });

                    if(!response.ok) {
                        throw new Error(`Greška: ${response.status}`, );
                    }

                    console.log("Korisnik već rješio upitnik, šaljem na dash!");
                    navigate("/dashboard");

                } catch (error) {
                    console.error("Korisnik nije rješio upitnik, šaljem na upitnik!" , error);
                    navigate("/auth/onboarding");
                }
            }

            fetchOnboarding();

        } else if (error) {
            navigate("/auth/login", {
                state: {
                    error: "Neuspješna prijava. Molimo pokušajte ponovo."
                }
            });
        } else {
            console.error("Ništa");
            navigate("/auth/login")
        }
    }, [searchParams, navigate]);

    return <div>Obrada...</div>;
}

export default OAuthCallback;