import { useEffect, useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { Object3D, Vector3 } from "three";

export type CharacterProps = {
  position: Vector3;
  moveTarget: Vector3;
};

export default function Character({ position, moveTarget }: CharacterProps) {
  const character = useRef<Object3D>();
  const head = useRef<Object3D>();
  const neck = useRef<Object3D>();
  const { nodes } = useGLTF("/assets/SM_Chr_Alien_01.gltf");

  useEffect(() => {
    character.current!.position.copy(position);
  }, [character, position]);

  useEffect(() => {
    const root = nodes.Root;
    const toDelete: Object3D[] = [];

    root.traverse((child) => {
      if (child.name === "Head") {
        console.log({ head: child });
      }

      if (child.name.startsWith("SM_Chr_")) {
        toDelete.push(child);
      }
    });

    toDelete.forEach((node) => {
      node.removeFromParent();
    });
  }, [nodes]);

  useEffect(() => {
    character.current!.lookAt(moveTarget);
    // character.current!.rotation.y *= -1;
  }, [moveTarget]);

  useFrame((state, delta) => {
    // head.current!.quaternion.invert();
    // head.current!.quaternion.slerp(head.current!.quaternion, 0.1);
    // head.current.rotation.x += delta;
    character.current!.position.lerp(moveTarget, 0.1);
  });

  return (
    <>
      <group ref={character} dispose={null}>
        <group position={[0, 0, 0]} rotation={[0, Math.PI, 0]}>
          <primitive object={nodes.Root}>
            <primitive object={nodes.Hips}>
              <primitive object={nodes.Spine_01}>
                <primitive object={nodes.Spine_02}>
                  <primitive object={nodes.Spine_03}>
                    <primitive object={nodes.Clavicle_L}></primitive>
                    <primitive object={nodes.Clavicle_R}></primitive>
                    <primitive object={nodes.Neck} ref={neck}>
                      <primitive object={nodes.Head} ref={head}></primitive>
                    </primitive>
                  </primitive>
                </primitive>
              </primitive>
            </primitive>
          </primitive>
          <primitive object={nodes.SM_Chr_Alien_01_2} />
        </group>
      </group>
    </>
  );
}

useGLTF.preload("/assets/SM_Chr_Alien_01.gltf");
