import { Material } from '../materials/Material';
import {Accessor} from "./Accessor";

export type PrimitiveOptions = Partial<Primitive>;

export class Primitive {
    attributes: Record<string, Accessor>;
    indices: Accessor;
    mode: number;
    material: Material;

    constructor(options?: PrimitiveOptions) {
        this.attributes = options?.attributes ?? {};
        this.indices = options.indices ?? null;
        this.mode = options.mode !== undefined ? options.mode : 4;
        this.material = options.material ?? new Material({});
    }

}
