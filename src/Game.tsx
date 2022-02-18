import { User } from "firebase/auth";
import { getUser, logOut } from "./firebase/auth";
import Profile from "./Profile";
import { useRequiredUser, useUser } from "./useUser";

export type GameProps = {};

const Game = ({}: GameProps) => {
  const userState = useRequiredUser();

  if (userState.state === "loading") return <div>Loading...</div>;

  return (
    <div>
      <Profile user={userState.user} />
      <div>Game</div>
    </div>
  );
};

export default Game;
