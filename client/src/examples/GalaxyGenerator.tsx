import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { makeFullScreen, runRenderLoop } from "./helpers";
import dat from "dat.gui";

const GalaxyGenerator = () => {
  const canvas = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const gui = new dat.GUI();

    const scene = new THREE.Scene();

    /**
     * Textures
     */
    // const textureLoader = new THREE.TextureLoader();

    /**
     * Particles
     */

    const parameters = {
      count: 30000,
      size: 0.01,
      radius: 10,
      branches: 3,
      spin: 0.4,
      randomness: 2,
      randomnessPower: 3,
      insideColor: "#ff6030",
      outsideColor: "#1b3984",
    };

    gui
      .add(parameters, "count")
      .min(0)
      .max(1000000)
      .step(100)
      .onFinishChange(() => generateGalaxy());
    gui
      .add(parameters, "size")
      .min(0.001)
      .max(0.1)
      .step(0.001)
      .onFinishChange(() => generateGalaxy());
    gui
      .add(parameters, "radius")
      .min(0.01)
      .max(20)
      .step(0.01)
      .onFinishChange(() => generateGalaxy());
    gui
      .add(parameters, "branches")
      .min(2)
      .max(20)
      .step(1)
      .onFinishChange(() => generateGalaxy());
    gui
      .add(parameters, "spin")
      .min(-5)
      .max(5)
      .step(0.001)
      .onFinishChange(() => generateGalaxy());
    gui
      .add(parameters, "randomness")
      .min(0)
      .max(5)
      .step(0.01)
      .onFinishChange(() => generateGalaxy());
    gui
      .add(parameters, "randomnessPower")
      .min(1)
      .max(10)
      .step(0.001)
      .onFinishChange(() => generateGalaxy());
    gui.addColor(parameters, "insideColor").onChange(() => generateGalaxy());
    gui.addColor(parameters, "outsideColor").onChange(() => generateGalaxy());

    let geometry: THREE.BufferGeometry;
    let material: THREE.PointsMaterial;
    let points: THREE.Points;

    const generateGalaxy = () => {
      if (points) {
        geometry.dispose();
        material.dispose();
        scene.remove(points);
      }

      geometry = new THREE.BufferGeometry();

      const positions = new Float32Array(parameters.count * 3);
      const colors = new Float32Array(parameters.count * 3);

      const colorInside = new THREE.Color(parameters.insideColor);
      const colorOutside = new THREE.Color(parameters.outsideColor);

      for (let i = 0; i < parameters.count; i++) {
        const i3 = i * 3;

        // position
        const branchAngle =
          ((i % parameters.branches) / parameters.branches) * Math.PI * 2;
        const radius = Math.random() * parameters.radius;
        const spinAngle = radius * parameters.spin;

        const randomX =
          Math.pow(Math.random(), parameters.randomnessPower) *
          parameters.randomness *
          (Math.random() > 0.5 ? 1 : -1);
        const randomY =
          Math.pow(Math.random(), parameters.randomnessPower) *
          parameters.randomness *
          (Math.random() > 0.5 ? 1 : -1);
        const randomZ =
          Math.pow(Math.random(), parameters.randomnessPower) *
          parameters.randomness *
          (Math.random() > 0.5 ? 1 : -1);

        positions[i3 + 0] =
          Math.cos(branchAngle + spinAngle) * radius + randomX;
        positions[i3 + 1] = randomY;
        positions[i3 + 2] =
          Math.sin(branchAngle + spinAngle) * radius + randomZ;

        // color
        const color = colorInside
          .clone()
          .lerp(colorOutside, radius / parameters.radius);
        colors[i3 + 0] = color.r;
        colors[i3 + 1] = color.g;
        colors[i3 + 2] = color.b;
      }

      geometry.setAttribute(
        "position",
        new THREE.BufferAttribute(positions, 3)
      );

      geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

      material = new THREE.PointsMaterial({
        size: parameters.size,
        sizeAttenuation: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexColors: true,
      });

      points = new THREE.Points(geometry, material);
      scene.add(points);
    };

    generateGalaxy();

    /**
     * Camera
     */

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(3, 10, 20);

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
     * Animations
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

export default GalaxyGenerator;
