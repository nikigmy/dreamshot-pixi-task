import { SimplePoint } from "./SimplePoint";

export type SpriteConfig = {
    name: string;
    scaling: number;
    anchor: SimplePoint;
    offset: SimplePoint;
}