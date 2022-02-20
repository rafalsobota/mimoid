import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// import gsap from "gsap";

const Fullscreen = () => {
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
      width: window.innerWidth,
      height: window.innerHeight,
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

    camera.position.z = 3;

    scene.add(camera);

    const renderer = new THREE.WebGLRenderer({ canvas: canvas.current! });

    renderer.setSize(sizes.width, sizes.height);

    const updatePixelRation = () => {
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };
    updatePixelRation();

    let animationFrameHandle = 0;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    const resizeHanlder = () => {
      sizes.width = window.innerWidth;
      sizes.height = window.innerHeight;
      camera.aspect = sizes.width / sizes.height;
      camera.updateProjectionMatrix();
      renderer.setSize(sizes.width, sizes.height);
      updatePixelRation();
    };

    window.addEventListener("resize", resizeHanlder);

    destructors.push(() => {
      window.removeEventListener("resize", resizeHanlder);
    });

    const doubleClickHadnler = () => {
      const c = canvas.current!;
      const fullscreenElement =
        document.fullscreenElement ||
        // @ts-ignore
        document.webkitFullscreenElement;

      if (!fullscreenElement) {
        if (c.requestFullscreen) {
          c.requestFullscreen();
          // @ts-ignore
        } else if (c.webkitRequestFullscreen) {
          // @ts-ignore
          c.webkitRequestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
          // @ts-ignore
        } else if (document.webkitExitFullscreen) {
          // @ts-ignore
          document.webkitExitFullscreen();
        }
      }
    };

    window.addEventListener("dblclick", doubleClickHadnler);

    destructors.push(() => {
      window.removeEventListener("dblclick", doubleClickHadnler);
    });

    const tick = () => {
      controls.update();

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

export default Fullscreen;
