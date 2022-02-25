import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { makeFullScreen, runRenderLoop, setUV2 } from "./helpers";
import dat from "dat.gui";

const HauntedHouse = () => {
  const canvas = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const gui = new dat.GUI();

    const scene = new THREE.Scene();

    // Fog

    const fog = new THREE.Fog(0x262837, 1, 15);
    scene.fog = fog;

    /**
     * Textures
     */
    const textureLoader = new THREE.TextureLoader();

    // Door
    const doorColorTexture = textureLoader.load("/textures/door/color.jpg");
    const doorAlphaTexture = textureLoader.load("/textures/door/alpha.jpg");
    const doorAmbientOcclusionTexture = textureLoader.load(
      "/textures/door/ambientOcclusion.jpg"
    );
    const doorHeightTexture = textureLoader.load("/textures/door/height.jpg");
    const doorNormalTexture = textureLoader.load("/textures/door/normal.jpg");
    const doorMetalnessTexture = textureLoader.load(
      "/textures/door/metalness.jpg"
    );
    const doorRoughnessTexture = textureLoader.load(
      "/textures/door/roughness.jpg"
    );

    // Walls
    const bricksColorTexture = textureLoader.load("/textures/bricks/color.jpg");
    const bricksAmbientOcclusionTexture = textureLoader.load(
      "/textures/bricks/ambientOcclusion.jpg"
    );
    const bricksNormalTexture = textureLoader.load(
      "/textures/bricks/normal.jpg"
    );
    const bricksRoughnessTexture = textureLoader.load(
      "/textures/bricks/roughness.jpg"
    );

    // Grass
    const grassColorTexture = textureLoader.load("/textures/grass/color.jpg");
    const grassAmbientOcclusionTexture = textureLoader.load(
      "/textures/grass/ambientOcclusion.jpg"
    );
    const grassNormalTexture = textureLoader.load("/textures/grass/normal.jpg");
    const grassRoughnessTexture = textureLoader.load(
      "/textures/grass/roughness.jpg"
    );

    [
      grassColorTexture,
      grassAmbientOcclusionTexture,
      grassNormalTexture,
      grassRoughnessTexture,
    ].forEach((texture) => {
      texture.repeat.set(8, 8);
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
    });

    /**
     * House
     */
    const house = new THREE.Group();
    scene.add(house);

    const walls = new THREE.Mesh(
      new THREE.BoxGeometry(4, 2.5, 4),
      new THREE.MeshStandardMaterial({
        map: bricksColorTexture,
        aoMap: bricksAmbientOcclusionTexture,
        normalMap: bricksNormalTexture,
        roughnessMap: bricksRoughnessTexture,
      })
    );
    setUV2(walls.geometry);
    walls.position.y = 2.5 / 2;
    house.add(walls);

    const roof = new THREE.Mesh(
      new THREE.ConeGeometry(3.5, 1, 4),
      new THREE.MeshStandardMaterial({ color: 0xb35f45 })
    );
    roof.position.y = 3;
    roof.rotation.y = Math.PI * 0.25;
    house.add(roof);

    const door = new THREE.Mesh(
      new THREE.PlaneGeometry(2.2, 2.2, 100, 100),
      new THREE.MeshStandardMaterial({
        map: doorColorTexture,
        alphaMap: doorAlphaTexture,
        transparent: true,
        aoMap: doorAmbientOcclusionTexture,
        displacementMap: doorHeightTexture,
        displacementScale: 0.1,
        normalMap: doorNormalTexture,
        metalnessMap: doorMetalnessTexture,
        roughnessMap: doorRoughnessTexture,
      })
    );

    setUV2(door.geometry);

    door.position.y = 1;
    door.position.z = 2.001;
    house.add(door);

    const bushGeometry = new THREE.SphereGeometry(1, 16, 16);
    const bushMaterial = new THREE.MeshStandardMaterial({ color: 0x89c854 });

    const bush1 = new THREE.Mesh(bushGeometry, bushMaterial);
    bush1.scale.set(0.5, 0.5, 0.5);
    bush1.position.set(0.8, 0.2, 2.2);
    house.add(bush1);

    const bush2 = new THREE.Mesh(bushGeometry, bushMaterial);
    bush2.scale.set(0.25, 0.25, 0.25);
    bush2.position.set(1.4, 0.1, 2.1);
    house.add(bush2);

    const bush3 = new THREE.Mesh(bushGeometry, bushMaterial);
    bush3.scale.set(0.4, 0.4, 0.4);
    bush3.position.set(-0.8, 0.1, 2.2);
    house.add(bush3);

    const bush4 = new THREE.Mesh(bushGeometry, bushMaterial);
    bush4.scale.set(0.15, 0.15, 0.15);
    bush4.position.set(-1, 0.05, 2.6);
    house.add(bush4);

    // Graves
    const graves = new THREE.Group();
    scene.add(graves);

    const graveGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.2);
    const graveMaterial = new THREE.MeshStandardMaterial({ color: 0xb2b6b1 });

    for (let i = 0; i < 50; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 4 + Math.random() * 5;
      const x = Math.sin(angle) * radius;
      const z = Math.cos(angle) * radius;

      const grave = new THREE.Mesh(graveGeometry, graveMaterial);
      grave.position.set(x, 0.3, z);
      grave.rotation.y = (Math.random() - 0.5) * 0.4;
      grave.rotation.z = (Math.random() - 0.5) * 0.4;
      grave.castShadow = true;
      graves.add(grave);
    }
    /**
     * Camera
     */

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 8;
    camera.position.y = 2;

    const renderer = new THREE.WebGLRenderer({ canvas: canvas.current! });
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setClearColor(0x262837);

    const fullscreenDestructor = makeFullScreen(camera, renderer);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    /**
     * Objects
     */

    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(20, 20),
      new THREE.MeshStandardMaterial({
        map: grassColorTexture,
        aoMap: grassAmbientOcclusionTexture,
        normalMap: grassNormalTexture,
        roughnessMap: grassRoughnessTexture,
      })
    );
    setUV2(floor.geometry);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    /**
     * Lights
     */
    const ambientLight = new THREE.AmbientLight();
    ambientLight.color = new THREE.Color(0xb9d5ff);
    ambientLight.intensity = 0.12;
    const ambientGui = gui.addFolder("Ambient Light");
    ambientGui.add(ambientLight, "intensity", 0, 1).step(0.01);
    scene.add(ambientLight);

    const moonLight = new THREE.DirectionalLight();
    moonLight.color = new THREE.Color(0xb9d5ff);
    moonLight.intensity = 0.12;
    moonLight.position.set(1, 1, 0);
    moonLight.castShadow = true;
    moonLight.shadow.mapSize.width = 1024;
    moonLight.shadow.mapSize.height = 1024;
    moonLight.shadow.camera.near = 1;
    moonLight.shadow.camera.far = 6;
    moonLight.shadow.camera.top = 2;
    moonLight.shadow.camera.bottom = -2;
    moonLight.shadow.camera.left = -2;
    moonLight.shadow.camera.right = 2;
    // directionalLight.shadow.radius = 10;
    const directionalGui = gui.addFolder("Directional Light");
    directionalGui.add(moonLight, "intensity", 0, 1).step(0.01);
    scene.add(moonLight);

    const doorLight = new THREE.PointLight(0xff7d46, 1, 7);
    doorLight.position.set(0, 2.2, 2.7);
    scene.add(doorLight);

    /**
     * Ghosts
     */

    const ghost1 = new THREE.PointLight(0xff00ff, 2, 3);
    scene.add(ghost1);

    const ghost2 = new THREE.PointLight(0x00ffff, 2, 3);
    scene.add(ghost2);

    const ghost3 = new THREE.PointLight(0xffff00, 2, 3);
    scene.add(ghost3);

    /**
     * Shadows
     */

    moonLight.castShadow = true;
    doorLight.castShadow = true;
    ghost1.castShadow = true;
    ghost2.castShadow = true;
    ghost3.castShadow = true;

    walls.castShadow = true;
    bush1.castShadow = true;
    bush2.castShadow = true;
    bush3.castShadow = true;
    bush4.castShadow = true;

    doorLight.shadow.mapSize.width = 256;
    doorLight.shadow.mapSize.height = 256;
    doorLight.shadow.camera.far = 7;

    ghost1.shadow.mapSize.width = 256;
    ghost1.shadow.mapSize.height = 256;
    ghost1.shadow.camera.far = 7;

    ghost2.shadow.mapSize.width = 256;
    ghost2.shadow.mapSize.height = 256;
    ghost2.shadow.camera.far = 7;

    ghost3.shadow.mapSize.width = 256;
    ghost3.shadow.mapSize.height = 256;
    ghost3.shadow.camera.far = 7;

    /**
     * Animations
     */

    const clock = new THREE.Clock();

    function tick() {
      controls.update();

      const elapsedTime = clock.getElapsedTime();

      const ghost1Angle = elapsedTime * 0.5;
      ghost1.position.x = Math.sin(ghost1Angle) * 4;
      ghost1.position.z = Math.cos(ghost1Angle) * 4;
      ghost1.position.y = Math.sin(ghost1Angle * 3);

      const ghost1Angle2 = elapsedTime * 0.32;
      ghost2.position.x = Math.sin(ghost1Angle2) * 5;
      ghost2.position.z = Math.cos(ghost1Angle2) * 5;
      ghost2.position.y =
        Math.sin(ghost1Angle2 * 4) + Math.sin(ghost1Angle2 * 2.5);

      const ghost3Angle = elapsedTime * 0.18;
      ghost3.position.x =
        Math.sin(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.3));
      ghost3.position.z =
        Math.cos(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.5));
      ghost3.position.y = Math.sin(ghost3Angle * 5) + Math.sin(elapsedTime * 2);

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

export default HauntedHouse;
