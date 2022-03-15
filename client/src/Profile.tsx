import { User } from "firebase/auth";
import { logOut } from "./firebase/auth";

export type ProfileProps = {
  user: User;
};

const Profile = ({ user }: ProfileProps) => {
  return (
    <div>
      Welcome {user.displayName || user.email}{" "}
      <button onClick={logOut}>Logout</button>
    </div>
  );
};

export default Profile;
