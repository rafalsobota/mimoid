/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import React, {
  Children,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useAnimations, useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { Object3D, Vector3, AnimationMixer } from "three";

export type CharacterProps = {
  position: Vector3;
  moveTarget: Vector3;
};

export default function Alien({ position, moveTarget }: CharacterProps) {
  const character = useRef<Object3D>();
  const head = useRef<Object3D>();
  const neck = useRef<Object3D>();
  const { nodes, animations } = useGLTF("/assets/Walking/Alien.gltf");
  const { ref, actions, names } = useAnimations(animations);
  const [walking, setWalking] = useState(false);

  // const mixer = useMemo(() => {
  //   return new AnimationMixer(character.current!);
  //   // mixer.clipAction( gltf.animations[ 0 ] ).play();
  // }, [character.current]);

  const walkAction = useMemo(() => {
    if (names.length < 1) return;
    const action = actions[names[0]];
    console.log({ actions, names, action });
    return action || undefined;
  }, [actions, names]);

  const playWalkAction = useCallback(() => {
    walkAction?.reset().fadeIn(0.3).play();
  }, [walkAction]);

  const stopWalkAction = useCallback(() => {
    walkAction?.fadeOut(0.1);
  }, [walkAction]);

  useEffect(() => {
    if (walking) {
      playWalkAction();
    } else {
      stopWalkAction();
    }
  }, [walking, animations, names]);

  useEffect(() => {
    character.current!.position.copy(position);
  }, [position.x, position.y, position.z]);

  useEffect(() => {
    console.log({ nodes, animations, actions, names });
  }, [nodes, animations]);

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

useGLTF.preload("/assets/SM_Chr_Alien_01.gltf");
