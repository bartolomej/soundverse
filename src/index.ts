import "./style.css"
import Application from "./engine/Application";
import * as dat from 'dat.gui';

// shaders
// @ts-ignore
import fragment from "./shaders/fragment.glsl";
// @ts-ignore
import vertex from "./shaders/vertex.glsl";
import { WebGLRenderer } from "./engine/renderers/WebGLRenderer";
import { Scene } from "./engine/Scene";
import { Node } from "./engine/Node";
import { GLTFLoader } from "./engine/loaders/GLTFLoader";
import FirstPersonControls from "./engine/controls/FirstPersonControls";
import { GUI } from "dat.gui";
import { PerspectiveCamera } from "./engine/cameras/PerspectiveCamera";

class App extends Application {

  private renderer: WebGLRenderer;
  private scene: Scene;
  public camera: Node;
  public lights: Node[];
  private loader: GLTFLoader;
  private controls: FirstPersonControls;

  async start() {
    this.loader = new GLTFLoader();
    await this.loader.load('./models/room/room.gltf');

    this.scene = await this.loader.loadScene(this.loader.defaultScene) as Scene;

    // TODO: fix weird camera projection effect when rotated in y direction
    this.camera = new Node({
      translation: [0,2,0],
      camera: new PerspectiveCamera()
    })
    this.controls = new FirstPersonControls(this.camera);

    this.scene = await this.loader.loadScene(this.loader.defaultScene) as Scene;

    if (!this.scene || !this.camera) {
      throw new Error('Scene or Camera not present in glTF');
    }

    if (!this.camera.camera) {
      throw new Error('Camera node does not contain a camera reference');
    }

    this.renderer = new WebGLRenderer(this.gl);
    this.renderer.prepareScene(this.scene);
    this.resize();
  }

  update (dt: number) {
    this.controls?.update(dt);
  }

  render() {
    if (this.renderer) {
      this.renderer.render(this.scene, this.camera);
    }
  }

  resize() {
    const w = this.canvas.clientWidth;
    const h = this.canvas.clientHeight;
    const aspectRatio = w / h;

    if (this.camera) {
      this.camera.camera.aspect = aspectRatio;
      this.camera.camera.updateMatrix();
    }
  }

  enableCamera() {
    this.canvas.requestPointerLock();
    document.addEventListener('pointerlockchange', () => {
      if (document.pointerLockElement === this.canvas) {
        this.controls.enable();
      } else {
        this.controls.disable();
      }
    })
  }

}

function main () {
  const canvas = document.querySelector('canvas');
  const app = new App(canvas);
  const gui = new GUI();
  gui.add(app, 'enableCamera');
  // @ts-ignore
  window.app = app;
}

document.addEventListener('DOMContentLoaded', main);
