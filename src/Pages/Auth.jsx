// Auth.jsx
import React from'react';
import { useAuthController } from'../Controllers/Auth/useAuthController';
import AuthView from'../Views/Auth/AuthView'

const Auth = () => {
 const controller = useAuthController();
 return <AuthView controller={controller} />;
};

export default Auth;