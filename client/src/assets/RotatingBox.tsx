import { useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";

const RotatingBox = () => {
  const mesh = useRef<THREE.Mesh>();

  // const hovered = useRef<boolean>(false);

  const [hovered, hover] = useState(false);
  const [clicked, click] = useState(false);

  useFrame((state, delta) => {
    if (hovered) {
      mesh.current!.rotation.y += delta;
      mesh.current!.rotation.x += delta;
    }
  });

  return (
    <mesh
      position={[2, 2, 0]}
      ref={mesh}
      scale={clicked ? 1.5 : 1}
      onClick={(event) => click(!clicked)}
      onPointerOver={(event) => hover(true)}
      onPointerOut={(event) => hover(false)}
    >
      <boxGeometry attach="geometry" args={[1, 1, 1]} />
      <meshStandardMaterial
        attach="material"
        color={hovered ? "hotpink" : "orange"}
      />
    </mesh>
  );
};

export default RotatingBox;
