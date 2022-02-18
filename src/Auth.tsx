import React from "react";
import Login from "./Login";
import { useUser } from "./useUser";

const Auth: React.FC = ({ children }) => {
  const { state } = useUser();
  if (state === "loading") return <div>Loading...</div>;
  if (state === "loggedOut") {
    return <Login />;
  }
  return <>{children}</>;
};

export default Auth;
