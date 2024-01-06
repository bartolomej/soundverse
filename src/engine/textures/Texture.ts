import { TextureSampler } from './TextureSampler';

export type TextureOptions = Partial<Texture>;

export class Texture {
    image: HTMLImageElement | null;
    sampler: TextureSampler;
    hasMipmaps: boolean;

    constructor(options: TextureOptions) {
        this.image = options.image ?? null;
        this.sampler = options.sampler ?? new TextureSampler();
        this.hasMipmaps = options.hasMipmaps ?? false;
    }

}
