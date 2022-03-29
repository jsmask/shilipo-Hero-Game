import { Text, Graphics, Container, AnimatedSprite } from "pixi.js";

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
    }
    cut(hp) {
        this.nowHp = hp
        const { maxHp, nowHp } = this;
        if (this.nowHp >= 0) this.target.width = 72 * (nowHp / maxHp)
    }
    addBox() {
        let box = new Graphics();
        box.lineStyle(2, 0x333333, 10);
        box.beginFill(0xfc6343, 1);
        box.drawRect(0, 0, 74, 12);
        box.endFill();
        this.parent.addChild(box)
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
}

export default Health;