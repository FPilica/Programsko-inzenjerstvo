import { Navigate, Outlet } from "react-router-dom";

const PrivateRoutes = () => {
    const isAuthenticated = !!localStorage.getItem("auth_token");
    return isAuthenticated ? <Outlet /> : <Navigate to="/auth/login" />;
};

export default PrivateRoutes;
