import { useCallback, useRef, useState } from "react";
import { logInWithEmail } from "./firebase/auth";

const Login = () => {
  const input = useRef<HTMLInputElement | null>(null);
  const [linkSent, setLinkSent] = useState(false);
  const [email, setEmail] = useState("");

  const onClick = useCallback(() => {
    const email = input.current?.value;
    if (!email) return;
    logInWithEmail(email);
    setLinkSent(true);
    setEmail(email);
  }, []);

  return (
    <div className="flex items-center justify-center w-full h-full bg-slate-100">
      <div className="flex flex-col p-8 space-y-4 bg-white rounded-lg shadow-lg">
        <div className="mb-4 text-3xl font-bold text-slate-900">
          {linkSent ? "Check your email" : "Sign in to your account"}
        </div>
        {linkSent ? (
          <>
            <p>
              Email was sent to your email address{" "}
              <span className="font-semibold">{email}</span>.
            </p>
            <p>
              Please check your email and click the link to confirm your
              account.
            </p>
          </>
        ) : (
          <>
            <div className="flex flex-col space-y-1">
              <label htmlFor="email" className="font-semibold text-slate-500">
                Email address
              </label>
              <input
                id="html"
                className="px-4 py-2 border rounded-md border-slate-300 outline-purple-500 bg-slate-50 focus:bg-transparent text-slate-900"
                ref={input}
                type="text"
                placeholder="me@mimoid.web.app"
              ></input>
            </div>
            <button
              className="px-4 py-2 text-white bg-purple-500 border rounded-md shadow-md active:bg-purple-600 active:shadow-sm"
              onClick={onClick}
            >
              Sign in
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Login;
