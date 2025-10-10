import { Container, IDestroyOptions, Sprite, Texture } from "pixi.js";
import { centerObjects, processSpriteResize, repositionSprite, resizeSprite } from "../utils/misc";
import gsap from "gsap";
import { GlobalConfig } from "../scenes/Game";
import { SpriteConfig } from "./SpriteConfig";


export type DoorConfig = {
    closed: SpriteConfig;
    handle: SpriteConfig;
    handleShadow: SpriteConfig;
    open: SpriteConfig;
    openShadow: SpriteConfig;
    handleSpinDiration: number;
    handleSpinDegrees: number;
    openDuration: number;
    spinRepeats: number;
};

export default class Door extends Container {
  name = "Door";

    private config: DoorConfig;
    private closedSprite: Sprite;
    private handleSprite: Sprite;
    private handleShadowSprite!: Sprite;
    private openSprite: Sprite;
    private openShadow: Sprite;
    private globalConfig: GlobalConfig;

    constructor(config: DoorConfig, globalConfig: GlobalConfig) {
        super();
        centerObjects(this);
        this.config = config;
        this.globalConfig = globalConfig;

        this.closedSprite = this.loadSprite(this.config.closed, 1);
        this.handleShadowSprite = this.loadSprite(this.config.handleShadow, 1);
        this.handleSprite = this.loadSprite(this.config.handle, 1);

        this.openShadow = this.loadSprite(this.config.openShadow, 0);
        this.openSprite = this.loadSprite(this.config.open, 0);
    }

    private loadSprite(config: SpriteConfig, alpha: number): Sprite{
        const texture = Texture.from(config.name);
        const sprite = new Sprite(texture);
        sprite.anchor.set(config.anchor.x, config.anchor.y);
        sprite.name = config.name;
        sprite.alpha = alpha;
        this.addChild(sprite);
        resizeSprite(sprite, config.scaling, window.innerWidth, window.innerHeight, this.globalConfig);
        repositionSprite(sprite, config.offset.x, config.offset.y);
        return sprite;
    }

    public turnLeft(){
        return this.turnHandle(this.config.handleSpinDegrees);
    }

    public turnRight(){
        return this.turnHandle(-this.config.handleSpinDegrees);
    }

    private turnHandle(degrees: number){
        const timeline = gsap.timeline({defaults : { duration : this.config.handleSpinDiration}});
        timeline.to(this.handleSprite,       {  angle: `-=${degrees}`});
        timeline.to(this.handleShadowSprite, {  angle: `-=${degrees}`}, "<");

        return new Promise<void>((res) => timeline.eventCallback('onComplete', res));
    }

    public spinFuriously(){
        const timeline = gsap.timeline()
        const spin = gsap.timeline({defaults : { duration : this.config.handleSpinDiration, repeat: this.config.spinRepeats}})
        .to(this.handleSprite,       {  angle: '+=360', ease: 'none'})
        .to(this.handleShadowSprite, {  angle: '+=360', ease: 'none'}, "<");

        timeline.add(spin)
        .to(this.handleSprite,       {  angle: 0, ease: 'none'})
        .to(this.handleShadowSprite, {  angle: 0, ease: 'none'}, "<");

        return new Promise<void>((res) => timeline.eventCallback('onComplete', res));
    }

    public toggleDoor(open: boolean){
        const openObjectsAlpha = open ? 1 : 0;
        const closedObjectsAlpha = open ? 0 : 1;
        
        const timeline = gsap.timeline({defaults : { duration : this.config.openDuration}});

        timeline.to(this.handleSprite,       {alpha: closedObjectsAlpha})
        timeline.to(this.handleShadowSprite, {alpha: closedObjectsAlpha}, "<")
        timeline.to(this.closedSprite,       {alpha: closedObjectsAlpha}, "<")
        timeline.to(this.openSprite,         {alpha: openObjectsAlpha},   "<")
        timeline.to(this.openShadow,         {alpha: openObjectsAlpha},   "<")

        return new Promise<void>((res) => timeline.eventCallback('onComplete', res));
    }

    public resize(width: number, height: number) {
        processSpriteResize(this.closedSprite, this.config.closed, width, height, this.globalConfig);
        processSpriteResize(this.handleSprite, this.config.handle, width, height, this.globalConfig);
        processSpriteResize(this.handleShadowSprite, this.config.handleShadow, width, height, this.globalConfig);
        processSpriteResize(this.openSprite, this.config.open, width, height, this.globalConfig);
        processSpriteResize(this.openShadow, this.config.openShadow, width, height, this.globalConfig);

        centerObjects(this);
    }

    public destroy(options?: IDestroyOptions | boolean): void {
        gsap.killTweensOf([this.closedSprite, this.handleSprite, this.handleShadowSprite, this.openSprite, this.openShadow]);
        super.destroy(options);
    }
}

