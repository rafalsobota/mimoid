import Profile from "./Profile";
import { useRequiredUser } from "./useUser";

const Game = () => {
  const userState = useRequiredUser();

  if (userState.state === "loading") return <div>Loading...</div>;

  return (
    <div className="flex flex-col h-full">
      <Profile user={userState.user} />
      <div>Game</div>
    </div>
  );
};

export default Game;
