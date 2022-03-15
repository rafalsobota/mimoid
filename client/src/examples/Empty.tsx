import { useEffect, useRef } from "react";
import * as THREE from "three";

export const Empty = () => {
  const canvas = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const scene = new THREE.Scene();
    console.log(scene);

    let animationFrameHandle = 0;

    function render(time: number) {
      animationFrameHandle = requestAnimationFrame(render);
    }

    animationFrameHandle = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animationFrameHandle);
  }, []);

  return <canvas ref={canvas}></canvas>;
};
