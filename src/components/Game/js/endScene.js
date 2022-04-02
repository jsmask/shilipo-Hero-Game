import { Text, Graphics, Container } from "pixi.js";
import { createSprite, trottle } from "./tools"
import Bus from "@/utils/bus"
import Scene from "./scene"
import { TimelineMax } from "gsap"
import { playSuccess, pauseSuccess,playClick } from "./audio"

export default class EndScene extends Scene {
    constructor(game) {
        super(game)
        return this;
    }
    init(options) {
        this.score  = 0
        this.count  = 0

        if(options){
            let { score = 0, count = 0 } = options
            this.score = score;
            this.count = count;
        }

        pauseSuccess()
        playSuccess();
        this.clear();

        // this.stage.addChild(this.drawBgStage())
        this.stage.zIndex = 10
        this.stage.addChild(this.drawBlackRect())
        this.stage.addChild(this.drawTitle())
        this.drawRestartBtn();
        this.drawBackBtn();
        this.drawContent();
        return this
    }
    drawContent() {
        let txt1 = new Text("擊殺妖怪：" + (this.count + "").padStart(4, 0), {
            fontSize: 28,
            fill: 0xFFcc00,
            align: 'center',
        })
        let txt2 = new Text("經驗得分：" + (this.score + "").padStart(4, 0), {
            fontSize: 28,
            fill: 0xFFcc00,
            align: 'center',
        })
        txt1.anchor.set(0.5, 0.5)
        txt2.anchor.set(0.5, 0.5)
        txt1.x = txt2.x = this.stage.width / 2;
        txt1.y = 270;
        txt2.y = 330;
        this.stage.addChild(txt1)
        this.stage.addChild(txt2)

        this.ani = new TimelineMax({
            onComplete: () => {
                this.ani.kill()
            }
        })
        this.ani.fromTo(txt1, .36, {
            alpha: 0,
            y: txt1.y + 30
        }, {
            alpha: 1,
            y: 270
        }, .15)
            .fromTo(txt2, .36, {
                alpha: 0,
                y: txt2.y + 30
            }, {
                alpha: 1,
                y: 330
            })
            .fromTo(this.btn, 1, {
                alpha: 0,
            }, {
                alpha: 1,
            },"+=.2")
            .fromTo(this.backBtn, 1, {
                alpha: 0,
            }, {
                alpha: 1,
            },"-=.7")
        this.ani.play()
    }
    drawRestartBtn() {
        const { width } = this.game;
        this.btn = new Text("[重新來過]", {
            fontSize: 24,
            fill: 0xFFFFFF,
            align: 'center',
        });
        this.btn.anchor.set(0.5, 0.5);
        this.btn.position.set(width / 2, 450)
        this.btn.zIndex = 12
        this.stage.addChild(this.btn)

        this.btn.interactive = true;
        this.btn.buttonMode = true;
        this.btn.off("pointerdown", this.handleRestart, this)
        this.btn.on("pointerdown", this.handleRestart, this)
    }
    handleRestart() {
        playClick();
        this.hide();
        Bus.$emit("restart")
    }
    handleReset() {
        playClick();
        this.hide();
        Bus.$emit("reset")
    }
    drawBackBtn() {
        const { width } = this.game;
        this.backBtn = new Text("[返回標題]", {
            fontSize: 24,
            fill: 0xFFFFFF,
            align: 'center',
        });
        this.backBtn.anchor.set(0.5, 0.5);
        this.backBtn.position.set(width / 2, 500)
        this.backBtn.zIndex = 12
        this.stage.addChild(this.backBtn)

        this.backBtn.interactive = true;
        this.backBtn.buttonMode = true;
        this.backBtn.off("pointerdown", this.handleReset, this)
        this.backBtn.on("pointerdown", this.handleReset, this)
    }
    drawTitle() {
        const { width, height } = this.game;
        let sprite = createSprite({
            name: "result",
            x: width / 2,
            y: 136,
            anchor: 0.5
        })
        sprite.zIndex = 12
        return sprite;
    }
    drawBlackRect() {
        const { width, height } = this.game;
        let rect = new Graphics()
        rect.beginFill(0x000000, .55);
        rect.drawRect(0, 0, width, height);
        rect.endFill();
        return rect;
    }
}