import { useEffect, useRef } from "react";
import * as THREE from "three";

const Cube = () => {
  const canvas = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const scene = new THREE.Scene();
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });

    const cube = new THREE.Mesh(geometry, material);

    scene.add(cube);

    const sizes = {
      width: 800,
      height: 600,
    };

    const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);

    camera.position.z = 3;

    scene.add(camera);

    const renderer = new THREE.WebGLRenderer({ canvas: canvas.current! });

    renderer.setSize(sizes.width, sizes.height);

    renderer.render(scene, camera);

    let animationFrameHandle = 0;

    function render(time: number) {
      animationFrameHandle = requestAnimationFrame(render);
    }

    animationFrameHandle = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animationFrameHandle);
  }, []);

  return <canvas ref={canvas}></canvas>;
};

export default Cube;
