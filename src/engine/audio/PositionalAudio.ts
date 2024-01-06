import { Howl, Howler } from "howler";
import {Object3D} from "../core/Object3D";
import {AudioListener} from "./AudioListener";

export default class PositionalAudio extends Object3D {

  private audio: Howl | undefined;

  constructor(private readonly listener: AudioListener) {
    super();
  }

  setAudioUrl(url: string) {
    this.audio = new Howl({
      src: [url],
      preload: true,
    });
  }


  play () {
    this.audio.play();
  }

  pause () {
    this.audio.pause();
  }

  // TODO: Can we avoid having to call update manually (and let the library engine that instead)?
  // TODO: Fix positional audio if we need it
  update() {
    {
      const [x, y, z] = this.parent.translation;
      this.audio.pos(x, y, z);
    }

    {
      // Note that probably applies the listener position globally.
      const [x, y, z] = this.listener.translation;
      Howler.pos(x, y, z)
    }
  }

}
