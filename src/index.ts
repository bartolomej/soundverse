import "./style.css"
import Application from "./engine/Application";
import { Pane } from 'tweakpane';

// shaders
// @ts-ignore
import fragment from "./shaders/fragment.glsl";
// @ts-ignore
import vertex from "./shaders/vertex.glsl";
import { WebGLRenderer } from "./engine/renderers/WebGLRenderer";
import { Scene } from "./engine/Scene";
import { Node } from "./engine/Node";
import { GLTFLoader } from "./engine/loaders/GLTFLoader";

class App extends Application {

  private renderer: WebGLRenderer;
  private scene: Scene;
  private camera: Node;
  private loader: GLTFLoader;

  async start() {
    this.loader = new GLTFLoader();
    await this.loader.load('./models/cube/scene.gltf');

    this.scene = await this.loader.loadScene(this.loader.defaultScene) as Scene;
    this.camera = this.scene.getCameras()[0];

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
}

function main () {
  const canvas = document.querySelector('canvas');
  const app = new App(canvas);
  // const pane = new Pane();
}

document.addEventListener('DOMContentLoaded', main);
