import { Node } from './Node.js';

type TraverseCb = (node: Node) => void;
type SceneOptions = {
    nodes?: Node[];
}

export class Scene {
    private readonly nodes: Node[];

    constructor(options: SceneOptions = {}) {
        this.nodes = [...(options.nodes || [])];
    }

    addNode(node: Node) {
        this.nodes.push(node);
    }

    traverse(before?: TraverseCb, after?: TraverseCb) {
        for (const node of this.nodes) {
            this.traverseNode(node, before, after);
        }
    }

    traverseNode(node: Node, before?: TraverseCb, after?: TraverseCb) {
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

    getNodesWithProperty(property: string) {
        const nodes: Node[] = [];
        this.traverse((node) => {
            if (node.hasOwnProperty(property)) {
                nodes.push(node);
            }
        });
        return nodes;
    }

    getCameraNodes() {
        return this.getNodesWithProperty("camera")
    }

    getLightNodes() {
        return this.getNodesWithProperty("light");
    }

    findNodes(regex: string) {
        const nodes: Node[] = [];
        this.traverse((node) => {
            if (new RegExp(regex).test(node.name)) {
                nodes.push(node);
            }
        });
        return nodes;
    }

    findNode(regex: string) {
        return this.findNodes(regex)[0];
    }

    clone() {
        return new Scene({
            ...this,
            nodes: this.nodes.map(node => node.clone()),
        });
    }
}
