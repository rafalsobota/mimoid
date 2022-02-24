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

ReactDOM.render(
  <React.StrictMode>
    <Suspense fallback={<div>Loading...</div>}>
      <BrowserRouter>
        <Routes>
          <Route
            path="spaceship"
            element={<Spaceship className="w-full h-full" />}
          />
          <Route path="examples/cube" element={<CubeExample />} />
          <Route path="examples/animation" element={<AnimationExample />} />
          <Route path="examples/camera" element={<CameraExample />} />
          <Route path="examples/geometry" element={<GeometryExample />} />
          <Route path="examples/fullscreen" element={<FullscreenExample />} />
          <Route path="examples/debug" element={<DebugUIExample />} />
          <Route path="examples/textures" element={<TexturesExample />} />
          <Route path="examples/materials" element={<MaterialsExample />} />
          <Route path="examples/fonts" element={<FontsExample />} />

          <Route path="verify-email" element={<VerifyEmail />} />
          <Route
            path="*"
            element={
              <Auth>
                <Game />
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
