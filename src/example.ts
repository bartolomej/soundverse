// @ts-ignore
import exampleShader from "./shader.glsl";

export function sayHello () {
  console.log("Example shader source code:")
  console.log(exampleShader)
}

export function sum (a: number, b: number) {
  return a + b;
}
