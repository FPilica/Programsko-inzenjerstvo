import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function OAuthCallback() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    
    useEffect(() => {
        const token = searchParams.get("token");
        
        const error = searchParams.get("error");

        if (token) {
            localStorage.setItem("auth_token", token);
            // const tokenObj = JSON.parse(token);
            // const userId = tokenObj.userId;
            // console.log(token);
            
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