import "./style.css"
import Application from "./engine/Application";
import { Pane } from 'tweakpane';

// shaders
// @ts-ignore
import fragment from "./shaders/fragment.glsl";
// @ts-ignore
import vertex from "./shaders/vertex.glsl";
import { WebGL, WebGLBuiltPrograms } from "./engine/WebGL";

class App extends Application {

  private programs: WebGLBuiltPrograms;
  private buffers: Record<string, WebGLBuffer>;
  private mousePosition: number[];

  start () {
    const { gl } = this;
    this.buffers = {};
    this.mousePosition = [];
    this.programs = WebGL.buildPrograms(gl, {
      first: {
        vertex,
        fragment
      }
    });

    // Create a buffer to put three 2d clip space points in
    this.buffers.positionBuffer = gl.createBuffer();

    // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.positionBuffer);

    // fill it with a 2 triangles that cover clip-space
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      -1, -1,  // first triangle
      1, -1,
      -1, 1,
      -1, 1,  // second triangle
      1, -1,
      1, 1,
    ]), gl.STATIC_DRAW);

    // add mouse listeners
    const {canvas} = this;

    const setMousePosition = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = rect.height - (e.clientY - rect.top) - 1;  // bottom is 0 in WebGL
      this.mousePosition = [mouseX, mouseY];
    }

    canvas.addEventListener('mousemove', setMousePosition);
  }

  update () {

  }

  render (time: number) {
    const { gl } = this;
    const {
      first: {
        program,
        uniforms,
        attributes
      }
    } = this.programs;

    const {
      resolution: resolutionLocation,
      mouse: mouseLocation,
      time: timeLocation
    } = uniforms;

    const {
      positionBuffer
    } = this.buffers;

    const {
      a_position: positionAttributeLocation
    } = attributes;

    // Tell it to use our program (pair of shaders)
    gl.useProgram(program);

    // Turn on the attribute
    gl.enableVertexAttribArray(positionAttributeLocation);

    // Bind the position buffer.
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
    gl.vertexAttribPointer(
      positionAttributeLocation,
      2,          // 2 components per iteration
      gl.FLOAT,   // the data is 32bit floats
      false,      // don't normalize the data
      0,          // 0 = move forward size * sizeof(type) each iteration to get the next position
      0,          // start at the beginning of the buffer
    );

    const {mousePosition: [mouseX, mouseY]} = this;
    gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height);
    gl.uniform2f(mouseLocation, mouseX, mouseY);
    gl.uniform1f(timeLocation, time);

    gl.drawArrays(
      gl.TRIANGLES,
      0,     // offset
      6,     // num vertices to process
    );
  }
}

function main () {
  const canvas = document.querySelector('canvas');
  const app = new App(canvas);
  // const pane = new Pane();
}

document.addEventListener('DOMContentLoaded', main);
