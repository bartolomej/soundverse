import { mat4, quat, vec3 } from "gl-matrix";
import { Node } from "../Node";

type FirstPersonControlsOptions = {
  velocity?: vec3,
  friction?: number,
  acceleration?: number,
  maxSpeed?: number,
  mouseSensitivity?: number,
}

export default class FirstPersonControls {
  private node: Node;
  private readonly keys: { [key: string]: boolean };
  private velocity: vec3;
  private friction: number;
  private acceleration: number;
  private maxSpeed: number;
  private mouseSensitivity: number;
  private rotation: vec3 = [0,0,0]; // euler rotation vector with angles x,y,z

  constructor (node: Node, options: FirstPersonControlsOptions = {}) {
    this.node = node;

    this.velocity = options.velocity || vec3.create();
    this.friction = options.friction || 0.2;
    this.acceleration = options.acceleration || 20;
    this.maxSpeed = options.maxSpeed || 5;
    this.mouseSensitivity = options.mouseSensitivity || 0.01;

    this.mousemoveHandler = this.mousemoveHandler.bind(this);
    this.keydownHandler = this.keydownHandler.bind(this);
    this.keyupHandler = this.keyupHandler.bind(this);
    this.keys = {};
  }

  update (dt: number) {
    const { node, velocity, acceleration, friction, maxSpeed, rotation } = this;

    const forward = vec3.set(vec3.create(),
      -Math.sin(rotation[1]), 0, -Math.cos(rotation[1]));
    const right = vec3.set(vec3.create(),
      Math.cos(rotation[1]), 0, -Math.sin(rotation[1]));

    // 1: add movement acceleration
    let acc = vec3.create();
    if (this.keys['KeyW']) {
      vec3.add(acc, acc, forward);
    }
    if (this.keys['KeyS']) {
      vec3.sub(acc, acc, forward);
    }
    if (this.keys['KeyD']) {
      vec3.add(acc, acc, right);
    }
    if (this.keys['KeyA']) {
      vec3.sub(acc, acc, right);
    }

    // 2: update velocity
    vec3.scaleAndAdd(velocity, velocity, acc, dt * acceleration);

    // 3: if no movement, apply friction
    if (!this.keys['KeyW'] &&
      !this.keys['KeyS'] &&
      !this.keys['KeyD'] &&
      !this.keys['KeyA']) {
      vec3.scale(velocity, velocity, 1 - friction);
    }

    // 4: limit speed
    const len = vec3.len(velocity);
    if (len > maxSpeed) {
      vec3.scale(velocity, velocity, maxSpeed / len);
    }

    // 5: update translation
    vec3.scaleAndAdd(node.translation, node.translation, velocity, dt);

    // 6: update the final transform
    const t = node.matrix;
    mat4.identity(t);
    mat4.translate(t, t, node.translation);
    mat4.rotateY(t, t, node.rotation[1]);
    mat4.rotateX(t, t, node.rotation[0]);
    node.updateMatrix();
  }

  enable () {
    document.addEventListener('mousemove', this.mousemoveHandler);
    document.addEventListener('keydown', this.keydownHandler);
    document.addEventListener('keyup', this.keyupHandler);
  }

  disable () {
    document.removeEventListener('mousemove', this.mousemoveHandler);
    document.removeEventListener('keydown', this.keydownHandler);
    document.removeEventListener('keyup', this.keyupHandler);

    for (let key in this.keys) {
      this.keys[key] = false;
    }
  }

  private mousemoveHandler (e: MouseEvent) {
    const dx = e.movementX;
    const dy = e.movementY;
    const { node, rotation, mouseSensitivity } = this;

    rotation[0] -= dy * mouseSensitivity;
    rotation[1] -= dx * mouseSensitivity;

    const pi = Math.PI;
    const twopi = pi * 2;
    const halfpi = pi / 2;

    if (rotation[0] > halfpi) {
      rotation[0] = halfpi;
    }
    if (rotation[0] < -halfpi) {
      rotation[0] = -halfpi;
    }

    rotation[1] = ((rotation[1] % twopi) + twopi) % twopi;

    const [x,y,z] = rotation.map((x: number) => x * 180 / Math.PI);
    const q = quat.fromEuler(quat.create(), x, y, z);
    const v = vec3.clone(node.translation);
    const s = vec3.clone(node.scale);
    mat4.fromRotationTranslationScale(node.matrix, q, v, s);

    node.updateTransform();
  }

  private keydownHandler (e: KeyboardEvent) {
    this.keys[e.code] = true;
  }

  private keyupHandler (e: KeyboardEvent) {
    this.keys[e.code] = false;
  }

}
