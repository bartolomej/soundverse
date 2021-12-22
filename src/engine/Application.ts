export default class Application {

  public readonly canvas: HTMLCanvasElement;
  public gl: WebGL2RenderingContext;

  constructor (canvas: HTMLCanvasElement, glOptions?: WebGLContextAttributes) {
    this._update = this._update.bind(this);

    this.canvas = canvas;
    this._initGL(glOptions);
    this.start();

    requestAnimationFrame(this._update);
  }

  _initGL (glOptions?: WebGLContextAttributes) {
    this.gl = null;
    try {
      this.gl = this.canvas.getContext('webgl2', glOptions);
    } catch (error) {
    }

    if (!this.gl) {
      throw new Error('Cannot create WebGL 2.0 context');
    }
  }

  _update (time: number) {
    this._resize();
    this.update();
    this.render(time);
    requestAnimationFrame(this._update);
  }

  _resize () {
    const { canvas, gl } = this;

    if (canvas.width !== canvas.clientWidth ||
      canvas.height !== canvas.clientHeight) {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;

      gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);

      this.resize();
    }
  }

  start () {
    // initialization code (including event handler binding)
  }

  update () {
    // update code (input, animations, AI ...)
  }

  render (time: number) {
    // render code (gl API calls)
  }

  resize () {
    // resize code (e.g. update projection matrix)
  }

}