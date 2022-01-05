import { Howl, Howler } from "howler";
import { vec3 } from "gl-matrix";
import { Track } from "./Music";

/**
 * Music speaker in 3D space.
 */
export default class Speaker {

  private readonly position: vec3; // speaker position
  private playlist: Howl[];
  private currentIndex: number;
  private autoplay: boolean;
  private fadeDuration = 2000;

  constructor (position: vec3, autoplay = true) {
    this.position = position;
    this.autoplay = autoplay;
    this.playlist = [];
  }

  getCurrentTrack () {
    return this.playlist[this.currentIndex];
  }

  setPlaylist (list: Track[]) {
    this.playlist = list.map((track) => {
      const sound = new Howl({
        src: [track.preview],
        preload: false,
        onend: () => this.onTrackEnd(track),
        onplay: () => this.onTrackPlay(track),
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
    if (this.currentIndex <= this.playlist.length - 1) {
      this.currentIndex++;
    } else {
      this.currentIndex = 0;
    }
    if (this.autoplay) {
      this.play();
    }
  }

  onTrackPlay (track: Track) {
    console.log("Track started: ", track.title);
    const currentTrack = this.getCurrentTrack();
    const endDuration = currentTrack.duration() - currentTrack.seek();
    setTimeout(() => {
        currentTrack.fade(1, 0, this.fadeDuration)
      },
      endDuration * 1000 - this.fadeDuration
    );
  }

  play () {
    const track = this.getCurrentTrack();
    track?.load();
    // play on load, if track isn't loaded yet
    track?.on("load", () => {
      track?.play();
      track?.fade(0, 1, this.fadeDuration)
    })
  }

  pause () {
    this.getCurrentTrack()?.pause();
  }

  setPlayerPosition (playerPosition: vec3) {
    const [x, y, z] = playerPosition;
    Howler.pos(x, y, z);
  }

}
