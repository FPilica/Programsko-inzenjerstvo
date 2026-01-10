import React from "react";
import { Navigate } from "react-router-dom";

export const CheckAuth = (Component: React.FC<any>) => {
  return (props: any) => {
    // dohvacam auth_token
    // const token = localStorage.getItem("auth_token");

    //return token ? <Component {...props} /> : <Navigate to="/login" replace />;

    // prava logika za provjeru tokena ce ici ovdje
    return <Component {...props} />;
  };
};
