import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { makeFullScreen, runRenderLoop } from "./helpers";
import * as dat from "lil-gui";
import vertexShader from "../shaders/test/vertex.glsl";
import fragmentShader from "../shaders/test/fragment.glsl";

const Shaders = () => {
  const canvas = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const gui = new dat.GUI();

    const scene = new THREE.Scene();

    /**
     * Textures
     */
    // const textureLoader = new THREE.TextureLoader();

    /**
     * Test mesh
     */
    // Geometry
    const geometry = new THREE.PlaneGeometry(1, 1, 32, 32);

    // Material
    const material = new THREE.RawShaderMaterial({
      vertexShader,
      fragmentShader,
      // wireframe: true,
      side: THREE.DoubleSide,
    });

    // Mesh
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    /**
     * Camera
     */

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 2);

    /**
     * Renderer
     */

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
     * Lights
     */
    const ambientLight = new THREE.AmbientLight();
    ambientLight.color = new THREE.Color(0xb9d5ff);
    ambientLight.intensity = 0.12;
    // const ambientGui = gui.addFolder("Ambient Light");
    // ambientGui.add(ambientLight, "intensity", 0, 1).step(0.01);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight();
    directionalLight.color = new THREE.Color(0xb9d5ff);
    directionalLight.intensity = 0.12;
    directionalLight.position.set(1, 1, 0);
    // directionalLight.shadow.radius = 10;
    // const directionalGui = gui.addFolder("Directional Light");
    // directionalGui.add(directionalLight, "intensity", 0, 1).step(0.01);
    scene.add(directionalLight);

    /**
     * Render Loop
     */

    // const clock = new THREE.Clock();

    function tick() {
      controls.update();

      // const elapsedTime = clock.getElapsedTime();

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

export default Shaders;
