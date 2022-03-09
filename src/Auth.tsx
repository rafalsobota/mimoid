import React, { useEffect, useState } from "react";
// import Login from "./Login";
// import { useUser } from "./useUser";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import { auth } from "./firebase/auth";

// const Auth: React.FC = ({ children }) => {
//   // const { state } = useUser();
//   // if (state === "loading") return <></>;
//   // if (state === "loggedOut") {
//   //   return <Login />;
//   // }

//   const uiConfig = {
//     // Popup signin flow rather than redirect flow.
//     signInFlow: 'popup',
//     // Redirect to /signedIn after sign in is successful. Alternatively you can provide a callbacks.signInSuccess function.
//     // signInSuccessUrl: '/signedIn',
//     callbacks: {
//       // Avoid redirects after sign-in.
//       signInSuccessWithAuthResult: () => false,
//     },
//     // We will display Google and Facebook as auth providers.

//     signInOptions: [
//       firebase.auth.GoogleAuthProvider.PROVIDER_ID,
//       firebase.auth.FacebookAuthProvider.PROVIDER_ID,
//     ],
//   };

//   <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />

//   return <>{children}</>;
// };

// Configure FirebaseUI.
const uiConfig: firebaseui.auth.Config = {
  // Popup signin flow rather than redirect flow.
  signInFlow: "popup",
  // We will display Google and Facebook as auth providers.
  signInOptions: [
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    // firebase.auth.GithubAuthProvider.PROVIDER_ID,
    {
      provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
      // signInMethod: firebase.auth.EmailAuthProvider.EMAIL_LINK_SIGN_IN_METHOD,
      requireDisplayName: true,
    },
  ],

  callbacks: {
    // Avoid redirects after sign-in.
    signInSuccessWithAuthResult: () => false,
  },
};

const Auth: React.FC = ({ children }) => {
  const [isSignedIn, setIsSignedIn] = useState(false); // Local signed-in state.

  // Listen to the Firebase Auth state and set the local state.
  useEffect(() => {
    console.log(auth);
    const unregisterAuthObserver = auth.onAuthStateChanged(() => {
      console.log({ user: auth.currentUser });
      setIsSignedIn(!!auth.currentUser);
    });
    return () => unregisterAuthObserver(); // Make sure we un-register Firebase observers when the component unmounts.
  }, []);

  if (!isSignedIn) {
    return (
      <div className="flex items-center justify-center w-full h-full bg-slate-100">
        <div className="flex flex-col p-8 space-y-4 bg-white rounded-lg shadow-lg">
          <div className="mb-4 text-3xl font-bold text-slate-900">
            Sign in to your account
          </div>
          <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={auth} />
        </div>
      </div>
    );
  }
  return <>{children}</>;
};

export default Auth;
