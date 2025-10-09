import { Container, Sprite, Texture } from "pixi.js";
import { centerObjects } from "../utils/misc";

export type BgConfig = {
  layers: string[];
  minAspectRatio: number;
};

export default class CenteredBackground extends Container {
  name = "Background";

  layers: string[] = [];
  sprites: Sprite [] = []

  constructor(
    protected config: BgConfig = {
      layers: [],
      minAspectRatio: 1
    }
  ) {
    super();

    this.init();

    centerObjects(this);
  }

  init() {
    for (const layer of this.config.layers) {
      const texture = Texture.from(layer);

      const sprite = new Sprite(texture);
      sprite.anchor.set(0.5);
      sprite.name = layer;

      this.resizeSprite(sprite, window.innerWidth, window.innerHeight);
      this.sprites.push(sprite);

      this.addChild(sprite);
    }
  }

  resizeSprite(sprite: Sprite, width: number, height: number){
    var aspectRatio = width / height;
    if(aspectRatio < this.config.minAspectRatio){
      height = width / this.config.minAspectRatio;
    }
      const scaleFactor = height / sprite.height;
      sprite.height = height;
      sprite.width = sprite.width * scaleFactor;
  }

  resize(width: number, height: number) {
    for (const layer of this.sprites) {
      this.resizeSprite(layer, width, height);
    }

    centerObjects(this);
  }
}
