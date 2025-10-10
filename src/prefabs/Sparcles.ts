import { Container, Sprite, Texture } from "pixi.js";
import gsap from "gsap";
import { SpriteConfig } from "./SpriteConfig";
import { centerObjects, processSpriteResize } from "../utils/misc";
import { GlobalConfig } from "../scenes/Game";

export type SparclesConfig = {
    spriteConfig: Partial<SpriteConfig>
    count: number;
    radius: number;
    minDuration: number;
    maxDuration: number;
    hideDuration: number;
}
export default class Sparcles extends Container {
  name = "Sparcles";

    private sprites: [Sprite, Partial<SpriteConfig>][] = [];
    private timeline!: gsap.core.Timeline;
    private isEffectActive: boolean = false;

    constructor(protected config: SparclesConfig, protected globalConfig: GlobalConfig) {
        super();
        centerObjects(this);
        this.init();
    }

    private init(){
        for(let i = 0; i < this.config.count; i++)
        {
            var newConfig = structuredClone(this.config.spriteConfig);
            var posX = Math.floor(Math.random() * this.config.radius * 2) + 1 - this.config.radius;
            var posY = Math.floor(Math.random() * this.config.radius * 2) + 1 - this.config.radius;
            newConfig.offset = {x: posX, y: posY};

            const texture = Texture.from(this.config.spriteConfig.name!);
            const sprite = new Sprite(texture);
            sprite.alpha = 0;
            sprite.anchor.set(this.config.spriteConfig.anchor!.x, this.config.spriteConfig.anchor!.y);
            sprite.position.set(posX, posY);
            this.addChild(sprite);
            processSpriteResize(sprite, newConfig, window.innerWidth, window.innerHeight, this.globalConfig)
            this.sprites.push([sprite, newConfig]);
        }
    }

    public showEffect(){
        this.timeline = gsap.timeline({defaults : { yoyo: true, repeat: -1}});
        for(let i = 0; i < this.config.count; i++)
        {
            const duration = Math.random() * (this.config.maxDuration - this.config.minDuration + 1) + this.config.minDuration;
            this.timeline.to(this.sprites[i][0], {alpha: 1, duration: duration}, "<")
        }
        this.isEffectActive = true;
    }

    public stopEffect(){
        if(!this.isEffectActive)
            return;

        this.timeline.kill();
        const tl = gsap.timeline({defaults : { duration: this.config.hideDuration}});
        for(let i = 0; i < this.config.count; i++)
        {
            tl.to(this.sprites[i][0], {alpha: 0}, "<")
        }
    }

    public resize(width: number, height: number){
        console.log("resize");
        centerObjects(this);
        for(let i = 0; i < this.config.count; i++)
        {
            processSpriteResize(this.sprites[i][0], this.sprites[i][1], width, height, this.globalConfig)
        }
    }
}