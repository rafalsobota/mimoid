import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { runRenderLoop } from "./helpers";
import dat from "dat.gui";

const Materials = () => {
  const canvas = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const gui = new dat.GUI();

    const textureLoader = new THREE.TextureLoader();
    const cubeTextureLoader = new THREE.CubeTextureLoader();

    // const doorColorTexture = textureLoader.load("/textures/door/color.jpg");
    // const doorAlphatexture = textureLoader.load("/textures/door/alpha.jpg");
    // const doorHeightTexture = textureLoader.load("/textures/door/height.jpg");
    // const doorMetalnessTexture = textureLoader.load(
    //   "/textures/door/metalness.jpg"
    // );
    // const doorNormalTexture = textureLoader.load("/textures/door/normal.jpg");
    // const doorRoughnessTexture = textureLoader.load(
    //   "/textures/door/roughness.jpg"
    // );
    // const doorAmbientOcclusionTexture = textureLoader.load(
    //   "/textures/door/ambientOcclusion.jpg"
    // );
    const gradientTexture = textureLoader.load("/textures/gradients/3.jpg");
    gradientTexture.minFilter = THREE.NearestFilter;
    gradientTexture.magFilter = THREE.NearestFilter;
    gradientTexture.generateMipmaps = false;

    // const matcapTexture = textureLoader.load("/textures/matcaps/3.png");

    const environmentCubeMap = cubeTextureLoader.load([
      "/textures/environmentMaps/4/px.png",
      "/textures/environmentMaps/4/nx.png",
      "/textures/environmentMaps/4/py.png",
      "/textures/environmentMaps/4/ny.png",
      "/textures/environmentMaps/4/pz.png",
      "/textures/environmentMaps/4/nz.png",
    ]);

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 5;
    camera.position.y = 2;

    const renderer = new THREE.WebGLRenderer({ canvas: canvas.current! });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    /**
     * Materials
     */

    // const material = new THREE.MeshBasicMaterial();
    // material.map = doorColorTexture;
    // material.color = new THREE.Color(0xff0000);
    // material.opacity = 0.5;
    // material.transparent = true;
    // material.alphaMap = doorAlphatexture;
    // material.side = THREE.DoubleSide;
    // material.wireframe = true;

    // const material = new THREE.MeshNormalMaterial();
    // material.wireframe = true;
    // material.flatShading = true;

    // const material = new THREE.MeshMatcapMaterial();
    // material.matcap = matcapTexture;

    // const material = new THREE.MeshDepthMaterial();

    // const material = new THREE.MeshLambertMaterial();

    // const material = new THREE.MeshPhongMaterial();
    // material.shininess = 100;
    // material.specular = new THREE.Color(0x1188ff);

    // const material = new THREE.MeshToonMaterial();
    // material.gradientMap = gradientTexture;

    // const material = new THREE.MeshStandardMaterial();
    // material.metalness = 0;
    // material.roughness = 1;
    // material.map = doorColorTexture;
    // material.aoMap = doorAmbientOcclusionTexture;
    // material.aoMapIntensity = 1;
    // material.displacementMap = doorHeightTexture;
    // material.displacementScale = 0.05;
    // material.metalnessMap = doorMetalnessTexture;
    // material.roughnessMap = doorRoughnessTexture;
    // material.normalMap = doorNormalTexture;
    // material.normalScale.set(0.5, 0.5);
    // material.alphaMap = doorAlphatexture;
    // material.transparent = true;

    const material = new THREE.MeshStandardMaterial();
    material.metalness = 0.7;
    material.roughness = 0.2;
    material.envMap = environmentCubeMap;

    // gui.add(material, "metalness").min(0).max(1).step(0.0001);
    // gui.add(material, "roughness").min(0).max(1).step(0.0001);
    // gui.add(material, "aoMapIntensity").min(0).max(10).step(0.0001);
    // gui.add(material, "displacementScale").min(0).max(1).step(0.0001);

    /**
     * Objects
     */

    const sphere = new THREE.Mesh(
      new THREE.SphereGeometry(0.5, 128, 128),
      material
    );
    sphere.geometry.setAttribute(
      "uv2",
      new THREE.BufferAttribute(sphere.geometry.attributes.uv.array, 2)
    );
    sphere.position.x = -1.5;

    const plane = new THREE.Mesh(
      new THREE.PlaneGeometry(1, 1, 64, 64),
      material
    );
    plane.geometry.setAttribute(
      "uv2",
      new THREE.BufferAttribute(plane.geometry.attributes.uv.array, 2)
    );

    const torus = new THREE.Mesh(
      new THREE.TorusGeometry(0.3, 0.2, 64, 128),
      material
    );
    torus.geometry.setAttribute(
      "uv2",
      new THREE.BufferAttribute(torus.geometry.attributes.uv.array, 2)
    );

    torus.position.x = 1.5;

    scene.add(sphere, plane, torus);

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

      sphere.rotation.y = 0.1 * elapsedTime;
      plane.rotation.y = 0.1 * elapsedTime;
      torus.rotation.y = 0.1 * elapsedTime;

      sphere.rotation.x = 0.15 * elapsedTime;
      plane.rotation.x = 0.15 * elapsedTime;
      torus.rotation.x = 0.15 * elapsedTime;

      renderer.render(scene, camera);
    }

    const runLoopDestructor = runRenderLoop(tick);

    return () => {
      gui.destroy();
      runLoopDestructor();
    };
  }, []);

  return <canvas ref={canvas}></canvas>;
};

export default Materials;
