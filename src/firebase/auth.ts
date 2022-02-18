import { getAuth, sendSignInLinkToEmail, signInWithEmailLink, UserCredential, User, } from "firebase/auth";
import { app } from "./app";

const actionCodeSettings = {
  // URL you want to redirect back to. The domain (www.example.com) for this
  // URL must be in the authorized domains list in the Firebase Console.
  url: `${window.location.protocol}//${window.location.host}/verify-email`,
  // This must be true.
  handleCodeInApp: true,
  // dynamicLinkDomain: 'example.page.link'
};

export const auth = getAuth(app);

export async function logInWithEmail(email: string) {
  await sendSignInLinkToEmail(auth, email, actionCodeSettings);
  window.localStorage.setItem('emailForSignIn', email);
}

export async function verifyEmail(): Promise<UserCredential> {
  let email = window.localStorage.getItem('emailForSignIn') || window.prompt('Please provide your email for confirmation');
  if (!email) throw new Error('No email provided');
  const userCredential = await signInWithEmailLink(auth, email!, window.location.href);
  window.localStorage.removeItem('emailForSignIn');
  return userCredential;
}

export function isLoggedIn() {
  return !!auth.currentUser;
}

export function getUser(): User | null {
  return auth.currentUser;
}

export function logOut() {
  return auth.signOut();
}