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
    const textureLoader = new THREE.TextureLoader();
    const flagTexture = textureLoader.load("/textures/flag-ukraine.webp");

    /**
     * Test mesh
     */
    // Geometry
    const geometry = new THREE.PlaneGeometry(1, 1, 32, 32);

    const count = geometry.attributes.position.count;
    const randoms = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      randoms[i] = Math.random();
    }

    geometry.setAttribute("aRandom", new THREE.BufferAttribute(randoms, 1));

    // Material
    const material = new THREE.RawShaderMaterial({
      vertexShader,
      fragmentShader,
      // wireframe: true,
      side: THREE.DoubleSide,
      uniforms: {
        uFrequency: { value: new THREE.Vector2(10, 5) },
        uTime: { value: 0 },
        uColor: { value: new THREE.Color("orange") },
        uTexture: { value: flagTexture },
      },
    });

    gui.add(material.uniforms.uFrequency.value, "x", 0, 20).name("Frequency X");
    gui.add(material.uniforms.uFrequency.value, "y", 0, 20).name("Frequency Y");

    // Mesh
    const mesh = new THREE.Mesh(geometry, material);
    mesh.scale.y = 2 / 3;
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

    const clock = new THREE.Clock();

    function tick() {
      controls.update();

      const elapsedTime = clock.getElapsedTime();

      material.uniforms.uTime.value = elapsedTime;

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
