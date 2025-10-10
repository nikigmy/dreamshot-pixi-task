import config from "../config";
import CenteredBackground from "../prefabs/CenteredBackground";
import { Container, Text, Graphics } from "pixi.js";
import { centerObjects } from "../utils/misc";
import Keyboard from "../core/Keyboard";
import { SceneUtils } from "../core/App";
import Door from "../prefabs/Door";
import { SimplePoint } from "../prefabs/SimplePoint";

export type GlobalConfig = {
  minAspectRatio: number,
  referenceResolution: SimplePoint
}

export default class Game extends Container {
  name = "Game";

  private keyboard = Keyboard.getInstance();
  private blockInput: boolean;

  private background!: CenteredBackground;
  private door!: Door;

  constructor(protected utils: SceneUtils) {
    super();
    this.blockInput = false;
  }

  async load() {

    // example use of Pixi Graphics
    const bg = new Graphics().beginFill(0x0b1354).drawRect(0, 0, window.innerWidth, window.innerHeight)

    // example use of Pixi Text
    const text = new Text("Loading...", {
      fontFamily: "Verdana",
      fontSize: 50,
      fill: "white",
    });
    text.resolution = 2;

    // example use of utils functions
    centerObjects(text);

    this.addChild(bg, text);

    await this.utils.assetLoader.loadAssets();

    this.keyboard.onAction(({ action, buttonState }) => {
      if (buttonState === "pressed") this.onActionPress(action);
    });
  }

  async start() {
    this.removeChildren();

    this.background = new CenteredBackground(config.backgrounds.vault, config.global);
    this.door = new Door(config.door, config.global);

    this.addChild(this.background, this.door);
  }

  /**
   * Called on every ticker update
   * @param delta 
   */
  update(delta: number) {
  }

  /**
   * Called on resize of scene
   * @param width 
   * @param height 
   */
  onResize(width: number, height: number) {
    // resize handling logic here
    this.background.resize(width, height);
    this.door.resize(width, height);
  }

  private onActionPress(action: keyof typeof Keyboard.actions) {
    if(this.blockInput){
      return;
    }

    if(action == "LEFT"){
      this.blockInput = true;
      this.door.turnLeft(() => this.blockInput = false);
    }
    else if(action == "RIGHT"){
      this.blockInput = true;
      this.door.turnRight(() => this.blockInput = false);
    }
    else if(action == "UP"){
      this.door.toggleDoor(false, () => {})
      // this.door.spinFuriously(() => {});
    }
    else{
      this.door.toggleDoor(true, () => {})
      // this.door.spinFuriously(() => {})
    }
  }
}
