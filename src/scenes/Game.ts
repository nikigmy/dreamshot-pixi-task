import config from "../config";
import CenteredBackground from "../prefabs/CenteredBackground";
import { Container, Text, Graphics, FederatedPointerEvent } from "pixi.js";
import {
  centerObjects,
  generatePassword,
  getScreenScaling,
  wait,
} from "../utils/misc";
import Keyboard from "../core/Keyboard";
import { SceneUtils } from "../core/App";
import Door from "../prefabs/Door";
import Keypad from "../prefabs/Keypad";
import { SimplePoint } from "../prefabs/SimplePoint";
import Queue from "../prefabs/Queue";
import Sparcles from "../prefabs/Sparcles";

export type GlobalConfig = {
  minAspectRatio: number;
  referenceResolution: SimplePoint;
  gameTimeout: number;
};
export type PasswordConfig = {
  maxTurns: number;
  squences: number;
};

export default class Game extends Container {
  name = "Game";

  private keyboard = Keyboard.getInstance();
  private blockInput: boolean;

  private background!: CenteredBackground;
  private door!: Door;
  private sparcles!: Sparcles;
  private keypad!: Keypad;
  private password!: Queue<number>;

  constructor(protected utils: SceneUtils) {
    super();
    this.blockInput = false;
  }

  async load() {
    const bg = new Graphics()
      .beginFill(0x0b1354)
      .drawRect(0, 0, window.innerWidth, window.innerHeight);

    const text = new Text("Loading...", {
      fontFamily: "Verdana",
      fontSize: 50,
      fill: "white",
    });
    text.resolution = 2;
    this.addChild(bg, text);

    await this.utils.assetLoader.loadAssets();

    this.keyboard.onAction(({ action, buttonState }) => {
      if (buttonState === "pressed") this.onActionPress(action);
    });
  }

  async start() {
    this.removeChildren();
    this.password = generatePassword(config.password);

    this.background = new CenteredBackground(
      config.backgrounds.vault,
      config.global
    );
    this.door = new Door(config.door, config.global);
    this.door.on("pointerdown", (e) => this.handleDoorClick(e));

    this.keypad = new Keypad(config.keypad);
    this.sparcles = new Sparcles(config.sparcles, config.global);
    this.keypad.start();

    this.addChild(this.background, this.door, this.keypad, this.sparcles);

    this.onResize(window.innerWidth, window.innerHeight);
  }

  private handleDoorClick(e: FederatedPointerEvent): void {
    const localPos = e.getLocalPosition(this.door);
    if (localPos.x <= 0) {
      this.onActionPress("LEFT");
    } else {
      this.onActionPress("RIGHT");
    }
  }

  /**
   * Called on every ticker update
   * @param delta
   */
  update(delta: number) {
    this.keypad.update(delta);
  }

  /**
   * Called on resize of scene
   * @param width
   * @param height
   */
  onResize(width: number, height: number) {
    centerObjects(this);
    var screenScaling = getScreenScaling(width, height, config.global);
    this.scale.set(screenScaling, screenScaling);
  }

  public isGameComplete(): boolean {
    return this.password.isEmpty();
  }

  private onActionPress(action: keyof typeof Keyboard.actions) {
    if (this.blockInput) {
      return;
    }

    if (action === "LEFT") {
      this.checkInput(0);
    } else if (action === "RIGHT") {
      this.checkInput(1);
    }
  }

  private async checkInput(action: number) {
    this.blockInput = true;
    var nextPassword = this.password.dequeue();

    if (nextPassword === action) {
      await this.door.turn(nextPassword);
      this.checkForgameCompletion();
    } else {
      this.keypad.stop();
      this.keypad.setErrorText();
      await this.door.spinFuriously();
      this.resetGame(0);
    }
  }

  private async checkForgameCompletion() {
    if (this.isGameComplete()) {
      this.keypad.stop();
      await this.door.toggleDoor(true);
      this.sparcles.showEffect();
      this.resetGame();
    } else {
      this.blockInput = false;
    }
  }

  private async resetGame(time: number = config.global.gameTimeout) {
    this.password = generatePassword(config.password);
    await wait(time);
    this.keypad.reset();
    this.keypad.start();
    this.sparcles.stopEffect();
    await this.door.toggleDoor(false);
    this.blockInput = false;
  }
}
