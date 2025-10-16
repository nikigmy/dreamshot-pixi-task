import { DisplayObject, Sprite } from "pixi.js";
import { GlobalConfig, PasswordConfig } from "../scenes/Game";
import Queue from "../prefabs/Queue";

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
export function centerObjectsToParent(...toCenter: DisplayObject[]) {
  const center = (obj: DisplayObject) => {
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

export function getScreenScaling(
  width: number,
  height: number,
  globalConfig: GlobalConfig
): number {
  const aspectRatio = width / height;

  if (aspectRatio < globalConfig.minAspectRatio) {
    height = width / globalConfig.minAspectRatio;
  }
  return height / globalConfig.referenceResolution.y;
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

export function generatePassword(config: PasswordConfig): Queue<number> {
  const queue = new Queue<number>();
  let passwordStr: string = "Password: ";
  for (let i = 0; i < config.squences; i++) {
    const randomNum = randomInt(1, config.maxTurns);
    const dir = randomInt(0, 1);
    passwordStr += randomNum;

    if (dir === 0) {
      passwordStr += "CCW ";
    } else {
      passwordStr += "CW ";
    }

    for (let i = 0; i < randomNum; i++) {
      queue.enqueue(dir);
    }
  }
  console.log(passwordStr);
  return queue;
}

export function randomInt(min: number, max: number): number {
  const lo = Math.ceil(min);
  const hi = Math.floor(max);
  return Math.floor(Math.random() * (hi - lo + 1)) + lo;
}

export function randomFloat(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}
