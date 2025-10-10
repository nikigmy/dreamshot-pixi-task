import config from "../config";
import CenteredBackground from "../prefabs/CenteredBackground";
import { Container, Text, Graphics } from "pixi.js";
import { generatePassword, wait } from "../utils/misc";
import Keyboard from "../core/Keyboard";
import { SceneUtils } from "../core/App";
import Door from "../prefabs/Door";
import Keypad from "../prefabs/Keypad";
import { SimplePoint } from "../prefabs/SimplePoint";
import Queue from "../prefabs/Queue";
import Sparcles from "../prefabs/Sparcles";

export type GlobalConfig = {
  minAspectRatio: number,
  referenceResolution: SimplePoint,
  gameTimeout: number;
}
export type PasswordConfig = {
  maxTurns: number,
  squences: number,
}

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

    // example use of Pixi Graphics
    const bg = new Graphics().beginFill(0x0b1354).drawRect(0, 0, window.innerWidth, window.innerHeight)

    // example use of Pixi Text
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

    this.background = new CenteredBackground(config.backgrounds.vault, config.global);
    this.door = new Door(config.door, config.global);
    this.keypad = new Keypad(config.keypad);
    this.sparcles = new Sparcles(config.sparcles, config.global);
    this.keypad.start();

    this.addChild(this.background, this.door, this.keypad, this.sparcles);
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
    // resize handling logic here
    this.background.resize(width, height);
    this.door.resize(width, height);
    this.keypad.resize(width, height);
    this.sparcles.resize(width, height);
  }

  public isGameComplete (): boolean{
    return this.password.isEmpty();
  }
  
  private onActionPress(action: keyof typeof Keyboard.actions) {
    if(this.blockInput){
      return;
    }

    if(action == "LEFT"){
      this.checkInput(0);
    }
    else if(action == "RIGHT"){      
      this.checkInput(1);
    }
  }

  private checkInput(action: number) {
    this.blockInput = true;
    var nextPassword = this.password.dequeue();

    if(nextPassword == action){
      if(nextPassword == 0){
        this.door.turnLeft().then(this.checkForgameCompletion.bind(this))
      }
      else{
        this.door.turnRight().then(this.checkForgameCompletion.bind(this));
      }
    }
    else{
      this.keypad.stop();
      this.keypad.setErrorText();
      this.door.spinFuriously().then(() => this.resetGame(0));
    }
  }
  private checkForgameCompletion() {
    if(this.isGameComplete()){
      this.keypad.stop();
      this.door.toggleDoor(true).then(() => {
          this.sparcles.showEffect();
          this.resetGame();
      });
    }
    else{
      this.blockInput = false
    }
  }

  private resetGame(time: number = config.global.gameTimeout){
    this.password = generatePassword(config.password);
    wait(time).then(() => {
      this.keypad.reset();
      this.keypad.start();
      this.sparcles.stopEffect();
      this.door.toggleDoor(false).then(() => {this.blockInput = false;});
    });
  }
}
