import { DisplayObject, Sprite } from "pixi.js";
import { SpriteConfig } from "../prefabs/Door";

/** 
 * center objects to the middle of the window 
 */
export function centerObjects(...toCenter: DisplayObject[]) {
  const center = (obj: DisplayObject) => {
    obj.x = window.innerWidth / 2;
    obj.y = window.innerHeight / 2;

    if (obj instanceof Sprite) {
      obj.anchor.set(0.5);
    }
  };

  toCenter.forEach(center);
}

export function wait(seconds: number) {
  return new Promise<void>((res) => setTimeout(res, seconds * 1000));
}

export async function after(
  seconds: number,
  callback: (...args: unknown[]) => unknown
) {
  await wait(seconds);
  return callback();
}

export function getEntries<T extends object>(obj: T) {
  return Object.entries(obj) as Entries<T>;
}


export function  resizeSprite(sprite: Sprite, scaling: number, width: number, height: number, minAspectRatio: number) {
    const spriteAspectRatio = sprite.texture.width / sprite.texture.height;
    const aspectRatio = width / height;

    if(aspectRatio < minAspectRatio)
    {
        height = width / minAspectRatio;
    }

    sprite.height = height * scaling;
    sprite.width = sprite.height * spriteAspectRatio;
}

export function  repositionSprite(sprite: Sprite, offsetX: number, offsetY: number) {
    const scalingRatio = sprite.height / sprite.texture.height;
    sprite.position.set(offsetX * scalingRatio, offsetY * scalingRatio)
}


export function processSpriteResize(sprite: Sprite, config: SpriteConfig, width: number, height: number, minAspectRatio: number) {
    resizeSprite(sprite, config.scaling, width, height, minAspectRatio);
    repositionSprite(sprite, config.offset.x, config.offset.y);
}