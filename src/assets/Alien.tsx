import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  OrbitControls,
  // OrbitControls,
  useAnimations,
  useGLTF,
} from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { Object3D, Vector3 } from "three";
import * as SkeletonUtils from "three/examples/jsm/utils/SkeletonUtils";
import { db } from "../firebase/db";
import { get, onValue, ref, set } from "firebase/database";
import { APIPosition, APITimeSpacePoint } from "../api";
import Floor from "./Floor";

export type CharacterProps = {
  name: string;
  id: string;
  player?: boolean;
  // position: Vector3;
  // moveTarget: Vector3;
  // defaultCamera?: true;
};

const randomPosition = (): APIPosition => {
  const x = Math.random() * 20 - 10;
  const z = Math.random() * 20 - 10;
  return {
    start: {
      x: x,
      y: 0,
      z: z,
      t: 0,
    },
    end: {
      x: x,
      y: 0,
      z: z,
      t: 0,
    },
  };
};

// const offScreenPosition: APIPosition = {
//   start: {
//     x: 1000000,
//     y: 1000000,
//     z: 1000000,
//     t: 0,
//   },
//   end: {
//     x: 1000000,
//     y: 1000000,
//     z: 1000000,
//     t: 0,
//   },
// };

const speed = 1.6; // m/s
const rotationSpeed = 10; // rad/s

const toVector3 = (position: APITimeSpacePoint): Vector3 => {
  return new Vector3(position.x, position.y, position.z);
};

const currentPosition = (position: APIPosition): Vector3 => {
  const now = Date.now();
  const t = Math.min(
    1,
    (now - position.start.t) / (position.end.t - position.start.t)
  );
  return new Vector3(
    position.end.x * t + position.start.x * (1 - t),
    0,
    position.end.z * t + position.start.z * (1 - t)
  );
};

export default function Alien({ name, id, player }: CharacterProps) {
  const character = useRef<Object3D>();
  // const camera1 = useRef<typeof PerspectiveCamera | null>(null);
  const orbitControls = useRef<any>(null);
  // const head = useRef<Object3D>();
  // const neck = useRef<Object3D>();
  const { nodes, animations } = useGLTF("/assets/Walking/Alien.gltf");
  const characterModel: Object3D = useMemo(() => {
    // (nodes.Scene as any).debugoid = name;
    // console.log({ name, nodes, SkeletonUtils });
    return (SkeletonUtils as any).clone(nodes.Scene);
  }, [nodes.Scene]);
  const idleGLTF = useGLTF("/assets/Walking/Idle.gltf");
  const { actions, names } = useAnimations(animations, characterModel);
  const idleActions = useAnimations(idleGLTF.animations, characterModel);
  const [walking, setWalking] = useState(false);
  // const { camera } = useThree();

  const positionRef = useRef<APIPosition | null>(null);

  useEffect(() => {
    const dbPosition = ref(db, `paradok/positions/${id}`);
    if (player) {
      get(dbPosition).then((snapshot) => {
        if (snapshot.exists()) {
          // const position = snapshot.val();
          // positionRef.current = position;
        } else {
          // Init position
          set(dbPosition, randomPosition());
        }
      });
    }
    return onValue(dbPosition, (snapshot) => {
      const position = snapshot.val() as APIPosition;
      if (!position) {
        console.warn("empty position");
      } else {
        if (positionRef.current === null) {
          // initialize camera
          character.current!.position.copy(currentPosition(position));
          if (player) {
            orbitControls.current!.object.position.x =
              character.current!.position.x;
            orbitControls.current!.object.position.z =
              character.current!.position.z + 5;
            orbitControls.current!.object.position.y = 10;
            orbitControls.current!.target.copy(
              character.current!.position.clone().add(new Vector3(0, 1.5, 0))
            );
          }
        }
        positionRef.current = position;
      }
    });
  }, [id, player]);

  // useEffect(() => {
  //   if (user && user.uid === id) {
  //     camera.position.copy(position).add(new Vector3(0, 5, -5));
  //   }
  // }, [camera, position]);

  // useEffect(() => {
  //   camera.position.set(0, 5, 5);
  //   camera.lookAt(0, 0, 0);
  // }, [camera]);

  // useEffect(() => {
  //   console.log({ idleGLTF, idleActions });
  // }, []);

  const playWalkAction = useCallback(() => {
    actions[names[0]]!.reset().fadeIn(0.3).play();
    idleActions.actions[idleActions.names[0]]!.fadeOut(0.3).stop();
  }, [actions, names, idleActions]);

  const stopWalkAction = useCallback(() => {
    actions[names[0]]!.fadeOut(0.3);
    idleActions.actions[idleActions.names[0]]!.reset().fadeIn(0.3).play();
  }, [actions, names, idleActions]);

  useEffect(() => {
    if (walking) {
      playWalkAction();
    } else {
      stopWalkAction();
    }
  }, [walking, playWalkAction, stopWalkAction]);

  // useEffect(() => {
  //   // camera.rotation.y = Math.PI;
  //   camera.lookAt(character.current!.position);
  // }, [camera, character]);

  // useEffect(() => {
  //   // character.current!.lookAt(moveTarget);
  //   // character.current!.rotation.y *= -1;
  // }, [moveTarget]);

  useFrame((state, delta) => {
    const model = character.current!;

    if (!positionRef.current) return;

    // Update position
    const position = currentPosition(positionRef.current);
    const movement = new Vector3(
      position.x - model.position.x,
      position.y - model.position.y,
      position.z - model.position.z
    );
    model.position.x = position.x;
    model.position.y = position.y;
    model.position.z = position.z;

    const distanceToGo = position.distanceTo(
      toVector3(positionRef.current.end)
    );
    if (distanceToGo < 0.1) {
      // Stop
      if (walking) {
        setWalking(false);
      }
    } else {
      // Walk
      if (!walking) {
        setWalking(true);
      }

      // const movement = vectorToGo.multiplyScalar(delta * 1.5);

      if (orbitControls.current) {
        orbitControls.current!.target.copy(
          model.position.clone().add(new Vector3(0, 1.5, 0))
        );
        // camera2.current!.maxDistance = 100;
        // camera2.current!.minDistance = 1;
        // // console.log(camera2.current!);
        orbitControls.current!.object.position.add(movement);
      }
      // cameraCenter.current.copy(model.position);

      // model.rotation.toVector3().lerp(vectorToGo.normalize(), 0.5);

      const model2 = model.clone();
      model2.lookAt(toVector3(positionRef.current.end));
      const destRotation = model2.quaternion;
      model.quaternion.slerp(destRotation, delta * rotationSpeed);

      // model.rotation.set(vectorToGo.x, vectorToGo.y, vectorToGo.z);

      // vectorToGo

      // const destinationCameraPosition = model.position.clone();

      // const destinationCameraPosition2 = destinationCameraPosition.add(model.quaternion.to.multiplyScalar(-5))

      // camera.position.lerp(
      //   model.position.clone().add(new Vector3(0, 5, 5)),
      //   0.1
      // );
      // camera.lookAt(model.position);
      // orbitRef.current!.target = model.position;
    }
  });

  // const preventDefault = (e: any) => {
  //   console.log("prevent", e);
  //   e?.preventDefault();
  //   e?.stopPropagation();
  // };

  // const lockClick = () => {
  //   if (clickLock) {
  //     console.log("lockClick");
  //     clickLock.current = true;
  //   }
  // };

  // const unlockClick = () => {
  //   if (clickLock) {
  //     setTimeout(() => {
  //       console.log("unlockClick");
  //       clickLock.current = false;
  //     }, 0);
  //   }
  // };

  const move = useCallback(
    (v: Vector3) => {
      const dbPosition = ref(db, `paradok/positions/${id}`);

      const distance = character.current!.position.distanceTo(v);
      const duration = Math.floor((distance * 1000) / speed);
      const startAt = Date.now();
      const endAt = startAt + duration;
      const newPosition: APIPosition = {
        start: {
          x: character.current!.position.x,
          y: 0,
          z: character.current!.position.z,
          t: startAt,
        },
        end: {
          x: v.x,
          y: 0,
          z: v.z,
          t: endAt,
        },
      };
      positionRef.current = newPosition;
      set(dbPosition, newPosition);
    },
    [id]
  );

  // if (!player && !positionRef.current) return null;

  return (
    <>
      {player ? <Floor onClick={move} /> : null}
      {/* <OrbitControls /> */}
      {/* <PerspectiveCamera
        ref={camera2}
        position={[0, 5, -7]}
        rotation={[0.3, Math.PI, 0]}
        near={1}
        far={1000}
        // makeDefault
      /> */}
      <group ref={character}>
        {player ? (
          <>
            {/* <PerspectiveCamera
              ref={camera1}
              position={[0, 5, -7]}
              rotation={[0.3, Math.PI, 0]}
              near={1}
              far={1000}
              makeDefault
            /> */}
            <OrbitControls
              enablePan={true}
              ref={orbitControls}
              // target={[0, 1.5, 0]}
              minDistance={2}
              maxDistance={20}
            />
          </>
        ) : null}
        <group scale={[0.01, 0.01, 0.01]}>
          <primitive
            object={characterModel}
            // onPointerOver={onPointerEnter}
            // onPointerOut={onPointerLeave}
          ></primitive>
        </group>
      </group>
    </>
  );
}

// useGLTF.preload("/assets/Walking/Alien.gltf");
// useGLTF.preload("/assets/Walking/Idle.gltf");
