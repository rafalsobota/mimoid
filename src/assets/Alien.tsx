import React, { useCallback, useEffect, useRef, useState } from "react";
import { useAnimations, useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { Object3D, Vector3 } from "three";

export type CharacterProps = {
  position: Vector3;
  moveTarget: Vector3;
};

export default function Alien({ position, moveTarget }: CharacterProps) {
  const character = useRef<Object3D>();
  // const head = useRef<Object3D>();
  // const neck = useRef<Object3D>();
  const { nodes, animations } = useGLTF("/assets/Walking/Alien.gltf");
  const { ref, actions, names } = useAnimations(animations);
  const [walking, setWalking] = useState(false);

  const playWalkAction = useCallback(() => {
    actions[names[0]]!.reset().fadeIn(0.3).play();
  }, [actions, names]);

  const stopWalkAction = useCallback(() => {
    actions[names[0]]!.fadeOut(0.1);
  }, [actions, names]);

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

  useEffect(() => {
    character.current!.lookAt(moveTarget);
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

      model.position.add(vectorToGo.multiplyScalar(0.03));
    }
  });

  return (
    <group ref={character} scale={[0.01, 0.01, 0.01]}>
      <primitive ref={ref} object={nodes.Scene}></primitive>
    </group>
  );
}

useGLTF.preload("/assets/Walking/Alien.gltf");
