import { Howl, Howler } from "howler";
import { vec3 } from "gl-matrix";
import { Track } from "./DeezerGateway";

/**
 * Music speaker in 3D space.
 */
export default class Speaker {

  private readonly position: vec3; // speaker position
  private tracks: Howl[];
  private currentIndex: number;
  private autoplay: boolean;
  private fadeDuration = 4000;
  private analyzer: AnalyserNode;

  constructor (position: vec3, autoplay = true) {
    this.position = position;
    this.autoplay = autoplay;
    this.tracks = [];
  }

  createAnalyzer() {
    this.analyzer = Howler.ctx.createAnalyser();
    Howler.masterGain.connect(this.analyzer);
    this.analyzer.connect(Howler.ctx.destination);
  }

  /**
   * Returns current frequency data.
   *
   * Each item in the array represents the decibel value for a specific frequency.
   * The frequencies are spread linearly from 0 to 1/2 of the sample rate.
   * For example, for 48000 sample rate, the last item of the array will represent the decibel value for 24000 Hz
   *
   * https://developer.mozilla.org/en-US/docs/Web/API/AnalyserNode/getByteFrequencyData
   */
  getFrequencyData(fftSize = 2048) {
    this.analyzer.fftSize = fftSize;
    const bufferLength = this.analyzer.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    this.analyzer.getByteFrequencyData(dataArray);
    return dataArray;
  }

  getCurrentTrack () {
    return this.tracks[this.currentIndex];
  }

  getNextTrack () {
    return this.tracks[this.currentIndex + 1];
  }

  prefetch() {
    this.tracks.forEach(track => track.load());
  }

  setPlaylist (list: Track[]) {
    this.tracks = list.map((track) => {
      const sound = new Howl({
        src: [track.preview],
        preload: false,
        onend: () => this.onTrackEnd(track),
        onplay: () => this.onTrackPlay(track),
        onload: () => console.log("Track loaded: ", track.title)
      });
      // set speaker position
      const [x, y, z] = this.position;
      sound.pos(x, y, z);
      return sound;
    });
    this.currentIndex = 0;
  }

  onTrackEnd (track: Track) {
    console.log("Track ended: ", track.title);
  }

  onTrackPlay (track: Track) {
    console.log("Track started: ", track.title);
    const currentTrack = this.getCurrentTrack();
    const endDuration = currentTrack.duration() - currentTrack.seek();
    setTimeout(this.onTrackFadeStart.bind(this),
      endDuration * 1000 - this.fadeDuration
    );
  }

  onTrackFadeStart() {
    console.log("Track fade started");
    this.playNext();
  }

  playNext() {
    const currentTrack = this.getCurrentTrack();
    currentTrack.fade(1, 0, this.fadeDuration)
    if (this.currentIndex < this.tracks.length - 1) {
      this.currentIndex++;
    } else {
      this.currentIndex = 0;
    }
    this.play();
  }

  playPrevious() {
    const currentTrack = this.getCurrentTrack();
    currentTrack.fade(1, 0, this.fadeDuration)
    if (this.currentIndex > 0) {
      this.currentIndex--;
    } else {
      this.currentIndex = this.tracks.length - 1;
    }
    this.play();
  }

  play () {
    if (!this.analyzer) {
      this.createAnalyzer();
    }
    const track = this.getCurrentTrack();
    const playTrack = (track: Howl) => {
      if (!track.playing()) {
        track?.play();
      }
      track?.fade(0, 1, this.fadeDuration)
    };
    if (track.state() === "unloaded") {
      track?.load();
    }
    if (track.state() === "loading") {
      // play on load, if track isn't loaded yet
      track?.on("load", () => playTrack(track))
    }
    if (track.state() === "loaded") {
      playTrack(track)
    }
    this.getNextTrack()?.load();
  }

  pause () {
    this.getCurrentTrack()?.pause();
  }

  setPlayerPosition (playerPosition: vec3) {
    const [x, y, z] = playerPosition;
    Howler.pos(x, y, z);
  }

}
