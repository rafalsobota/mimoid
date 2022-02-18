import Profile from "./Profile";
import { useRequiredUser } from "./useUser";

const Game = () => {
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
