import { Plane } from "@react-three/drei";
import { ThreeEvent } from "@react-three/fiber";
import { Vector3 } from "three";

type FloorProps = {
  onClick?: (point: Vector3) => void;
};

const Floor = (props: FloorProps) => {
  // const [balls, setBalls] = useState<Vector3[]>([]);

  const onClick = (event: ThreeEvent<MouseEvent>) => {
    // console.log(event);
    // setBalls([...balls, event.point]);
    props.onClick && props.onClick(event.point);
  };

  return (
    <>
      <Plane args={[30, 30]} rotation={[-Math.PI / 2, 0, 0]} onClick={onClick}>
        <meshBasicMaterial attach="material" />
      </Plane>
      {/* {balls.map((ball, index) => (
        <Sphere key={index} args={[0.2, 32, 32]} position={ball}>
          <meshBasicMaterial attach="material" color="blue" />
        </Sphere>
      ))} */}
    </>
  );
};

export default Floor;
