import "./style.css"
import Application from "../engine/Application";
import { GUI } from 'dat.gui';

// shaders
// @ts-ignore
import fragment from "./shaders/curl.glsl";
import { WebGLRenderer } from "../engine/renderers/WebGLRenderer";
import { Scene } from "../engine/Scene";
import { Object3D } from "../engine/core/Object3D";
import { GLTFLoader } from "../engine/loaders/GLTFLoader";
import FirstPersonControls from "../engine/controls/FirstPersonControls";
import { PerspectiveCamera } from "../engine/cameras/PerspectiveCamera";
import ShaderMaterial from "../engine/materials/ShaderMaterial";
import PositionalAudio from "../engine/audio/PositionalAudio";
import {AudioListener} from "../engine/audio/AudioListener";

class App extends Application {

  private renderer: WebGLRenderer;
  private scene: Scene;
  public camera: Object3D;
  private loader: GLTFLoader;
  private controls: FirstPersonControls;
  private shaderMaterial: ShaderMaterial;
  private walls: Object3D[];
  private speaker: PositionalAudio;
  private fftSize: number = 32;

  async start() {
    this.loader = new GLTFLoader();
    await this.loader.load('./models/gallery/gallery.gltf');

    this.scene = await this.loader.loadScene(this.loader.defaultScene) as Scene;

    this.shaderMaterial = new ShaderMaterial({
      fragmentShader: fragment,
      uniforms: {
        time: 0,
        frequencies: new Array(this.fftSize).fill(0)
      }
    });
    this.walls = this.scene.findNodes("Wall.*");
    this.walls.forEach(wall => {
      wall.mesh.setMaterial(this.shaderMaterial);
    })

    this.camera = new Object3D({
      translation: [0,2,0],
      camera: new PerspectiveCamera()
    })
    this.controls = new FirstPersonControls(this.camera);

    const light = this.scene.findNode("Light")

    const listener = new AudioListener();
    this.camera.addChild(listener);

    this.speaker = new PositionalAudio(listener);
    light.addChild(this.speaker);
    this.speaker.setAudioUrl("https://cdns-preview-c.dzcdn.net/stream/c-cbde039fecdf23eaaf7c61db12a93f44-3.mp3");
    this.speaker.play();

    this.scene = await this.loader.loadScene(this.loader.defaultScene);

    this.renderer = new WebGLRenderer(this.gl, {clearColor: [1,1,1,1]});
    this.renderer.prepareScene(this.scene);
    this.resize();
  }

  update (dt: number, t: number) {
    this.controls?.update(dt);
    this.shaderMaterial?.setUniform("time", t);
    this.speaker?.update();
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
      if (this.camera.camera instanceof PerspectiveCamera) {
        this.camera.camera.aspect = aspectRatio;
      }
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
