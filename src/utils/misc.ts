import { DisplayObject, Sprite } from "pixi.js";
import { SpriteConfig } from "../prefabs/Door";
import { SimplePoint } from "../prefabs/SimplePoint";
import { GlobalConfig } from "../scenes/Game";

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


export function  resizeSprite(sprite: Sprite, scaling: number, width: number, height: number, globalConfig: GlobalConfig) {
    const screenScaling = getScreenScaling(width,  height, globalConfig);
    sprite.height = sprite.texture.height * scaling * screenScaling;
    sprite.width = sprite.texture.width * scaling * screenScaling;
}

export function getScreenScaling(width: number, height: number, globalConfig: GlobalConfig): number{
    const aspectRatio = width / height;

    if(aspectRatio < globalConfig.minAspectRatio)
    {
        height = width / globalConfig.minAspectRatio;
    }
    return height / globalConfig.referenceResolution.y;
}

export function  repositionSprite(sprite: Sprite, offsetX: number, offsetY: number) {
    const scalingRatio = sprite.height / sprite.texture.height;
    sprite.position.set(offsetX * scalingRatio, offsetY * scalingRatio)
}


export function processSpriteResize(sprite: Sprite, config: SpriteConfig, width: number, height: number, globalConfig: GlobalConfig) {
    resizeSprite(sprite, config.scaling, width, height, globalConfig);
    repositionSprite(sprite, config.offset.x, config.offset.y);
}

export function toNumber(value: string | number): number {
  if (typeof value === "number") {
    return value;
  }

  const num = Number(value);
  if (isNaN(num)) {
    throw new Error(`Cannot convert "${value}" to number`);
  }
  return num;
}