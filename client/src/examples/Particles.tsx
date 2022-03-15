import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { makeFullScreen, runRenderLoop } from "./helpers";
import dat from "dat.gui";

const Particles = () => {
  const canvas = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const gui = new dat.GUI();

    const scene = new THREE.Scene();

    /**
     * Textures
     */
    const textureLoader = new THREE.TextureLoader();

    const particleTexture = textureLoader.load("/textures/particles/2.png");

    /**
     * Particles
     */

    const particlesGeometry = new THREE.BufferGeometry();
    const count = 20000;

    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 5;
      colors[i] = Math.random();
    }

    particlesGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3)
    );

    particlesGeometry.setAttribute(
      "color",
      new THREE.BufferAttribute(colors, 3)
    );

    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.02,
      sizeAttenuation: true,
      // color: 0xff88cc,
      transparent: true,
      alphaMap: particleTexture,
      // alphaTest: 0.1,
      // depthTest: false,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexColors: true,
    });

    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);

    // const box = new THREE.Mesh(
    //   new THREE.BoxBufferGeometry(1, 1, 1),
    //   new THREE.MeshBasicMaterial({ color: 0xffffff })
    // );

    // scene.add(box);

    /**
     * Camera
     */

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 2;
    camera.position.y = 1;

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
    const ambientGui = gui.addFolder("Ambient Light");
    ambientGui.add(ambientLight, "intensity", 0, 1).step(0.01);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight();
    directionalLight.color = new THREE.Color(0xb9d5ff);
    directionalLight.intensity = 0.12;
    directionalLight.position.set(1, 1, 0);
    // directionalLight.shadow.radius = 10;
    const directionalGui = gui.addFolder("Directional Light");
    directionalGui.add(directionalLight, "intensity", 0, 1).step(0.01);
    scene.add(directionalLight);

    /**
     * Animations
     */

    const clock = new THREE.Clock();

    function tick() {
      controls.update();

      const elapsedTime = clock.getElapsedTime();

      // particles.rotation.y = elapsedTime * 0.2;
      for (let i = 0; i < count; i++) {
        const i3 = i * 3;

        // @ts-ignore
        const x = particlesGeometry.attributes.position.array[i3];

        // @ts-ignore
        particlesGeometry.attributes.position.array[i3 + 1] = Math.sin(
          elapsedTime + x
        );
      }
      particlesGeometry.attributes.position.needsUpdate = true;

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

export default Particles;
