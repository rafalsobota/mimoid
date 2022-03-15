import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// import gsap from "gsap";

const Camera = () => {
  const canvas = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const destructors: Array<() => void> = [];

    const scene = new THREE.Scene();

    // const axesHelper = new THREE.AxesHelper();
    // scene.add(axesHelper);

    const cube1 = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshBasicMaterial({ color: 0xff0000 })
    );

    scene.add(cube1);

    const sizes = {
      width: 800,
      height: 600,
    };

    const camera = new THREE.PerspectiveCamera(
      75,
      sizes.width / sizes.height,
      0.1,
      1000
    );

    // const aspectRation = sizes.width / sizes.height;
    // const camera = new THREE.OrthographicCamera(
    //   -1 * aspectRation,
    //   1 * aspectRation,
    //   1,
    //   -1,
    //   0.1,
    //   1000
    // );

    // const cursor = {
    //   x: 0,
    //   y: 0,
    // };

    // const mouseMoveHandler = (event: MouseEvent) => {
    //   cursor.x = event.clientX / sizes.width - 0.5;
    //   cursor.y = -(event.clientY / sizes.height - 0.5);
    // };

    // window.addEventListener("mousemove", mouseMoveHandler);

    // destructors.push(() => {
    //   window.removeEventListener("mousemove", mouseMoveHandler);
    // });

    camera.position.z = 3;

    scene.add(camera);

    const renderer = new THREE.WebGLRenderer({ canvas: canvas.current! });

    renderer.setSize(sizes.width, sizes.height);

    let animationFrameHandle = 0;

    // const clock = new THREE.Clock();

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    const tick = () => {
      // const elapsedTime = clock.getElapsedTime();

      controls.update();

      // cube1.position.x = Math.sin(elapsedTime);
      // cube1.position.y = Math.cos(elapsedTime);
      // cube1.rotation.y = elapsedTime;

      // camera.position.x = Math.sin(cursor.x * Math.PI * 2) * 3;
      // camera.position.z = Math.cos(cursor.x * Math.PI * 2) * 3;
      // camera.position.y = cursor.y * 5;

      // camera.lookAt(cube1.position);

      renderer.render(scene, camera);
      animationFrameHandle = requestAnimationFrame(tick);
    };

    animationFrameHandle = requestAnimationFrame(tick);

    destructors.push(() => {
      cancelAnimationFrame(animationFrameHandle);
    });

    return () => {
      destructors.forEach((d) => d());
    };
  }, []);

  return <canvas ref={canvas}></canvas>;
};

export default Camera;
