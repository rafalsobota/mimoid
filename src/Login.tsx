import { useCallback, useRef, useState } from "react";
import { logInWithEmail } from "./firebase/auth";

const Login = () => {
  const input = useRef<HTMLInputElement | null>(null);
  const [linkSent, setLinkSent] = useState(false);

  const onClick = useCallback(() => {
    const email = input.current?.value;
    if (!email) return;
    logInWithEmail(email);
    setLinkSent(true);
  }, []);

  return linkSent ? (
    <div>Check Email</div>
  ) : (
    <div>
      <h1>Login</h1>
      <input ref={input} type="text"></input>
      <button onClick={onClick}>Send Magic Link</button>
    </div>
  );
};

export default Login;
