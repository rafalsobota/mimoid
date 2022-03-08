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
import { useFrame, useThree } from "@react-three/fiber";
import { Object3D, Vector3 } from "three";
import * as SkeletonUtils from "three/examples/jsm/utils/SkeletonUtils";

export type CharacterProps = {
  position: Vector3;
  moveTarget: Vector3;
  defaultCamera?: true;
};

export default function Alien({
  position,
  moveTarget,
  defaultCamera,
}: CharacterProps) {
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
  const { camera } = useThree();

  useEffect(() => {
    if (defaultCamera) {
      camera.position.copy(position).add(new Vector3(0, 5, -5));
    }
  }, [defaultCamera, camera, position]);

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

  useEffect(() => {
    character.current!.position.copy(position);
    console.log({ characterModel });
    // characterModel.mesh.
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

      const movement = vectorToGo.multiplyScalar(delta * 1.5);

      model.position.add(movement);

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

  return (
    <>
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
        {defaultCamera ? (
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
              enablePan={false}
              ref={orbitControls}
              target={[0, 1.5, 0]}
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
