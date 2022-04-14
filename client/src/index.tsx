import React, { Suspense } from "react";
import ReactDOM from "react-dom";
import "./index.css";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import VerifyEmail from "./VerifyEmail";
import Game from "./Game";
import Auth from "./Auth";
import Spaceship from "./Spaceship";

const CubeExample = React.lazy(() => import("./examples/Cube"));
const AnimationExample = React.lazy(() => import("./examples/Animation"));
const CameraExample = React.lazy(() => import("./examples/Camera"));
const FullscreenExample = React.lazy(() => import("./examples/Fullscreen"));
const GeometryExample = React.lazy(() => import("./examples/Geometry"));
const DebugUIExample = React.lazy(() => import("./examples/DebugUI"));
const TexturesExample = React.lazy(() => import("./examples/Textures"));
const MaterialsExample = React.lazy(() => import("./examples/Materials"));
const FontsExample = React.lazy(() => import("./examples/Fonts"));
const LightsExample = React.lazy(() => import("./examples/Lights"));
const ShadowsExample = React.lazy(() => import("./examples/Shadows"));
const HauntedHouseExample = React.lazy(() => import("./examples/HauntedHouse"));
const ParticlesExample = React.lazy(() => import("./examples/Particles"));
const GalaxyGeneratorExample = React.lazy(
  () => import("./examples/GalaxyGenerator")
);
const RaycasterExample = React.lazy(() => import("./examples/Raycaster"));
const ScrollExample = React.lazy(() => import("./examples/Scroll"));
const PhysicsExample = React.lazy(() => import("./examples/Physics"));
const ImportedModelsExample = React.lazy(
  () => import("./examples/ImportedModels")
);
const HamburgerExample = React.lazy(() => import("./examples/Hamburger"));
const ShadersExample = React.lazy(() => import("./examples/Shaders"));
const Shaders2Example = React.lazy(() => import("./examples/Shaders2"));
const WaterExample = React.lazy(() => import("./examples/Water"));

const LazyShip = React.lazy(() => import("./scenes/Ship"));
const LazyBenchmark = React.lazy(() => import("./scenes/Benchmark"));
const LazyEcsy = React.lazy(() => import("./scenes/Ecsy"));
const LazyMimocraft = React.lazy(() => import("./pixi/Mimocraft"));

ReactDOM.render(
  <React.StrictMode>
    <Suspense fallback={<div className="p-2">Loading...</div>}>
      <BrowserRouter>
        <Routes>
          <Route
            path="spaceship"
            element={<Spaceship className="w-full h-full" />}
          />
          <Route path="mimocraft" element={<LazyMimocraft />} />
          <Route path="ecsy" element={<LazyEcsy />} />
          <Route path="benchmark" element={<LazyBenchmark />} />
          <Route path="examples/cube" element={<CubeExample />} />
          <Route path="examples/animation" element={<AnimationExample />} />
          <Route path="examples/camera" element={<CameraExample />} />
          <Route path="examples/geometry" element={<GeometryExample />} />
          <Route path="examples/fullscreen" element={<FullscreenExample />} />
          <Route path="examples/debug" element={<DebugUIExample />} />
          <Route path="examples/textures" element={<TexturesExample />} />
          <Route path="examples/materials" element={<MaterialsExample />} />
          <Route path="examples/fonts" element={<FontsExample />} />
          <Route path="examples/lights" element={<LightsExample />} />
          <Route path="examples/shadows" element={<ShadowsExample />} />
          <Route
            path="examples/haunted-house"
            element={<HauntedHouseExample />}
          />
          <Route path="examples/particles" element={<ParticlesExample />} />
          <Route
            path="examples/galaxy-generator"
            element={<GalaxyGeneratorExample />}
          />
          <Route path="examples/raycaster" element={<RaycasterExample />} />
          <Route path="examples/scroll" element={<ScrollExample />} />
          <Route path="examples/physics" element={<PhysicsExample />} />
          <Route
            path="examples/imported-models"
            element={<ImportedModelsExample />}
          />
          <Route path="examples/hamburger" element={<HamburgerExample />} />
          <Route path="examples/shaders" element={<ShadersExample />} />
          <Route path="examples/shaders2" element={<Shaders2Example />} />
          <Route path="examples/water" element={<WaterExample />} />

          <Route path="verify-email" element={<VerifyEmail />} />
          <Route
            path="auth"
            element={
              <Auth>
                <Game />
              </Auth>
            }
          />
          <Route
            path="*"
            element={
              <Auth>
                <LazyShip />
              </Auth>
            }
          />
        </Routes>
      </BrowserRouter>
    </Suspense>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.unregister();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
