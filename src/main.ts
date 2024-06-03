import { ArcRotateCamera } from "@babylonjs/core/Cameras/arcRotateCamera";
import { Engine } from "@babylonjs/core/Engines/engine";
import { HemisphericLight } from "@babylonjs/core/Lights/hemisphericLight";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { Scene } from "@babylonjs/core/scene";
import { STLFileLoader } from 'babylonjs-loaders';
import { FurMaterial } from "@babylonjs/materials/fur/furMaterial";
import {AbstractMesh, SceneLoader} from "@babylonjs/core";

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

const material: FurMaterial = new FurMaterial("grid", scene);
material.furColor = new BABYLON.Color3(0.8, 0.8, 0.8);
material.furOcclusion = 1;
material.furLength = 0;

const light: HemisphericLight = new HemisphericLight("light1", new Vector3(0, 10, 0), scene);
light.intensity = 1;

SceneLoader.Append(
  "./src/3d/",
  "woodland_shoe.stl",
  scene,
  (scene: Scene): void => {
    scene.meshes.forEach((mesh: AbstractMesh): void => {
      const thisName: string = "woodland_shoe_fur";

      mesh.updateFacetData();
      const firstFacet = mesh.getFacetPosition(10000);

      // @ts-ignore
      const plane = BABYLON.MeshBuilder.CreatePlane('plane', { size: 10 }, scene);
      plane.position = new BABYLON.Vector3(firstFacet.x, firstFacet.y, firstFacet.z); // Remplacez x, y, z par les coordonnées du facet


      if (mesh.name === "stlmesh") mesh.name = thisName;
      if (mesh.name !== thisName) return;

      mesh.position = new Vector3(0, 0, -3);
      mesh.scaling = new Vector3(0.1, 0.1, 0.1);

      mesh.material = material;
    });
  },
  null,
  (scene: Scene, message: string, exception: unknown): void => {
    console.error(message, exception, scene);
  },
);

const colors: number[][] = [
  [0.8, 0.8, 0.8],
  [0.6, 0.8, 0.8],
  [0.4, 0.8, 0.8],
  [0.2, 0.8, 0.8]
];
for (const [col, i] of <[number[], number][]>colors.map((e: number[], i: number) => [e, i + 1])) {
  (<HTMLElement>document.getElementById(`button${i}`)).addEventListener('mousedown', () => {
    scene.meshes.forEach((mesh: AbstractMesh): void => {
      if (!mesh.name.endsWith('fur')) return;

      material.furColor = new BABYLON.Color3(col[0], col[1], col[2]);
      mesh.material = material;
    });
  });
}

const inputSize: HTMLInputElement = (<HTMLInputElement>document.getElementById('sizeSelector'));
inputSize.addEventListener('change', (): void => {
  scene.meshes.forEach((mesh: AbstractMesh): void => {
    if (!mesh.name.endsWith('fur')) return;

    material.furLength = Number(inputSize.value);
    mesh.material = material;
  });
});

engine.runRenderLoop((): void => scene.render());
window.addEventListener("resize", () => engine.resize());