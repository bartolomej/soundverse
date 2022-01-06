import AudioProcessor from "./Processor";

describe("sound module tests", function () {

  const fftBuffer = new Uint8Array([
    1, 2, 3, 4, 5, 6, 7, 8
  ]);

  it('should sample Uint8 audio data', function () {
    const result = AudioProcessor.sampleFft(fftBuffer, 2, Uint8Array, 1);
    expect(result).toEqual(new Uint8Array([2, 6]))
  });

  it('should sample Float32 audio data', function () {
    const result = AudioProcessor.sampleFft(fftBuffer, 2, Float32Array, 1);
    expect(result).toEqual(new Float32Array([2.5, 6.5]))
  });

  it('should sample and normalize audio data', function () {
    const result = AudioProcessor.sampleFft(fftBuffer, 2, Float32Array, 255);
    expect(result).toEqual(new Float32Array([2.5 / 255, 6.5 / 255]))
  });
})
