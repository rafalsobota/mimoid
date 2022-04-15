import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { makeFullScreen, runRenderLoop } from "./helpers";
import * as dat from "lil-gui";
import waterVertexShader from "../shaders/water/vertex.glsl";
import waterFragmentShader from "../shaders/water/fragment.glsl";

const Water = () => {
  const canvas = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const gui = new dat.GUI({ width: 340 });
    const debugObject: any = {};

    const scene = new THREE.Scene();

    /**
     * Textures
     */
    // const textureLoader = new THREE.TextureLoader();

    /**
     * Water
     */
    // Geometry
    const waterGeometry = new THREE.PlaneGeometry(2, 2, 512, 512);

    debugObject.depthColor = "#186691";
    debugObject.surfaceColor = "#9bd8ff";

    // Material
    const waterMaterial = new THREE.ShaderMaterial({
      vertexShader: waterVertexShader,
      fragmentShader: waterFragmentShader,
      uniforms: {
        uTime: { value: 0 },

        uBigWavesElevation: { value: 0.2 },
        uBigWavesFrequency: { value: new THREE.Vector2(4, 1.5) },
        uBigWavesSpeed: { value: 0.75 },

        uSmallWavesElevation: { value: 0.15 },
        uSmallWavesFrequency: { value: 3 },
        uSmallWavesSpeed: { value: 0.2 },
        uSmallWavesIterations: { value: 4 },

        uDepthColor: { value: new THREE.Color(debugObject.depthColor) },
        uSurfaceColor: { value: new THREE.Color(debugObject.surfaceColor) },

        uColorOffset: { value: 0.08 },
        uColorMultiplier: { value: 5 },
      },
    });

    // Debug
    gui
      .add(waterMaterial.uniforms.uBigWavesElevation, "value")
      .min(0)
      .max(1)
      .step(0.001)
      .name("uBigWavesElevation");

    gui
      .add(waterMaterial.uniforms.uBigWavesFrequency.value, "x")
      .min(0)
      .max(10)
      .step(0.001)
      .name("uBigWavesFrequency.x");

    gui
      .add(waterMaterial.uniforms.uBigWavesFrequency.value, "y")
      .min(0)
      .max(10)
      .step(0.001)
      .name("uBigWavesFrequency.y");

    gui
      .add(waterMaterial.uniforms.uBigWavesSpeed, "value")
      .min(0)
      .max(4)
      .step(0.001)
      .name("uBigWavesSpeed");

    gui
      .addColor(debugObject, "depthColor")
      .name("uDepthColor")
      .onChange(() => {
        waterMaterial.uniforms.uDepthColor.value.set(debugObject.depthColor);
      });

    gui
      .addColor(debugObject, "surfaceColor")
      .name("uSurfaceColor")
      .onChange(() => {
        waterMaterial.uniforms.uSurfaceColor.value.set(
          debugObject.surfaceColor
        );
      });

    gui
      .add(waterMaterial.uniforms.uColorOffset, "value")
      .min(0)
      .max(10)
      .step(0.001)
      .name("uColorOffset");

    gui
      .add(waterMaterial.uniforms.uColorMultiplier, "value")
      .min(0)
      .max(10)
      .step(0.001)
      .name("uColorMultiplier");

    //

    gui
      .add(waterMaterial.uniforms.uSmallWavesElevation, "value")
      .min(0)
      .max(10)
      .step(0.001)
      .name("uSmallWavesElevation");

    gui
      .add(waterMaterial.uniforms.uSmallWavesFrequency, "value")
      .min(0)
      .max(10)
      .step(0.1)
      .name("uSmallWavesFrequency");

    gui
      .add(waterMaterial.uniforms.uSmallWavesSpeed, "value")
      .min(0)
      .max(5)
      .step(0.001)
      .name("uSmallWavesSpeed");

    gui
      .add(waterMaterial.uniforms.uSmallWavesIterations, "value")
      .min(0)
      .max(10)
      .step(1)
      .name("uSmallWavesIterations");

    // Mesh
    const water = new THREE.Mesh(waterGeometry, waterMaterial);
    water.rotation.x = -Math.PI * 0.5;
    scene.add(water);

    /**
     * Camera
     */

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 1, 2);
    scene.add(camera);

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

    /**
     * Render Loop
     */

    const clock = new THREE.Clock();

    function tick() {
      controls.update();

      const elapsedTime = clock.getElapsedTime();

      waterMaterial.uniforms.uTime.value = elapsedTime;

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

export default Water;
