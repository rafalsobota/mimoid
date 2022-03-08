import { Canvas } from "@react-three/fiber";
import { Suspense, useMemo, useState } from "react";
import * as THREE from "three";
import Floor from "../assets/Floor";
import Alien from "../assets/Alien";
import Space from "../assets/Space";

const Ship = () => {
  const [moveTarget, setMoveTarget] = useState(new THREE.Vector3(0, 0, 0));

  const playerPosition = useMemo(() => new THREE.Vector3(0, 0, 0), []);
  const enemyPosition = useMemo(() => new THREE.Vector3(3, 0, 0), []);

  // const enemiesPositions = useMemo(() => {
  //   const positions = [];
  //   for (let i = 0; i < 20; i++) {
  //     for (let j = 0; j < 10; j++) {
  //       positions.push(new THREE.Vector3(i - 10, 0, j - 5));
  //     }
  //   }
  //   return positions;
  // }, []);

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
        <Floor onClick={setMoveTarget} />
        {/* <OrbitControls /> */}
        <Alien
          key="player"
          position={playerPosition}
          moveTarget={moveTarget}
          defaultCamera
        />
        {/* {enemiesPositions.map((pos, i) => (
        <Alien key={`enemy-${i}`} position={pos} moveTarget={moveTarget} />
      ))} */}
        <Alien
          key="enemy"
          position={enemyPosition}
          moveTarget={enemyPosition}
        />
        <Space />
      </Canvas>
    </Suspense>
  );
};

export default Ship;
