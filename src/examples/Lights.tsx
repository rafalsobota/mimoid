import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { RectAreaLightHelper } from "three/examples/jsm/helpers/RectAreaLightHelper";
import { makeFullScreen, runRenderLoop } from "./helpers";
import dat from "dat.gui";

const Lights = () => {
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

    const standardMaterial = new THREE.MeshStandardMaterial();

    /**
     * Objects
     */

    const cube = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      standardMaterial
    );
    cube.position.set(-2, 0, 0);
    scene.add(cube);

    const sphere = new THREE.Mesh(
      new THREE.SphereGeometry(0.5, 32, 32),
      standardMaterial
    );
    scene.add(sphere);

    const torus = new THREE.Mesh(
      new THREE.TorusGeometry(0.4, 0.3, 8, 32),
      standardMaterial
    );
    torus.position.set(2, 0, 0);
    scene.add(torus);

    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(10, 10, 10, 10),
      standardMaterial
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -1;
    scene.add(ground);

    /**
     * Lights
     */
    const ambientLight = new THREE.AmbientLight();
    ambientLight.color = new THREE.Color(0xffffff);
    ambientLight.intensity = 0.5;
    const ambientGui = gui.addFolder("Ambient Light");
    ambientGui.add(ambientLight, "intensity", 0, 1).step(0.01);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight();
    directionalLight.color = new THREE.Color(0x00fffc);
    directionalLight.intensity = 0.5;
    directionalLight.position.set(1, 0.25, 0);
    const directionalGui = gui.addFolder("Directional Light");
    directionalGui.add(directionalLight, "intensity", 0, 1).step(0.01);
    scene.add(directionalLight);

    const hemisphereLight = new THREE.HemisphereLight();
    hemisphereLight.color = new THREE.Color(0xff0000);
    hemisphereLight.groundColor = new THREE.Color(0x0000ff);
    scene.add(hemisphereLight);

    const pointLight = new THREE.PointLight();
    pointLight.color = new THREE.Color(0xff9000);
    pointLight.intensity = 0.5;
    pointLight.position.set(1, -0.5, 1);
    scene.add(pointLight);

    const reactAreaLight = new THREE.RectAreaLight(0x4e00ff, 2, 1, 1);
    reactAreaLight.position.set(-1.5, 0, 1.5);
    reactAreaLight.lookAt(sphere.position);
    scene.add(reactAreaLight);

    const spotLight = new THREE.SpotLight();
    spotLight.color = new THREE.Color(0x78ff00);
    spotLight.intensity = 0.5;
    spotLight.distance = 10;
    spotLight.angle = Math.PI * 0.1;
    spotLight.penumbra = 0.25;
    spotLight.decay = 1;
    spotLight.position.set(0, 2, 3);
    spotLight.target.position.x = -0.75;
    scene.add(spotLight, spotLight.target);

    // Helpers

    const hemisphereLightHelper = new THREE.HemisphereLightHelper(
      hemisphereLight,
      0.2
    );
    scene.add(hemisphereLightHelper);

    const directionalLightHelper = new THREE.DirectionalLightHelper(
      directionalLight,
      0.2
    );
    scene.add(directionalLightHelper);

    const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.2);
    scene.add(pointLightHelper);

    const spotLightHelper = new THREE.SpotLightHelper(spotLight);
    scene.add(spotLightHelper);
    window.requestAnimationFrame(() => {
      spotLightHelper.update();
    });

    const reactAreaLightHelper = new RectAreaLightHelper(reactAreaLight);
    scene.add(reactAreaLightHelper);

    /**
     * Render
     */

    const clock = new THREE.Clock();

    function tick() {
      controls.update();

      const elapsedTime = clock.getElapsedTime();

      cube.rotation.y = 0.1 * elapsedTime;
      cube.rotation.x = 0.15 * elapsedTime;

      torus.rotation.y = 0.1 * elapsedTime;
      torus.rotation.x = 0.15 * elapsedTime;

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

export default Lights;
