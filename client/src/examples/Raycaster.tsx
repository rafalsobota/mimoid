import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { makeFullScreen, runRenderLoop } from "./helpers";
import dat from "dat.gui";

const Raycaster = () => {
  const canvas = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    /**
     * Initialization
     */

    const gui = new dat.GUI();

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 5);

    const renderer = new THREE.WebGLRenderer({ canvas: canvas.current! });
    // renderer.shadowMap.enabled = true;
    // renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    // renderer.setClearColor(0x262837);

    const fullscreenDestructor = makeFullScreen(camera, renderer);

    /**
     * Controls
     */

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    /**
     * Objects
     */

    const sphereGeometry = new THREE.SphereGeometry(0.5, 16, 16);
    // const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });

    const object1 = new THREE.Mesh(
      sphereGeometry,
      new THREE.MeshBasicMaterial({ color: 0xff0000 })
    );
    object1.position.x = -2;

    const object2 = new THREE.Mesh(
      sphereGeometry,
      new THREE.MeshBasicMaterial({ color: 0xff0000 })
    );

    const object3 = new THREE.Mesh(
      sphereGeometry,
      new THREE.MeshBasicMaterial({ color: 0xff0000 })
    );
    object3.position.x = 2;

    scene.add(object1, object2, object3);

    /**
     * Raycaster
     */

    const raycaster = new THREE.Raycaster();
    // const rayOrigin = new THREE.Vector3(-3, 0, 0);
    // const rayDirection = new THREE.Vector3(1, 0, 0);
    // raycaster.set(rayOrigin, rayDirection);
    // const intersect = raycaster.intersectObject(object1);
    // const intersects = raycaster.intersectObjects([object1, object2, object3]);

    /**
     * Lights
     */
    const ambientLight = new THREE.AmbientLight();
    ambientLight.color = new THREE.Color(0xb9d5ff);
    ambientLight.intensity = 0.12;
    // const ambientGui = gui.addFolder("Ambient Light");
    // ambientGui.add(ambientLight, "intensity", 0, 1).step(0.01);
    // scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight();
    directionalLight.color = new THREE.Color(0xb9d5ff);
    directionalLight.intensity = 0.12;
    directionalLight.position.set(1, 1, 0);
    // directionalLight.shadow.radius = 10;
    // const directionalGui = gui.addFolder("Directional Light");
    // directionalGui.add(directionalLight, "intensity", 0, 1).step(0.01);
    // scene.add(directionalLight);

    /**
     * Mouse
     */

    let currentIntersect: THREE.Intersection<
      THREE.Object3D<THREE.Event>
    > | null = null;

    const mouse = new THREE.Vector2();

    const mouseMoveHandler = (event: MouseEvent) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = (event.clientY / window.innerHeight) * -1 * 2 + 1;
    };

    window.addEventListener("mousemove", mouseMoveHandler);

    const clickHandler = (event: MouseEvent) => {
      if (currentIntersect) {
        // @ts-ignore
        const material = (currentIntersect.object as any)
          .material as THREE.MeshBasicMaterial;
        material.wireframe = !material.wireframe;
      }
    };

    window.addEventListener("click", clickHandler);

    /**
     * Animations
     */

    const clock = new THREE.Clock();

    function tick() {
      controls.update();

      const elapsedTime = clock.getElapsedTime();

      // Animate
      object1.position.y = Math.sin(elapsedTime * 0.3) * 1.5;
      object2.position.y = Math.cos(elapsedTime * 0.5) * 1.5;
      object3.position.y = Math.sin(elapsedTime * 0.7) * 1.5;

      // Cast a ray
      raycaster.setFromCamera(mouse, camera);

      // const rayOrigin = new THREE.Vector3(-3, 0, 0);
      // const rayDirection = new THREE.Vector3(1, 0, 0);
      // rayDirection.normalize();
      // raycaster.set(rayOrigin, rayDirection);

      const objectsToTest = [object1, object2, object3];
      const intersects = raycaster.intersectObjects(objectsToTest);

      if (intersects.length > 0) {
        if (currentIntersect?.object !== intersects[0].object) {
          currentIntersect = intersects[0];
        }
      } else {
        if (currentIntersect) {
          currentIntersect = null;
        }
      }

      objectsToTest.forEach((o) => {
        o.material.color.set(0xff0000);
      });

      intersects.forEach((intersection) => {
        const material: THREE.MeshBasicMaterial | undefined = (
          intersection.object as any
        ).material;
        if (material) {
          material.color.set(0x0000ff);
        }
      });

      // console.log(intersects);

      renderer.render(scene, camera);
    }

    const runLoopDestructor = runRenderLoop(tick);

    return () => {
      gui.destroy();
      runLoopDestructor();
      fullscreenDestructor();
      window.removeEventListener("mousemove", mouseMoveHandler);
      window.removeEventListener("click", clickHandler);
    };
  }, []);

  return <canvas ref={canvas}></canvas>;
};

export default Raycaster;
