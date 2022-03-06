import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  OrbitControls,
  PerspectiveCamera,
  useAnimations,
  useGLTF,
} from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { Object3D, Vector3 } from "three";

export type CharacterProps = {
  position: Vector3;
  moveTarget: Vector3;
};

export default function Alien({ position, moveTarget }: CharacterProps) {
  const character = useRef<Object3D>();
  const camera1 = useRef<typeof PerspectiveCamera | null>(null);
  const camera2 = useRef<typeof PerspectiveCamera | null>(null);
  // const head = useRef<Object3D>();
  // const neck = useRef<Object3D>();
  const { nodes, animations } = useGLTF("/assets/Walking/Alien.gltf");
  const idleGLTF = useGLTF("/assets/Walking/Idle.gltf");
  const { ref, actions, names } = useAnimations(animations);
  const idleActions = useAnimations(idleGLTF.animations, character);
  const [walking, setWalking] = useState(false);

  // useEffect(() => {
  //   camera.position.set(0, 5, 5);
  //   camera.lookAt(0, 0, 0);
  // }, [camera]);

  useEffect(() => {
    console.log({ idleGLTF, idleActions });
  }, []);

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

  useEffect(() => {
    character.current!.position.copy(position);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // useEffect(() => {
  //   // camera.rotation.y = Math.PI;
  //   camera.lookAt(character.current!.position);
  // }, [camera, character]);

  useEffect(() => {
    // character.current!.lookAt(moveTarget);
    // character.current!.rotation.y *= -1;
  }, [moveTarget]);

  useFrame((state, delta) => {
    const model = character.current!;

    const distanceToGo = model.position.distanceTo(moveTarget);
    const vectorToGo = moveTarget.clone().sub(model.position).normalize();
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

      model.position.add(vectorToGo.multiplyScalar(delta * 1.5));

      // model.rotation.toVector3().lerp(vectorToGo.normalize(), 0.5);

      const model2 = model.clone();
      model2.lookAt(moveTarget);
      const destRotation = model2.quaternion;
      model.quaternion.slerp(destRotation, 0.1);

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

  return (
    <>
      {/* <OrbitControls /> */}
      <PerspectiveCamera
        ref={camera2}
        position={[0, 5, -7]}
        rotation={[0.3, Math.PI, 0]}
        near={1}
        far={1000}
        makeDefault
      />
      <group ref={character}>
        <PerspectiveCamera
          ref={camera1}
          position={[0, 5, -7]}
          rotation={[0.3, Math.PI, 0]}
          near={1}
          far={1000}
          makeDefault
        />
        <group scale={[0.01, 0.01, 0.01]}>
          <primitive ref={ref} object={nodes.Scene}></primitive>
        </group>
      </group>
    </>
  );
}

useGLTF.preload("/assets/Walking/Alien.gltf");
useGLTF.preload("/assets/Walking/Idle.gltf");
