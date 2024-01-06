import { Primitive } from "./Primitive";
import { Material } from "../materials/Material";

export type MeshOptions = Partial<Mesh>;

export class Mesh {
    primitives: Primitive[];

    constructor(options?: MeshOptions) {
        this.primitives = options.primitives ?? [];
    }

    setMaterial(material: Material) {
        this.primitives.forEach(primitive => {
            primitive.material = material;
        })
    }

}
