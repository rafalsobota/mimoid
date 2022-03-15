import { useEffect, useRef } from "react";
import * as THREE from "three";
import { makeFullScreen, runRenderLoop } from "./helpers";
import dat from "dat.gui";
import "./Scroll.css";
import gsap from "gsap";

const Scroll = () => {
  const canvas = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    /**
     * Initialization
     */

    const gui = new dat.GUI();

    const parameters = {
      materialColor: "#ffeded",
    };

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 5);
    const cameraGroup = new THREE.Group();
    scene.add(cameraGroup);
    cameraGroup.add(camera);

    const renderer = new THREE.WebGLRenderer({
      canvas: canvas.current!,
      alpha: true,
    });
    // renderer.shadowMap.enabled = true;
    // renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    // renderer.setClearColor(0x262837);

    const fullscreenDestructor = makeFullScreen(camera, renderer);

    /**
     * Textures
     */

    const textureLoader = new THREE.TextureLoader();

    const toonTexture = textureLoader.load("/textures/gradients/3.jpg");
    toonTexture.magFilter = THREE.NearestFilter;

    /**
     * Controls
     */

    // const controls = new OrbitControls(camera, renderer.domElement);
    // controls.enableDamping = true;

    /**
     * Materials
     */
    const material = new THREE.MeshToonMaterial({
      color: parameters.materialColor,
      gradientMap: toonTexture,
    });

    /**
     * Objects
     */

    const objectsDistance = 4;

    const mesh1 = new THREE.Mesh(
      new THREE.TorusGeometry(1, 0.4, 16, 60),
      material
    );
    mesh1.position.x = 2;

    const mesh2 = new THREE.Mesh(new THREE.ConeGeometry(1, 2, 32), material);
    mesh2.position.x = -2;

    const mesh3 = new THREE.Mesh(
      new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16),
      material
    );
    mesh3.position.x = 2;

    mesh1.position.y = -objectsDistance * 0;
    mesh2.position.y = -objectsDistance * 1;
    mesh3.position.y = -objectsDistance * 2;

    scene.add(mesh1, mesh2, mesh3);

    const sectionMeshes = [mesh1, mesh2, mesh3];

    /**
     * Particles
     */
    // Geometry
    const particlesCount = 200;
    const positions = new Float32Array(particlesCount * 3);
    for (let i = 0; i < particlesCount; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 10;
      positions[i3 + 1] =
        objectsDistance * 0.4 -
        Math.random() * objectsDistance * sectionMeshes.length;
      positions[i3 + 2] = (Math.random() - 0.5) * 10;
    }
    const particlesGeometry = new THREE.BufferGeometry();
    particlesGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3)
    );

    const particlesMaterial = new THREE.PointsMaterial({
      color: parameters.materialColor,
      sizeAttenuation: true,
      size: 0.03,
    });

    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);

    /**
     * Tweaks
     */

    gui.addColor(parameters, "materialColor").onChange((value) => {
      material.color.set(value);
      particlesMaterial.color.set(value);
    });

    /**
     * Lights
     */

    const directionalLight = new THREE.DirectionalLight();
    directionalLight.color = new THREE.Color(0xffffff);
    directionalLight.intensity = 1;
    directionalLight.position.set(1, 1, 0);
    scene.add(directionalLight);

    /**
     * Cursor
     */

    const cursor = { x: 0, y: 0 };

    const onMouseMove = (event: MouseEvent) => {
      cursor.x = event.clientX / window.innerWidth - 0.5;
      cursor.y = -event.clientY / window.innerWidth + 0.5;
    };

    window.addEventListener("mousemove", onMouseMove);

    /**
     * Scroll
     */

    let scrollY = window.scrollY;
    let currentSection = 0;

    window.addEventListener("scroll", () => {
      scrollY = window.scrollY;
      const newSection = Math.round(scrollY / window.innerHeight);
      if (newSection !== currentSection) {
        currentSection = newSection;
        gsap.to(sectionMeshes[currentSection].rotation, {
          x: "+=6",
          y: "+=3",
          z: "+=1.5",
          duration: 1.5,
          ease: "power2.inOut",
        });
      }
    });

    /**
     * Animations
     */

    const clock = new THREE.Clock();
    let previousTime = 0;

    function tick() {
      // controls.update();
      const elapsedTime = clock.getElapsedTime();
      const deltaTime = elapsedTime - previousTime;
      previousTime = elapsedTime;

      // Animate Camera
      camera.position.y = (-scrollY / canvas.current!.height) * objectsDistance;

      const parallaxX = cursor.x;
      const parallaxY = cursor.y;
      cameraGroup.position.x +=
        (parallaxX - cameraGroup.position.x) * 2 * deltaTime;
      cameraGroup.position.y +=
        (parallaxY - cameraGroup.position.y) * 2 * deltaTime;

      // Animate Meshes
      sectionMeshes.forEach((mesh) => {
        mesh.rotation.y += deltaTime * 0.1;
        mesh.rotation.x += deltaTime * 0.12;
      });

      renderer.render(scene, camera);
    }

    const runLoopDestructor = runRenderLoop(tick);

    return () => {
      gui.destroy();
      runLoopDestructor();
      fullscreenDestructor();
      // window.removeEventListener("mousemove", mouseMoveHandler);
      // window.removeEventListener("click", clickHandler);
    };
  }, []);

  return (
    <>
      <canvas ref={canvas} className="webgl"></canvas>
      <section className="section">
        <h1>My Portfolio</h1>
      </section>
      <section className="section">
        <h2>My projects</h2>
      </section>
      <section className="section">
        <h2>Contact me</h2>
      </section>
    </>
  );
};

export default Scroll;
