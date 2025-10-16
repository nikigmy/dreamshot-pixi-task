import { Container, Sprite, Texture } from "pixi.js";
import { GlobalConfig } from "../scenes/Game";
import { SpriteConfig } from "./SpriteConfig";

export type BgConfig = {
  layers: string[];
  spriteConfig: Partial<SpriteConfig>;
};

export default class CenteredBackground extends Container {
  name = "Background";

  sprites: Sprite[] = [];

  constructor(
    protected config: BgConfig,
    protected globalConfig: GlobalConfig
  ) {
    super();

    this.init();
    this.scale.set(config.spriteConfig.scaling);
  }

  init() {
    for (const layer of this.config.layers) {
      const texture = Texture.from(layer);

      const sprite = new Sprite(texture);
      sprite.anchor.set(
        this.config.spriteConfig.anchor?.x,
        this.config.spriteConfig.anchor?.y
      );
      sprite.name = layer;

      this.sprites.push(sprite);

      this.addChild(sprite);
    }
  }
}
