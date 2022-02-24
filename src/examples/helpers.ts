export const runRenderLoop = (tick: (time: number) => void): (() => void) => {
  let animationFrameHandle = 0;

  function render(time: number) {
    tick(time);
    animationFrameHandle = requestAnimationFrame(render);
  }

  animationFrameHandle = requestAnimationFrame(render);
  return () => cancelAnimationFrame(animationFrameHandle);
};

export const makeFullScreen = (camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer): (() => void) => {

  const updatePixelRation = () => {
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  };

  const updateSize = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
    updatePixelRation();
  };

  updateSize();

  window.addEventListener("resize", updateSize);

  return () => {
    window.removeEventListener("resize", updateSize);
  };
}