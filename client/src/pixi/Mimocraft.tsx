import * as PIXI from "pixi.js";
import React from "react";
import { useEffect } from "react";

const createNexus = (app: PIXI.Application) => {
  const tower = new PIXI.Graphics();

  let towerShape = new PIXI.Graphics();
  towerShape.beginFill(0xff0000);
  towerShape.drawRoundedRect(-50, -50, 100, 100, 10);
  // towerShape.rotation = Math.PI / 4;
  towerShape.interactive = true;
  towerShape.buttonMode = true;
  towerShape.on("pointerdown", (event) => {
    towerShape.scale.x -= 0.1;
    towerShape.scale.y -= 0.1;
  });
  towerShape.on("pointerover", (event) => {
    towerShape.alpha = 0.9;
  });
  towerShape.on("pointerout", (event) => {
    towerShape.alpha = 1;
  });

  tower.addChild(towerShape);

  let elapsed = 0.0;
  app.ticker.add((delta) => {
    // Update the text's y coordinate to scroll it
    elapsed += delta;
    tower.scale.y = 1 + (Math.cos(elapsed / 50.0) + 1) / 10;
    tower.scale.x = 1 + (Math.cos(elapsed / 50.0) + 1) / 10;
  });

  return tower;
};

const Mimocraft = () => {
  const canvasRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    let app = new PIXI.Application({
      autoDensity: true,
      antialias: true,
      backgroundAlpha: 0,
    });
    app.resizeTo = window;
    canvasRef.current!.appendChild(app.view);

    const tower = createNexus(app);
    tower.position.set(100, 100);
    app.stage.addChild(tower);

    const tower2 = createNexus(app);
    tower2.position.set(800, 800);
    app.stage.addChild(tower2);

    return () => {
      // canvasRef.current?.removeChild(app.view);
      app.destroy();
    };
  }, []);

  return <div ref={canvasRef}></div>;
};

export default Mimocraft;
