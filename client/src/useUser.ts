import { User } from "firebase/auth";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "./firebase/auth";

export function useUser(): { state: 'loading', user: null } | { state: 'loggedIn', user: User } | { state: 'loggedOut', user: null } {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    return auth.onAuthStateChanged(user => {
      setUser(user);
      setIsLoading(false);
    });
  }, []);

  if (isLoading) return { state: 'loading', user: null };
  if (user) return { state: 'loggedIn', user };
  return { state: 'loggedOut', user: null };
}

export function useRequiredUser(): { state: 'loading', user: null } | { state: 'loggedIn', user: User } {
  const result = useUser();
  const navigate = useNavigate();
  if (result.state === 'loggedOut') {
    navigate("/");
    return { state: 'loading', user: null };
  }

  return result;
}
