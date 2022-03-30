import { Text, Graphics, Container, AnimatedSprite } from "pixi.js";
import { TimelineMax } from "gsap"

const defaultOptions = {
    x: 0,
    y: 0,
    target: new Graphics(),
    parent: new Container(),
    maxHp: 100,
    nowHp: 100
}

class Health {
    constructor(options) {
        Object.assign(this, defaultOptions, options)
        this.init();
        return this;
    }
    init() {
        this.addBox();
        this.addHpProgress();
        this.hitAni = new TimelineMax({
            onComplete: () => {
                if (this.nowHp <= 0) {
                    this.destroy()
                }
            }
        })
    }
    show() {
        this.target.visible = this.box.visible = true;
    }
    hide() {
        this.target.visible = this.box.visible = false;
    }
    cut(hp) {
        this.nowHp = hp
        const { maxHp, nowHp } = this;
        if (this.nowHp > 0) {
            this.hitAni.to(this.target, .1, {
                width: 72 * (nowHp / maxHp)
            })
        }
        else {
            this.target.width = 0
        }
    }
    addBox() {
        this.box = new Graphics();
        this.box.lineStyle(2, 0x333333, 10);
        this.box.beginFill(0xfc6343, 1);
        this.box.drawRect(0, 0, 74, 12);
        this.box.endFill();
        this.parent.addChild(this.box)
    }
    addHpProgress() {
        this.drawHp();
        this.parent.addChild(this.target)
    }
    drawHp() {
        const { maxHp, nowHp } = this;
        this.target.beginFill(0x3cbc0c, 1);
        this.target.drawRect(1, 1, 72 * (nowHp / maxHp), 10);
        this.target.endFill();
    }
    destroy() {
        if (this.target.parent) {
            this.target.parent.removeChild(this.target)
        }
        if (this.box.parent) {
            this.box.parent.removeChild(this.box)
        }
    }
}

export default Health;