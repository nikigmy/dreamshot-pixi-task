import { Container, Sprite, Texture } from "pixi.js";
import { centerObjects, resizeSprite } from "../utils/misc";
import { GlobalConfig } from "../scenes/Game";
import { SpriteConfig } from "./SpriteConfig";

export type BgConfig = {
  layers: string[];
  spriteConfig: Partial<SpriteConfig>;
};

export default class CenteredBackground extends Container {
  name = "Background";
  
  sprites: Sprite [] = []

  constructor(
    protected config: BgConfig,
    protected globalConfig: GlobalConfig
  ) {
    super();

    this.init();

    centerObjects(this);
  }

  init() {
    for (const layer of this.config.layers) {
      const texture = Texture.from(layer);

      const sprite = new Sprite(texture);
      sprite.anchor.set(this.config.spriteConfig.anchor?.x, this.config.spriteConfig.anchor?.y);
      sprite.name = layer;

      resizeSprite(sprite, this.config.spriteConfig.scaling!, window.innerWidth, window.innerHeight, this.globalConfig);
      this.sprites.push(sprite);

      this.addChild(sprite);
    }
  }

  resize(width: number, height: number) {
    for (const layer of this.sprites) {
      resizeSprite(layer, this.config.spriteConfig.scaling!, width, height, this.globalConfig);
    }

    centerObjects(this);
  }
}
