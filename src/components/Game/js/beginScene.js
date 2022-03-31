import { Text, Graphics, Container } from "pixi.js";
import { createSprite, trottle } from "./tools"
import Bus from "@/utils/bus"
import Scene from "./scene"
import {TimelineMax} from "gsap"
import { playClick } from "./audio"

export default class BeginScene extends Scene {
    constructor(game) {
        super(game)
        return this;
    }
    init() {
        this.clear();
        // this.stage.addChild(this.drawBgStage())
        this.stage.zIndex = 10
        this.stage.addChild(this.drawBlackRect())
        this.stage.addChild(this.drawTitle())
        this.drawStartBtn();
        return this
    }
    drawStartBtn() {
        const { width } = this.game;
        this.btn = new Text("[點擊任意位置開始遊戲]", {
            fontSize: 24,
            fill: 0xFFFFFF,
            align: 'left',
        });
        this.btn.anchor.set(0.5, 0.5);
        this.btn.position.set(width / 2, 480)
        this.btn.zIndex = 12
        this.stage.addChild(this.btn)

        this.btn.interactive = true;
        this.btn.buttonMode = true;
        this.stage.on("pointerdown", e => {
            playClick();
            Bus.$emit("startGame")
        })

        let btnAni = new TimelineMax().fromTo(this.btn, { alpha: 0 }, { alpha: 1, duration: .4, immediateRender: true, ease: "SteppedEase(1)" });
        btnAni.repeat(-1)
        btnAni.yoyo(true);
    }
    drawTitle() {
        const { width, height } = this.game;
        let sprite = createSprite({
            name: "title",
            x: width/2,
            y: 136,
            anchor: 0.5
        })
        sprite.zIndex = 12
        return sprite;
    }
    drawBlackRect(){
        const { width, height } = this.game;
        let rect = new Graphics()
        rect.beginFill(0x000000, .55);
        rect.drawRect(0, 0, width, height);
        rect.endFill();
        return rect;
    }
}