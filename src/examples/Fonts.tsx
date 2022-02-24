import { useEffect, useRef } from "react";
import * as THREE from "three";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { makeFullScreen, runRenderLoop } from "./helpers";
import dat from "dat.gui";

export const Fonts = () => {
  const canvas = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const gui = new dat.GUI();

    const scene = new THREE.Scene();

    /**
     * Textures
     */
    const textureLoader = new THREE.TextureLoader();
    const matcapTexture = textureLoader.load("/textures/matcaps/8.png");

    /**
     * Materials
     */

    const material = new THREE.MeshMatcapMaterial();
    material.matcap = matcapTexture;

    /**
     * Fonts
     */
    const fontLoader = new FontLoader();

    fontLoader.load("/fonts/helvetiker_regular.typeface.json", (font) => {
      const textGeometry = new TextGeometry("Donutoid", {
        font: font,
        size: 0.5,
        height: 0.2,
        curveSegments: 5,
        bevelEnabled: true,
        bevelThickness: 0.03,
        bevelSize: 0.02,
        bevelOffset: 0,
        bevelSegments: 4,
      });

      textGeometry.center();

      const textMesh = new THREE.Mesh(textGeometry, material);
      textMesh.position.set(0, 0, 0);

      scene.add(textMesh);
    });

    /**
     * Camera
     */

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 5;
    camera.position.y = 2;

    const renderer = new THREE.WebGLRenderer({ canvas: canvas.current! });

    const fullscreenDestructor = makeFullScreen(camera, renderer);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    /**
     * Materials
     */

    /**
     * Objects
     */

    const cube = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshStandardMaterial()
    );
    // scene.add(cube);

    // const axesHelper = new THREE.AxesHelper();
    // scene.add(axesHelper);

    console.time("donuts");

    const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 20, 45);

    for (let i = 0; i < 50; i++) {
      const donutMesh = new THREE.Mesh(donutGeometry, material);
      donutMesh.position.set(
        Math.random() * 10 - 5,
        Math.random() * 10 - 5,
        Math.random() * 10 - 5
      );
      donutMesh.rotation.x = Math.random() * Math.PI;
      donutMesh.rotation.y = Math.random() * Math.PI;

      const scale = Math.random() * 0.5 + 0.5;

      donutMesh.scale.set(scale, scale, scale);

      scene.add(donutMesh);
    }

    console.timeEnd("donuts");

    /**
     * Lights
     */

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 0.5);
    pointLight.position.x = 2;
    pointLight.position.y = 3;
    pointLight.position.z = 4;
    scene.add(pointLight);

    /**
     * Render
     */

    const clock = new THREE.Clock();

    function tick() {
      controls.update();

      const elapsedTime = clock.getElapsedTime();

      cube.rotation.y = 0.1 * elapsedTime;

      cube.rotation.x = 0.15 * elapsedTime;

      renderer.render(scene, camera);
    }

    const runLoopDestructor = runRenderLoop(tick);

    return () => {
      gui.destroy();
      runLoopDestructor();
      fullscreenDestructor();
    };
  }, []);

  return <canvas ref={canvas}></canvas>;
};
