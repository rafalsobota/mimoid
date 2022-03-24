import { useEffect, useRef } from "react";
import * as THREE from "three";
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { makeFullScreen, runRenderLoop } from "../examples/helpers";
// import dat from "dat.gui";
// @ts-ignore
import Stats from "stats.js";
import { addSpaceSkybox } from "../components/spaceSkybox";
// import { addSpaceLight } from "../components/spaceLight";

import { Component, Entity, System, Types } from "ecsy";
import {
  initialize,
  Object3DComponent,
  ECSYThreeWorld,
  ECSYThreeEntity,
} from "ecsy-three";

class Rotating extends Component<{ speed: number }> {}
Rotating.schema = {
  speed: { default: 1, type: Types.Number },
};

type OrbitingProps = { distance?: number } | false | undefined;
class Orbiting extends Component<OrbitingProps> {
  // distance = 0;
  // constructor(props: OrbitingProps) {
  //   super(props);
  //   if (props) {
  //     this.distance = props.distance || 30;
  //   }
  // }
}
Orbiting.schema = {
  distance: { default: 30, type: Types.Number },
};

class RotationSystem extends System {
  execute(delta: number) {
    this.queries.entities.results.forEach((entity) => {
      const rotation = (entity as ECSYThreeEntity).getObject3D()!.rotation;
      const speed = (
        (entity as ECSYThreeEntity).getComponent(Rotating)! as unknown as {
          speed: number;
        }
      ).speed;
      rotation.x += 0.5 * delta * speed;
      rotation.y += 0.1 * delta * speed;
    });
  }
}
RotationSystem.queries = {
  entities: {
    components: [Rotating, Object3DComponent],
  },
};

class OrbitSystem extends System {
  execute(delta: number, time: number) {
    this.queries.entities.results.forEach((entity) => {
      const object = (entity as ECSYThreeEntity).getObject3D()!;
      const orbiting = entity.getComponent(Orbiting)! as unknown as {
        distance: number;
      };
      const position = object.position;
      position.x = Math.sin(time * 0.1) * orbiting.distance;
      position.z = Math.cos(time * 0.1) * orbiting.distance;
      object.lookAt(
        new THREE.Vector3(Math.cos(time * 0.5) * 3, Math.sin(time * 0.3) * 3, 0)
      );
    });
  }
}
OrbitSystem.queries = {
  entities: {
    components: [Orbiting, Object3DComponent],
  },
};

const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
const boxMaterial = new THREE.MeshNormalMaterial({
  transparent: true,
  opacity: 0.9,
});

const addBox = (
  world: ECSYThreeWorld,
  parentEntity: Entity,
  x: number,
  y: number,
  z: number
) => {
  // const material = new THREE.MeshPhongMaterial({ color: 0x00ff00 });

  const mesh = new THREE.Mesh(boxGeometry, boxMaterial);
  mesh.position.set(x, y, z);

  world
    .createEntity()
    .addObject3DComponent(mesh, parentEntity)
    .addComponent(Rotating, { speed: Math.random() * 2 });
};

const Battle = () => {
  const canvas = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const world = new ECSYThreeWorld({ entityPoolSize: 10000 });

    const renderer = new THREE.WebGLRenderer({
      canvas: canvas.current!,
      // powerPreference: "high-performance",
    });

    const { sceneEntity, camera, scene, cameraEntity } = initialize(world, {
      renderer,
    });

    addSpaceSkybox(scene);
    makeFullScreen(camera, renderer);

    // const controls = new OrbitControls(camera, renderer.domElement);

    // addSpaceLight(scene);
    // scene.background = new THREE.Color(0x000000);

    world.registerComponent(Rotating);
    world.registerComponent(Orbiting);
    world.registerSystem(RotationSystem);
    world.registerSystem(OrbitSystem);

    cameraEntity.addComponent(Orbiting, { distance: 30 });
    camera.position.z = 30;

    const n = 15;

    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        for (let k = 0; k < n; k++) {
          addBox(world, sceneEntity, i * 2 - n, j * 2 - n, k * 2 - n);
        }
      }
    }

    const stats = new Stats();
    stats.showPanel(0);
    document.body.appendChild(stats.dom);

    return runRenderLoop((time) => {
      stats.begin();
      // controls.update();
      stats.end();
    });
  }, []);

  return <canvas ref={canvas} className="w-full h-full bg-pink-500"></canvas>;
};

export default Battle;
