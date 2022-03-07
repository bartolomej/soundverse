export type Artist = {
  id: number;
  name: string;
  link: string;
  picture: string;
  picture_small: string;
  picture_medium: string;
  picture_big: string;
  trackList: Track[];
}

export type Track = {
  id: number;
  title: string;
  title_short: string;
  link: string;
  duration: number; // in seconds
  preview: string; // short music preview file
}

export enum ArtistId {
  RUFUS_DU_SOL = 5571502,
  MAX_COOPER = 181041,
  BICEP = 369056
}

/**
 * Deezer API gateway.
 * https://developers.deezer.com/api
 */
export default class DeezerGateway {

  // predefined list of artists to chose from
  private readonly artistIds: number[] = [
    ArtistId.RUFUS_DU_SOL,
    ArtistId.MAX_COOPER,
    ArtistId.BICEP
  ];
  private artists: Artist[];

  async prefetch() {
    this.artists = await Promise.all(this.artistIds.map(id => this.fetchArtist(id)));
  }

  async fetchArtist(id: number) {
    const url = `https://soundverse.netlify.app/.netlify/functions/artist?id=${id}`;
    return fetch(url).then(res => res.json())
  }

  getRandomTrack() {
    const artistIndex = this.random(this.artists.length - 1);
    const artist = this.artists[artistIndex];
    const trackIndex = this.random(artist.trackList.length - 1);
    return artist.trackList[trackIndex];
  }

  getArtist(artistId: ArtistId) {
    return this.artists.find(artist => artist.id === artistId);
  }

  random(max: number) {
    return Math.round(Math.random() * max);
  }

}
