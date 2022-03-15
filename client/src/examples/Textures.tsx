import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as dat from "dat.gui";
import gsap from "gsap";

const Textures = () => {
  const canvas = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const destructors: Array<() => void> = [];
    const gui = new dat.GUI();
    destructors.push(() => {
      gui.destroy();
    });

    const scene = new THREE.Scene();

    const axesHelper = new THREE.AxesHelper();
    axesHelper.visible = false;
    scene.add(axesHelper);

    const axesTweaks = gui.addFolder("AxesHelper");
    axesTweaks.add(axesHelper, "visible");
    axesTweaks.add(axesHelper.position, "x", -10, 10, 0.01);
    axesTweaks.add(axesHelper.position, "y", -10, 10, 0.01);
    axesTweaks.add(axesHelper.position, "z", -10, 10, 0.01);

    const loadingManager = new THREE.LoadingManager();
    loadingManager.onStart = (url, loaded, total) => {
      console.log(`Started loading file: ${url}`);
    };
    loadingManager.onLoad = () => {
      console.log("Finished loading");
    };
    loadingManager.onError = (e) => {
      console.log(e);
    };
    loadingManager.onProgress = (url, loaded, total) => {
      console.log(`${url} loaded ${loaded} of ${total}`);
    };
    const textureLoader = new THREE.TextureLoader(loadingManager);
    const colorTexture = textureLoader.load(
      "/textures/Door_Wood_001/Door_Wood_001_basecolor.jpg"
    );

    // colorTexture.repeat.x = 2;
    // colorTexture.repeat.y = 2;
    // colorTexture.wrapS = THREE.MirroredRepeatWrapping;
    // colorTexture.wrapT = THREE.RepeatWrapping;
    // colorTexture.offset.x = 0.5;
    // colorTexture.offset.y = 0.5;

    // colorTexture.center = new THREE.Vector2(0.5, 0.5);
    // colorTexture.rotation = Math.PI / 4;

    // colorTexture.generateMipmaps = false; // It's not nessesary with NearestFilter, takes 2x less space in GPU memory than mipmapped version
    // colorTexture.minFilter = THREE.NearestFilter; // Better performance than default LinearFilter
    // colorTexture.magFilter = THREE.NearestFilter;

    // Try TinyPNG.com website for better compression (-79%)

    // const alphaTexture = textureLoader.load(
    //   "/textures/Door_Wood_001/Door_Wood_001_opacity.jpg"
    // );
    // const heightTexture = textureLoader.load(
    //   "/textures/Door_Wood_001/Door_Wood_001_height.jpg"
    // );
    // const normalTexture = textureLoader.load(
    //   "/textures/Door_Wood_001/Door_Wood_001_normal.jpg"
    // );
    // const ambientOcclusionTexture = textureLoader.load(
    //   "/textures/Door_Wood_001/Door_Wood_001_ambientOcclusion.jpg"
    // );
    // const metalnessTexture = textureLoader.load(
    //   "/textures/Door_Wood_001/Door_Wood_001_metallic.jpg"
    // );
    // const roughnessTexture = textureLoader.load(
    //   "/textures/Door_Wood_001/Door_Wood_001_roughness.jpg"
    // );

    const geometry = new THREE.BoxGeometry(1, 1, 1);
    console.log(geometry.attributes);
    const material = new THREE.MeshBasicMaterial({ map: colorTexture });
    const mesh = new THREE.Mesh(geometry, material);
    const meshTweaks = gui.addFolder("Mesh");
    meshTweaks.add(mesh, "visible");
    meshTweaks.add(mesh.position, "y", -10, 10, 0.01);
    meshTweaks.add(mesh.position, "x", -10, 10, 0.01);
    meshTweaks.add(mesh.position, "z", -10, 10, 0.01);
    meshTweaks.add(mesh.material, "wireframe");
    const parameters = {
      color: mesh.material.color.getHex(),
      spin: () => {
        gsap.to(mesh.rotation, { y: mesh.rotation.y + 5 });
      },
    };
    meshTweaks.addColor(parameters, "color").onChange((value) => {
      mesh.material.color.setHex(value);
    });
    meshTweaks.add(parameters, "spin");

    scene.add(mesh);

    const sizes = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    const camera = new THREE.PerspectiveCamera(
      75,
      sizes.width / sizes.height,
      0.1,
      1000
    );

    camera.position.z = 3;

    scene.add(camera);

    const renderer = new THREE.WebGLRenderer({ canvas: canvas.current! });

    renderer.setSize(sizes.width, sizes.height);

    const updatePixelRatio = () => {
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };
    updatePixelRatio();

    let animationFrameHandle = 0;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    const resizeHanlder = () => {
      sizes.width = window.innerWidth;
      sizes.height = window.innerHeight;
      camera.aspect = sizes.width / sizes.height;
      camera.updateProjectionMatrix();
      renderer.setSize(sizes.width, sizes.height);
      updatePixelRatio();
    };

    window.addEventListener("resize", resizeHanlder);

    destructors.push(() => {
      window.removeEventListener("resize", resizeHanlder);
    });

    const doubleClickHadnler = () => {
      const c = canvas.current!;
      const fullscreenElement =
        document.fullscreenElement ||
        // @ts-ignore
        document.webkitFullscreenElement;

      if (!fullscreenElement) {
        if (c.requestFullscreen) {
          c.requestFullscreen();
          // @ts-ignore
        } else if (c.webkitRequestFullscreen) {
          // @ts-ignore
          c.webkitRequestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
          // @ts-ignore
        } else if (document.webkitExitFullscreen) {
          // @ts-ignore
          document.webkitExitFullscreen();
        }
      }
    };

    window.addEventListener("dblclick", doubleClickHadnler);

    destructors.push(() => {
      window.removeEventListener("dblclick", doubleClickHadnler);
    });

    const tick = () => {
      controls.update();

      renderer.render(scene, camera);
      animationFrameHandle = requestAnimationFrame(tick);
    };

    animationFrameHandle = requestAnimationFrame(tick);

    destructors.push(() => {
      cancelAnimationFrame(animationFrameHandle);
    });

    return () => {
      destructors.forEach((d) => d());
    };
  }, []);

  return <canvas ref={canvas}></canvas>;
};

export default Textures;
