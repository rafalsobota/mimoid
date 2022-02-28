import { useEffect, useRef } from "react";
import * as THREE from "three";
import dat from "dat.gui";
import * as CANNON from "cannon-es";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const Physics = () => {
  const canvas = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const destructors: (() => void)[] = [];
    let objectsToUpdate: { mesh: THREE.Mesh; body: CANNON.Body }[] = [];

    /**
     * Debug
     */
    const gui = new dat.GUI();
    destructors.push(() => gui.destroy());

    const debugObject = {
      createSphere: () => {
        createSphere(
          Math.random() * 0.5,
          new THREE.Vector3(
            (Math.random() - 0.5) * 3,
            3,
            (Math.random() - 0.5) * 3
          )
        );
      },
      createBox: () => {
        createBox(
          Math.random() * 0.5,
          Math.random() * 0.5,
          Math.random() * 0.5,
          new THREE.Vector3(
            (Math.random() - 0.5) * 3,
            3,
            (Math.random() - 0.5) * 3
          )
        );
      },
      reset: () => {
        console.log("reset");
        for (const object of objectsToUpdate) {
          object.body.removeEventListener("collide", playHitSound);
          world.removeBody(object.body);
          scene.remove(object.mesh);
        }
        objectsToUpdate = [];
      },
    };

    gui.add(debugObject, "createSphere");
    gui.add(debugObject, "createBox");
    gui.add(debugObject, "reset");

    /**
     * Base
     */

    // Scene
    const scene = new THREE.Scene();

    /**
     * Sounds
     */

    const hitSound = new Audio("/sounds/hit.mp3");

    const playHitSound = (collision: any) => {
      const impactStrength = collision.contact.getImpactVelocityAlongNormal();
      if (impactStrength > 1.5) {
        hitSound.volume = Math.random();
        hitSound.currentTime = 0;
        hitSound.play();
      }
    };

    /**
     * Textures
     */
    // const textureLoader = new THREE.TextureLoader();
    const cubeTextureLoader = new THREE.CubeTextureLoader();

    const environmentMapTexture = cubeTextureLoader.load([
      "/textures/environmentMaps/0/px.png",
      "/textures/environmentMaps/0/nx.png",
      "/textures/environmentMaps/0/py.png",
      "/textures/environmentMaps/0/ny.png",
      "/textures/environmentMaps/0/pz.png",
      "/textures/environmentMaps/0/nz.png",
    ]);

    /**
     * Physics
     */

    // World
    const world = new CANNON.World();
    world.gravity.set(0, -9.82, 0);
    world.broadphase = new CANNON.SAPBroadphase(world);
    world.allowSleep = true;

    // Materials
    // const concreteMaterial = new CANNON.Material("concrete");
    // const plasticMaterial = new CANNON.Material("plastic");

    // const concretePlasticContactMaterial = new CANNON.ContactMaterial(
    //   concreteMaterial,
    //   plasticMaterial,
    //   {
    //     friction: 0.1,
    //     restitution: 0.7,
    //   }
    // );

    const defaultMaterial = new CANNON.Material("default");

    const defaultContactMaterial = new CANNON.ContactMaterial(
      defaultMaterial,
      defaultMaterial,
      {
        friction: 0.1,
        restitution: 0.5,
      }
    );

    // world.addContactMaterial(concretePlasticContactMaterial);
    world.addContactMaterial(defaultContactMaterial);
    world.defaultContactMaterial = defaultContactMaterial;

    // Sphere
    // const sphereShape = new CANNON.Sphere(0.5);
    // const sphereBody = new CANNON.Body({
    //   shape: sphereShape,
    //   mass: 1,
    //   position: new CANNON.Vec3(0, 3, 0),
    //   // material: plasticMaterial,
    // });
    // sphereBody.applyLocalForce(
    //   new CANNON.Vec3(150, 0, 0),
    //   new CANNON.Vec3(0, 0, 0)
    // );
    // world.addBody(sphereBody);

    // Floor
    const floorShape = new CANNON.Plane();
    const floorBody = new CANNON.Body();
    floorBody.addShape(floorShape);
    floorBody.mass = 0;
    floorBody.quaternion.setFromAxisAngle(
      new CANNON.Vec3(-1, 0, 0),
      Math.PI * 0.5
    );
    // floorBody.material = concreteMaterial;
    world.addBody(floorBody);

    /**
     * Test sphere
     */
    // const sphere = new THREE.Mesh(
    //   new THREE.SphereGeometry(0.5, 32, 32),
    //   new THREE.MeshStandardMaterial({
    //     metalness: 0.3,
    //     roughness: 0.4,
    //     envMap: environmentMapTexture,
    //     envMapIntensity: 0.5,
    //   })
    // );
    // sphere.castShadow = true;
    // sphere.position.y = 0.5;
    // scene.add(sphere);

    /**
     * Floor
     */
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(10, 10),
      new THREE.MeshStandardMaterial({
        color: "#777777",
        metalness: 0.3,
        roughness: 0.4,
        envMap: environmentMapTexture,
        envMapIntensity: 0.5,
      })
    );
    floor.receiveShadow = true;
    floor.rotation.x = -Math.PI * 0.5;
    scene.add(floor);

    /**
     * Lights
     */
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.2);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.set(1024, 1024);
    directionalLight.shadow.camera.far = 15;
    directionalLight.shadow.camera.left = -7;
    directionalLight.shadow.camera.top = 7;
    directionalLight.shadow.camera.right = 7;
    directionalLight.shadow.camera.bottom = -7;
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    /**
     * Sizes
     */
    const sizes = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    const onResize = () => {
      // Update sizes
      sizes.width = window.innerWidth;
      sizes.height = window.innerHeight;

      // Update camera
      camera.aspect = sizes.width / sizes.height;
      camera.updateProjectionMatrix();

      // Update renderer
      renderer.setSize(sizes.width, sizes.height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };

    window.addEventListener("resize", onResize);
    destructors.push(() => window.removeEventListener("resize", onResize));

    /**
     * Camera
     */
    // Base camera
    const camera = new THREE.PerspectiveCamera(
      75,
      sizes.width / sizes.height,
      0.1,
      100
    );
    camera.position.set(-3, 3, 3);
    scene.add(camera);

    // Controls
    const controls = new OrbitControls(camera, canvas.current!);
    controls.enableDamping = true;

    /**
     * Renderer
     */
    const renderer = new THREE.WebGLRenderer({
      canvas: canvas.current!,
    });
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    /**
     * Utils
     */

    const sphereGeometry = new THREE.SphereGeometry(1, 20, 20);
    const sphereMaterial = new THREE.MeshStandardMaterial({
      metalness: 0.3,
      roughness: 0.4,
      envMap: environmentMapTexture,
    });

    const createSphere = (radius: number, position: THREE.Vector3) => {
      const mesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
      mesh.scale.set(radius, radius, radius);
      mesh.castShadow = true;
      mesh.position.copy(position);
      scene.add(mesh);

      // Physics
      const shape = new CANNON.Sphere(radius);
      const body = new CANNON.Body({
        mass: 1,
        shape,
        // material: defaultMaterial,
      });
      body.position.copy(position as any);
      body.addEventListener("collide", playHitSound);
      world.addBody(body);

      // Save in objects to update
      objectsToUpdate.push({
        mesh,
        body,
      });
    };

    createSphere(0.5, new THREE.Vector3(0, 3, 0));

    const boxGeometry = new THREE.BoxGeometry(1, 1, 1);

    const createBox = (
      width: number,
      height: number,
      depth: number,
      position: THREE.Vector3
    ) => {
      const mesh = new THREE.Mesh(boxGeometry, sphereMaterial);
      mesh.scale.set(width, height, depth);
      mesh.castShadow = true;
      mesh.position.copy(position);
      scene.add(mesh);

      // Physics
      const shape = new CANNON.Box(
        new CANNON.Vec3(width / 2, height / 2, depth / 2)
      );
      const body = new CANNON.Body({
        mass: 1,
        shape,
      });
      body.position.copy(position as any);
      body.addEventListener("collide", playHitSound);
      world.addBody(body);

      objectsToUpdate.push({
        mesh,
        body,
      });
    };

    /**
     * Animate
     */
    const clock = new THREE.Clock();
    let oldElapsedTime = 0;

    let tickHandle = 0;
    const tick = () => {
      const elapsedTime = clock.getElapsedTime();
      const deltaTime = elapsedTime - oldElapsedTime;
      oldElapsedTime = elapsedTime;

      // Update physics world
      // sphereBody.applyLocalForce(
      //   new CANNON.Vec3(-0.5, 0, 0),
      //   sphereBody.position
      // );

      world.step(1 / 60, deltaTime, 3);

      for (const { mesh, body } of objectsToUpdate) {
        mesh.position.copy(body.position as any);
        mesh.quaternion.copy(body.quaternion as any);
      }

      // sphere.position.copy(sphereBody.position as any);

      // Update controls
      controls.update();

      // Render
      renderer.render(scene, camera);

      // Call tick again on the next frame
      tickHandle = window.requestAnimationFrame(tick);
    };
    destructors.push(() => window.cancelAnimationFrame(tickHandle));

    tick();

    return () => {
      destructors.forEach((d) => d());
    };
  }, []);

  return (
    <>
      <canvas ref={canvas} className="webgl"></canvas>
    </>
  );
};

export default Physics;
