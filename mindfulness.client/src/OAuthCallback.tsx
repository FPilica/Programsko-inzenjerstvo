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
            
            navigate("/dashboard");
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