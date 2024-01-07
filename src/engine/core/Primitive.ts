import { Material } from '../materials/Material';
import {Accessor} from "./Accessor";

export type PrimitiveOptions = Partial<Primitive>;

// This naming convention originates from glTF.
// See: https://registry.khronos.org/glTF/specs/2.0/glTF-2.0.html#meshes
export type PrimitiveAttributeName =
    "POSITION" |
    "TEXCOORD_0" | // aka. "UVs"
    "NORMAL"

export class Primitive {
    attributes: Record<PrimitiveAttributeName, Accessor | null>;
    indices: Accessor;
    mode: number;
    material: Material;

    constructor(options: PrimitiveOptions = {}) {
        this.attributes = options.attributes ?? {
            POSITION: null,
            TEXCOORD_0: null,
            NORMAL: null
        };
        this.indices = options.indices ?? null;
        this.mode = options.mode !== undefined ? options.mode : 4;
        this.material = options.material ?? new Material({});
    }

    setAttribute(name: PrimitiveAttributeName, attribute: Accessor) {
        this.attributes[name] = attribute;
    }

}

export function isPrimitiveAttributeName(name: string): name is PrimitiveAttributeName {
    const validNamesLookup: Record<PrimitiveAttributeName, true> = {
        NORMAL: true,
        POSITION: true,
        TEXCOORD_0: true
    };
    return validNamesLookup[name as PrimitiveAttributeName] ?? false
}
