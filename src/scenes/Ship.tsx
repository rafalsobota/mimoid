import { Canvas } from "@react-three/fiber";
import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
// import * as THREE from "three";
// import Floor from "../assets/Floor";
import Alien from "../assets/Alien";
import Space from "../assets/Space";
import { auth, getUser } from "../firebase/auth";
import { db } from "../firebase/db";
import { onValue, ref, set } from "firebase/database";

const Ship = () => {
  // const [moveTarget, setMoveTarget] = useState(new THREE.Vector3(0, 0, 0));

  // const playerPosition = useMemo(() => new THREE.Vector3(0, 0, 0), []);
  // const enemyPosition = useMemo(() => new THREE.Vector3(3, 0, 0), []);

  const [profiles, setProfiles] = useState<{ id: string; name: string }[]>([]);

  const user = useMemo(() => getUser(), []);

  const logout = useCallback(() => {
    auth.signOut();
  }, []);

  useEffect(() => {
    if (!user) return;
    const myProfileRef = ref(db, `paradok/profiles/${user.uid}`);
    set(myProfileRef, { name: user.displayName });
  });

  useEffect(() => {
    const playersRef = ref(db, "paradok/profiles");
    return onValue(playersRef, (snapshot) => {
      const data = snapshot.val() as { [id: string]: { name: string } };
      setProfiles(
        Object.entries(data || {}).map(([id, profile]) => ({
          id,
          name: profile.name,
        }))
      );
      console.log("data", data);
    });
  }, []);

  return (
    <Suspense
      fallback={
        <div className="w-full h-full text-[cyan] p-2 bg-[#2a1d47]">
          Loading...
        </div>
      }
    >
      <Canvas
        dpr={window.devicePixelRatio}
        mode="concurrent"
        className="bg-[#2a1d47]"
      >
        {/* <ambientLight /> */}
        <hemisphereLight args={["#f08fff", "#99e3e2"]} />

        {/* <OrbitControls /> */}
        {profiles.map((profile) => (
          <Alien
            key={profile.id}
            id={profile.id}
            name={profile.name}
            player={user?.uid === profile.id}
            //  position={playerPosition}
            //  moveTarget={moveTarget}
            //  defaultCamera
          />
        ))}
        {/* <Alien
          key="player"
          position={playerPosition}
          moveTarget={moveTarget}
          defaultCamera
        /> */}
        {/* {enemiesPositions.map((pos, i) => (
        <Alien key={`enemy-${i}`} position={pos} moveTarget={moveTarget} />
      ))} */}
        {/* <Alien
          key="enemy"
          position={enemyPosition}
          moveTarget={enemyPosition}
        /> */}
        <Space />
      </Canvas>
      <div className="absolute top-0 right-0 p-2">
        <button
          className="px-4 py-2 text-white bg-purple-500 rounded-md shadow-md active:bg-purple-600"
          onClick={logout}
        >
          Logout
        </button>
      </div>
    </Suspense>
  );
};

export default Ship;
