import { Container, FederatedPointerEvent, IDestroyOptions, Sprite, Texture } from "pixi.js";
import { centerObjects, processSpriteResize } from "../utils/misc";
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

    private closedSprite: Sprite;
    private handleSprite: Sprite;
    private handleShadowSprite!: Sprite;
    private openSprite: Sprite;
    private openShadow: Sprite;

    constructor(protected config: DoorConfig, protected globalConfig: GlobalConfig) {
        super();
        centerObjects(this);

        this.closedSprite = this.loadSprite(this.config.closed, 1);
        this.closedSprite.eventMode = 'static';
        this.closedSprite.cursor = "pointer";
        this.closedSprite.on('pointerdown', this.handleClick.bind(this));
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
        processSpriteResize(sprite, config, window.innerWidth, window.innerHeight, this.globalConfig);
        return sprite;
    }

    private handleClick(event: FederatedPointerEvent) {
        const localPos = event.data.getLocalPosition(this);

        (this as any).emit("doorClicked", localPos);
    }
    
    public async turn(direction: number){
        var degrees = this.config.handleSpinDegrees;
        if(direction === 1){
            degrees *= -1;
        }
        await this.turnHandle(degrees);
    }

    public async turnLeft(){
        await this.turnHandle(this.config.handleSpinDegrees);
    }

    public async turnRight(){
        await this.turnHandle(-this.config.handleSpinDegrees);
    }

    private async turnHandle(degrees: number){
        const timeline = gsap.timeline({defaults : { duration : this.config.handleSpinDiration}});
        timeline.to([this.handleSprite, this.handleShadowSprite],       {  angle: `-=${degrees}`});

        await timeline;
    }

    public async spinFuriously(){
        const timeline = gsap.timeline()
        const spin = gsap.timeline({defaults : { duration : this.config.handleSpinDiration, repeat: this.config.spinRepeats}})
        .to([this.handleSprite, this.handleShadowSprite],       {  angle: '+=360', ease: 'none'})

        timeline.add(spin)
        .to([this.handleSprite, this.handleShadowSprite],       {  angle: 0, ease: 'none'})

        await timeline;
    }

    public async toggleDoor(open: boolean){
        const openObjectsAlpha = open ? 1 : 0;
        const closedObjectsAlpha = open ? 0 : 1;
        
        const timeline = gsap.timeline({defaults : { duration : this.config.openDuration}});

        timeline.to([this.handleSprite, this.handleShadowSprite, this.closedSprite],       {alpha: closedObjectsAlpha})
        timeline.to([this.openSprite, this.openShadow],         {alpha: openObjectsAlpha},   "<")

        await timeline;
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

