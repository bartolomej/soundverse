import { Node } from './Node.js';

export class Scene {

    constructor(options = {}) {
        this.nodes = [...(options.nodes || [])];
    }

    addNode(node) {
        this.nodes.push(node);
    }

    traverse(before, after) {
        for (const node of this.nodes) {
            this.traverseNode(node, before, after);
        }
    }

    traverseNode(node, before, after) {
        if (before) {
            before(node);
        }
        for (const child of node.children) {
            this.traverseNode(child, before, after);
        }
        if (after) {
            after(node);
        }
    }

    getTotalLights() {
        let totalLights = 0;
        this.traverse((node) => {
            if (node.light) {
                totalLights++
            }
        });
        return totalLights;
    }

    getCameras() {
        const cameras = [];
        this.traverse((node) => {
            if (node.camera) {
                cameras.push(node);
            }
        });
        return cameras;
    }

    getLights() {
        const lights = [];
        this.traverse((node) => {
            if (node.light) {
                lights.push(node);
            }
        });
        return lights;
    }

    clone() {
        return new Scene({
            ...this,
            nodes: this.nodes.map(node => node.clone()),
        });
    }
}
