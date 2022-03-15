import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { makeFullScreen, runRenderLoop } from "./helpers";
import dat from "dat.gui";

const Shadows = () => {
  const canvas = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const gui = new dat.GUI();

    const scene = new THREE.Scene();

    /**
     * Textures
     */
    const textureLoader = new THREE.TextureLoader();
    const matcapTexture = textureLoader.load("/textures/matcaps/8.png");

    // const bakedShadow = textureLoader.load("/textures/bakedShadow.jpg");
    const simpleShadow = textureLoader.load("/textures/simpleShadow.jpg");

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
    renderer.shadowMap.enabled = false;

    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

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
    // scene.add(cube);

    const sphere = new THREE.Mesh(
      new THREE.SphereGeometry(0.5, 32, 32),
      standardMaterial
    );
    sphere.castShadow = true;
    scene.add(sphere);

    const torus = new THREE.Mesh(
      new THREE.TorusGeometry(0.4, 0.3, 8, 32),
      standardMaterial
    );
    torus.position.set(2, 0, 0);
    // scene.add(torus);

    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(10, 10, 10, 10),
      standardMaterial
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.5;
    ground.receiveShadow = true;
    scene.add(ground);

    const sphereShadow = new THREE.Mesh(
      new THREE.PlaneGeometry(1.5, 1.5),
      new THREE.MeshBasicMaterial({
        color: 0x000000,
        transparent: true,
        alphaMap: simpleShadow,
      })
    );
    sphereShadow.rotation.x = -Math.PI * 0.5;
    sphereShadow.position.y = ground.position.y + 0.01;

    scene.add(sphereShadow);

    /**
     * Lights
     */
    const ambientLight = new THREE.AmbientLight();
    ambientLight.color = new THREE.Color(0xffffff);
    ambientLight.intensity = 0.2;
    const ambientGui = gui.addFolder("Ambient Light");
    ambientGui.add(ambientLight, "intensity", 0, 1).step(0.01);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight();
    directionalLight.color = new THREE.Color(0xffffff);
    directionalLight.intensity = 0.2;
    directionalLight.position.set(1, 1, 0);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 1024;
    directionalLight.shadow.mapSize.height = 1024;
    directionalLight.shadow.camera.near = 1;
    directionalLight.shadow.camera.far = 6;
    directionalLight.shadow.camera.top = 2;
    directionalLight.shadow.camera.bottom = -2;
    directionalLight.shadow.camera.left = -2;
    directionalLight.shadow.camera.right = 2;
    // directionalLight.shadow.radius = 10;
    const directionalGui = gui.addFolder("Directional Light");
    directionalGui.add(directionalLight, "intensity", 0, 1).step(0.01);
    scene.add(directionalLight);

    const spotLight = new THREE.SpotLight(0xffffff, 0.4, 10, Math.PI * 0.3);
    spotLight.castShadow = true;
    spotLight.position.set(0, 2, 2);
    spotLight.shadow.mapSize.width = 1024;
    spotLight.shadow.mapSize.height = 1024;
    spotLight.shadow.camera.near = 1;
    spotLight.shadow.camera.far = 6;
    spotLight.shadow.camera.fov = 40;
    scene.add(spotLight, spotLight.target);
    const spotLightGui = gui.addFolder("Spot Light");

    const pointLight = new THREE.PointLight(0xffffff, 0.3);
    pointLight.castShadow = true;
    pointLight.position.set(-1, 1, 0);
    scene.add(pointLight);

    const pointLightCameraHelper = new THREE.CameraHelper(
      pointLight.shadow.camera
    );
    pointLightCameraHelper.visible = false;
    scene.add(pointLightCameraHelper);

    // Helpers

    const directionalLightHelper = new THREE.DirectionalLightHelper(
      directionalLight,
      0.2
    );
    directionalLightHelper.visible = false;
    directionalGui.add(directionalLightHelper, "visible").name("Helper");
    scene.add(directionalLightHelper);

    const directionalLightCameraHelper = new THREE.CameraHelper(
      directionalLight.shadow.camera
    );
    directionalLightCameraHelper.visible = false;
    directionalGui
      .add(directionalLightCameraHelper, "visible")
      .name("Camera Helper");
    scene.add(directionalLightCameraHelper);

    const spotLightCameraHelper = new THREE.CameraHelper(
      spotLight.shadow.camera
    );
    spotLightCameraHelper.visible = false;
    scene.add(spotLightCameraHelper);
    spotLightGui.add(spotLightCameraHelper, "visible").name("Camera Helper");

    /**
     * Render
     */

    const clock = new THREE.Clock();

    function tick() {
      controls.update();

      const elapsedTime = clock.getElapsedTime();

      // cube.rotation.y = 0.1 * elapsedTime;
      // cube.rotation.x = 0.15 * elapsedTime;

      // torus.rotation.y = 0.1 * elapsedTime;
      // torus.rotation.x = 0.15 * elapsedTime;

      sphere.position.x = Math.sin(elapsedTime);
      sphere.position.z = Math.cos(elapsedTime);

      sphere.position.y = Math.abs(Math.sin(elapsedTime * 3));

      sphereShadow.position.x = sphere.position.x;
      sphereShadow.position.z = sphere.position.z;
      sphereShadow.material.opacity = 1 - sphere.position.y;

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

export default Shadows;
