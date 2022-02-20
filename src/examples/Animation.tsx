import { useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";

const Animation = () => {
  const canvas = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const scene = new THREE.Scene();

    const axesHelper = new THREE.AxesHelper();
    scene.add(axesHelper);

    const cube1 = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshBasicMaterial({ color: 0xff0000 })
    );

    scene.add(cube1);

    const sizes = {
      width: 800,
      height: 600,
    };

    const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);

    camera.position.z = 3;

    scene.add(camera);

    const renderer = new THREE.WebGLRenderer({ canvas: canvas.current! });

    renderer.setSize(sizes.width, sizes.height);

    let animationFrameHandle = 0;

    const clock = new THREE.Clock();

    gsap.to(cube1.position, {
      x: 2,
      duration: 1,
      delay: 1,
    });

    gsap.to(cube1.position, {
      x: 0,
      duration: 1,
      delay: 2,
    });

    const tick = () => {
      const elapsedTime = clock.getElapsedTime();

      // cube1.position.x = Math.sin(elapsedTime);
      // cube1.position.y = Math.cos(elapsedTime);
      cube1.rotation.y = elapsedTime;

      camera.lookAt(cube1.position);

      renderer.render(scene, camera);
      animationFrameHandle = requestAnimationFrame(tick);
    };

    animationFrameHandle = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animationFrameHandle);
  }, []);

  return <canvas ref={canvas}></canvas>;
};

export default Animation;
