import { useEffect, useRef } from "react";
import * as THREE from "three";

const Cube = () => {
  const canvas = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const scene = new THREE.Scene();

    const axesHelper = new THREE.AxesHelper();
    scene.add(axesHelper);

    const group = new THREE.Group();

    scene.add(group);

    const cube1 = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshBasicMaterial({ color: 0xff0000 })
    );

    group.add(cube1);

    const cube2 = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshBasicMaterial({ color: 0x00ff00 })
    );

    cube2.position.x = -2;

    group.add(cube2);

    const cube3 = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshBasicMaterial({ color: 0x0000ff })
    );

    cube3.position.x = 2;

    group.position.y = 1;
    group.add(cube3);

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
