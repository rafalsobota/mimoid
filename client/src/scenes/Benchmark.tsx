import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { makeFullScreen, runRenderLoop } from "../examples/helpers";
import dat from "dat.gui";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import * as SkeletonUtils from "three/examples/jsm/utils/SkeletonUtils";
// @ts-ignore
import Stats from "stats.js";

const Benchmark = () => {
  const canvas = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const destructors: (() => void)[] = [];
    const processors: ((deltaTime: number) => void)[] = [];

    const gui = new dat.GUI();
    destructors.push(() => gui.destroy());

    const stats = new Stats();
    stats.showPanel(0);
    document.body.appendChild(stats.dom);
    destructors.push(() => {
      document.body.removeChild(stats.dom);
    });

    const scene = new THREE.Scene();

    /**
     * Textures
     */
    // const textureLoader = new THREE.TextureLoader();

    /**
     * Models
     */

    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("/draco/");
    const gltfLoader = new GLTFLoader();
    gltfLoader.setDRACOLoader(dracoLoader);

    const sphere = new THREE.SphereGeometry(1, 8, 8);
    const whiteMaterial = new THREE.MeshBasicMaterial({ color: 0x333333 });

    gltfLoader.load(
      "/assets/Walking/Alien.gltf",
      (gltf) => {
        // SkeletonUtils.clone;

        for (let i = 0; i < 20; i++) {
          for (let j = 0; j < 20; j++) {
            const characterScene = (SkeletonUtils as any).clone(gltf.scene);
            const mixer = new THREE.AnimationMixer(characterScene);
            // processors.push((t) => mixer.update(t));
            const action = mixer.clipAction(gltf.animations[0], characterScene);
            action.play();

            // console.log("success", gltf);
            //  scene.add(gltf.scene);
            characterScene.scale.set(0.025, 0.025, 0.025);

            const lod = new THREE.LOD();
            lod.addLevel(characterScene, 0);

            // const characterScene2 = (SkeletonUtils as any).clone(gltf.scene);
            // characterScene2.scale.set(0.025, 0.025, 0.025);
            // lod.addLevel(characterScene2, 30);

            const basicMesh = new THREE.Mesh(sphere, whiteMaterial);
            basicMesh.position.y = 2;
            basicMesh.scale.y = 2;

            lod.addLevel(basicMesh, 50);
            lod.position.set(i * 10 - 100, 0, j * 10 - 100);
            // lod.curr

            processors.push((t) => {
              if (lod.getCurrentLevel() === 0) {
                mixer.update(t);
              }
              lod.rotation.y += t * 0.5;
            });
            scene.add(lod);
            // lod.update(camera);
          }
        }

        // [...gltf.scene.children].forEach((e) => scene.add(e));
      },
      () => {
        // console.log("progress", p);
      },
      (e) => {
        console.error(e);
      }
    );

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

    const renderer = new THREE.WebGLRenderer({
      canvas: canvas.current!,
      powerPreference: "high-performance",
    });
    // renderer.shadowMap.enabled = true;
    // renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    // renderer.setClearColor(0x262837);

    destructors.push(makeFullScreen(camera, renderer));

    /**
     * Controls
     */

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    processors.push(controls.update);

    /**
     * Lights
     */
    const ambientLight = new THREE.AmbientLight();
    ambientLight.color = new THREE.Color(0xb9d5ff);
    ambientLight.intensity = 1;
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

    const clock = new THREE.Clock();
    let previousTime = 0;

    const tick = () => {
      stats.begin();
      const elapsedTime = clock.getElapsedTime();
      const deltaTime = elapsedTime - previousTime;
      previousTime = elapsedTime;

      // controls.update();

      processors.forEach((p) => p(deltaTime));

      renderer.render(scene, camera);
      stats.end();
    };

    destructors.push(runRenderLoop(tick));

    return () => {
      destructors.forEach((d) => d());
    };
  }, []);

  return <canvas ref={canvas}></canvas>;
};

export default Benchmark;
