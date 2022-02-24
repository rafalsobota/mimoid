import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import VerifyEmail from "./VerifyEmail";
import Game from "./Game";
import Auth from "./Auth";
import Spaceship from "./Spaceship";
import Cube from "./examples/Cube";
import Animation from "./examples/Animation";
import Camera from "./examples/Camera";
import Fullscreen from "./examples/Fullscreen";
import Geometry from "./examples/Geometry";
import DebugUI from "./examples/DebugUI";
import Textures from "./examples/Textures";
import { Materials } from "./examples/Materials";
import { Fonts } from "./examples/Fonts";

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route
          path="spaceship"
          element={<Spaceship className="w-full h-full" />}
        />
        <Route path="examples/cube" element={<Cube />} />
        <Route path="examples/animation" element={<Animation />} />
        <Route path="examples/camera" element={<Camera />} />
        <Route path="examples/geometry" element={<Geometry />} />
        <Route path="examples/fullscreen" element={<Fullscreen />} />
        <Route path="examples/debug" element={<DebugUI />} />
        <Route path="examples/textures" element={<Textures />} />
        <Route path="examples/materials" element={<Materials />} />
        <Route path="examples/fonts" element={<Fonts />} />

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
