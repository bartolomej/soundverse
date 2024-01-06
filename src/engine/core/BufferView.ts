/**
 * A bufferView represents a "slice" of the data of one buffer. This slice is defined using an offset and a length, in bytes
 * See: https://github.com/KhronosGroup/glTF-Tutorials/blob/master/gltfTutorial/gltfTutorial_005_BuffersBufferViewsAccessors.md#bufferviews
 */
export class BufferView {
    buffer: ArrayBuffer;
    byteOffset: number;
    byteLength: number;
    byteStride: number;

    // TODO: Can we get rid of this, since it's only used in WebGLRenderer?
    target: number;

    constructor(options: Partial<BufferView>) {
        this.buffer = options.buffer || null;
        this.byteOffset = options.byteOffset || 0;
        this.byteLength = options.byteLength || 0;
        this.byteStride = options.byteStride !== undefined ? options.byteStride : null;
    }

}
