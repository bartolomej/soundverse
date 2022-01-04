import { Primitive } from "./Primitive";
import { Material } from "./materials/Material";

type MeshOptions = {
    primitives: Primitive[];
}

export class Mesh {
    private primitives: Primitive[];

    constructor(options: MeshOptions) {
        this.primitives = [...(options.primitives || [])];
    }

    setMaterial(material: Material) {
        this.primitives.forEach(primitive => {
            primitive.material = material;
        })
    }

}
