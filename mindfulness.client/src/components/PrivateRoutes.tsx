import { Navigate, Outlet } from "react-router-dom";

const PrivateRoutes = () => {
    const isAuthenticated = true; // Provjera jel radi, inace ce bit neka prava funkcija
    return isAuthenticated ? <Outlet /> : <Navigate to="/auth/login" />;
};

export default PrivateRoutes;