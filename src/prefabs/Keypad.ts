import { gsap } from "gsap";
import { centerObjects, toNumber } from "../utils/misc";
import { SimplePoint } from "./SimplePoint";
import { Container, ITextStyle, Text } from "pixi.js";


export type KeypadConfig = {
    offset: SimplePoint;
    referenceScreenHeigh: number;
    errorText: string;
    blinkingDuration: number;
    anchor: SimplePoint;
    textStyle: Partial<ITextStyle>;
}

export  default class Keypad extends Container {
  private elapsed: number = 0; 
  private display: Text;
  private running: boolean = false;
  private blinkTimeline!: gsap.core.Timeline;
  temp!: number | string; 

  constructor(protected config: KeypadConfig) {
    super();
    this.display = new Text(this.formatTime(0), this.config.textStyle);
    this.display.anchor.set(this.config.anchor.x, this.config.anchor.y);
    this.resizeTimer(window.innerWidth, window.innerHeight);
    this.addChild(this.display);
    centerObjects(this);
  }
    resizeTimer(width:number, height: number) {
        const aspectRatio = width / height;

        if(aspectRatio < 1)
        {
            height = width / 1;
        }
        const scaleFactor = height / this.config.referenceScreenHeigh;
        this.display.position.set(this.config.offset.x * scaleFactor, this.config.offset.y * scaleFactor);
        this.display.style.fontSize = toNumber(this.config.textStyle.fontSize!) * scaleFactor;
    }

    private formatTime(ms: number): string {
        const totalSeconds = Math.floor(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        const secStr = seconds < 10 ? `0${seconds}` : `${seconds}`;
        return `${minutes}:${secStr}`;
    }

    public start() {
        if (!this.running) {
        this.running = true;
        }
    }

    public stop() {
        this.running = false;
        this.startBlinking();
    }

    public startBlinking(){
        this.blinkTimeline = gsap.timeline({defaults : { duration : 0.5}})
        .to(this.display, {alpha: 0, repeat: -1, yoyo: true})
    }
    public stopBlinking(){
        this.blinkTimeline.kill();
        gsap.to(this.display, {alpha: 1})
    }

    public setErrorText(){
        this.display.text = this.config.errorText;
    }

    public setCustomText(str: string){
        this.display.text = str;
    }

    public reset() {
        this.elapsed = 0;
        this.display.text = this.formatTime(0);
        this.stopBlinking();
    }

    public update(deltaMs: number) {
        if (!this.running) return;
        this.elapsed += deltaMs;
        this.display.text = this.formatTime(this.elapsed);
    }
    public resize(width: number, height: number) {
        centerObjects(this);
        this.resizeTimer(width, height);
    }
}