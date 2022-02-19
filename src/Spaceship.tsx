import { useEffect, useRef } from "react";
import * as THREE from "three";

function makeInstance(
  geometry: THREE.BoxGeometry,
  color: THREE.ColorRepresentation,
  x: number
) {
  const material = new THREE.MeshPhongMaterial({ color });
  const cube = new THREE.Mesh(geometry, material);
  cube.position.x = x;
  return cube;
}

function resizeRendererToDisplaySize(renderer: THREE.Renderer) {
  const canvas = renderer.domElement;
  const pixelRatio = window.devicePixelRatio;
  const width = (canvas.clientWidth * pixelRatio) | 0;
  const height = (canvas.clientHeight * pixelRatio) | 0;
  const needResize = canvas.width !== width || canvas.height !== height;
  if (needResize) {
    renderer.setSize(width, height, false);
  }
  return needResize;
}

const Spaceship = ({ className }: { className?: string }) => {
  const canvas = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const renderer = new THREE.WebGLRenderer({
      canvas: canvas.current!,
      alpha: true,
      premultipliedAlpha: false,
      antialias: true,
    });

    const fov = 75;
    const aspect = 2; // the canvas default
    const near = 0.1;
    const far = 5;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.z = 2;

    const scene = new THREE.Scene();

    const boxWidth = 1;
    const boxHeight = 1;
    const boxDepth = 1;
    const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);

    const cubes = [
      makeInstance(geometry, 0x44aa88, 0),
      makeInstance(geometry, 0x8844aa, -2),
      makeInstance(geometry, 0xaa8844, 2),
    ];

    scene.add(...cubes);

    scene.add();

    const color = 0xffffff;
    const intensity = 1;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(-1, 2, 4);

    scene.add(light);

    let animationFrameHandle = 0;

    function render(time: number) {
      time *= 0.001;

      if (resizeRendererToDisplaySize(renderer)) {
        const c = renderer.domElement;
        camera.aspect = c.clientWidth / c.clientHeight;
        camera.updateProjectionMatrix();
      }

      cubes.forEach((cube, n) => {
        const speed = 1 + n * 0.1;
        const rot = time * speed;
        cube.rotation.x = rot;
        cube.rotation.y = rot;
      });

      renderer.render(scene, camera);

      animationFrameHandle = requestAnimationFrame(render);
    }

    animationFrameHandle = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animationFrameHandle);
  }, []);

  return (
    // <div className={className}>
    <canvas ref={canvas} className={className}></canvas>
    // </div>
  );
};

export default Spaceship;
