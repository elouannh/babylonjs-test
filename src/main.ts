import { ArcRotateCamera } from "@babylonjs/core/Cameras/arcRotateCamera";
import { Engine } from "@babylonjs/core/Engines/engine";
import { HemisphericLight } from "@babylonjs/core/Lights/hemisphericLight";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { Scene } from "@babylonjs/core/scene";
import { STLFileLoader } from 'babylonjs-loaders';
import { SceneLoader} from "@babylonjs/core";
import shoe from "./rendering/shoe.ts";
import threeCubes from "./rendering/threeCubes.ts";

const canvas: HTMLElement | null = document.getElementById("renderCanvas");

// @ts-expect-error
const engine: Engine = new Engine(canvas);

const scene: Scene = new Scene(engine);
scene.clearColor = new BABYLON.Color4(0.8, 0.8, 0.8, 1); // Gris foncé

// @ts-expect-error
SceneLoader.RegisterPlugin(new STLFileLoader());

const camera: ArcRotateCamera = new ArcRotateCamera("camera1", 0, 0.8, 30, Vector3.Zero(), scene);
camera.setTarget(Vector3.Zero());
camera.attachControl(canvas, true);

const light: HemisphericLight = new HemisphericLight("light1", new Vector3(2, 10, 2), scene);
light.intensity = 1;

shoe(scene);
threeCubes(<BABYLON.Scene><unknown>scene);



engine.runRenderLoop((): void => scene.render());
window.addEventListener("resize", () => engine.resize());