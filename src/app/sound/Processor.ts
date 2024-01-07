export default class AudioProcessor {

  static sampleFft (fftBuffer: ArrayLike<any>, targetSize: number, Buffer: any = Uint8Array, normaliseFactor = 1) {
    if (fftBuffer.length % targetSize !== 0) {
      throw new Error("Target size must be an exponent of 2");
    }
    const result = new Buffer(targetSize);
    const step = fftBuffer.length / targetSize;
    for (let i = 0; i < fftBuffer.length; i += step) {
      let sum = 0;
      for (let j = i; j < i + step; j++) {
        sum += fftBuffer[j];
      }
      result[i / step] = (sum / step) / normaliseFactor; // store average value for interval
    }
    return result;
  }

  static normalize (array: ArrayLike<any>, normaliseFactor = 1) {
    const result = new Float32Array(array.length);
    for (let i = 0; i < array.length; i++) {
      result[i] = array[i] / normaliseFactor;
    }
    return result;
  }

}
