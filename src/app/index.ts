import "./style.css"
import Application from "../engine/Application";
import { GUI } from 'dat.gui';

// shaders
// @ts-ignore
import fragment from "./shaders/fragment.glsl";
import { WebGLRenderer } from "../engine/renderers/WebGLRenderer";
import { Scene } from "../engine/Scene";
import { Node } from "../engine/Node";
import { GLTFLoader } from "../engine/loaders/GLTFLoader";
import FirstPersonControls from "../engine/controls/FirstPersonControls";
import { PerspectiveCamera } from "../engine/cameras/PerspectiveCamera";
import ShaderMaterial from "../engine/materials/ShaderMaterial";
import Speaker from "./sound/Speaker";
import Music, { ArtistId } from "./sound/Music";
import AudioProcessor from "./sound/Processor";

class App extends Application {

  private renderer: WebGLRenderer;
  private scene: Scene;
  public camera: Node;
  public lights: Node[];
  private loader: GLTFLoader;
  private controls: FirstPersonControls;
  private shaderMaterial: ShaderMaterial;
  private walls: Node[];
  private speaker: Speaker;
  private music: Music;
  private fftSize: number = 32;

  async start() {
    this.loader = new GLTFLoader();
    await this.loader.load('./models/gallery/gallery.gltf');

    this.scene = await this.loader.loadScene(this.loader.defaultScene) as Scene;

    this.shaderMaterial = new ShaderMaterial({
      fragmentShader: fragment,
      uniforms: {
        time: 0,
        frequencies: new Array(4).fill(0)
      }
    });
    this.walls = this.scene.findNodes("Wall.*");
    this.walls.forEach(wall => {
      wall.mesh.setMaterial(this.shaderMaterial);
    })

    this.camera = new Node({
      translation: [0,2,0],
      camera: new PerspectiveCamera()
    })
    this.controls = new FirstPersonControls(this.camera);

    const light = this.scene.findNode("Light")
    this.music = new Music();
    await this.music.prefetch(); // download songs
    const artist = this.music.getArtist(ArtistId.MAX_COOPER);

    this.speaker = new Speaker(light.translation);
    this.speaker.setPlaylist(artist.trackList);
    this.speaker.play();

    this.scene = await this.loader.loadScene(this.loader.defaultScene) as Scene;

    this.renderer = new WebGLRenderer(this.gl, {clearColor: [1,1,1,1]});
    this.renderer.prepareScene(this.scene);
    this.resize();
  }

  update (dt: number, t: number) {
    this.controls?.update(dt);
    this.shaderMaterial?.setUniform("time", t);
    const fft = this.speaker?.getFrequencyData(this.fftSize);
    if (fft) {
      const sampledFft = AudioProcessor.sampleFft(fft, 4, Float32Array, 255);
      this.shaderMaterial?.setUniform("frequencies", sampledFft);
    }
    this.speaker?.setPlayerPosition(this.camera.translation);
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
