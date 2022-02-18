import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { verifyEmail } from "./firebase/auth";

const VerifyEmail = () => {
  const navigate = useNavigate();
  useEffect(() => {
    verifyEmail().then((user) => {
      console.log({ user: user.user.email });
      navigate("/");
    });
  }, [navigate]);

  return <div>Verifying Email...</div>;
};

export default VerifyEmail;
