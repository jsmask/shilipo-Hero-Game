import { Text, Graphics, Container, AnimatedSprite } from "pixi.js";
import { createSprite } from "./tools"
import Bus from "@/utils/bus"
import { TimelineMax } from "gsap"
import { ITEM_STATE } from "./types"

const createDefaultOptions = () => {
    return {
        x: 0,
        y: 0,
        target: new Container(),
        stage: new Container(),
        type: 0,
        hero: null,
        state: ITEM_STATE.normal
    }
}

class Item {
    constructor(options) {
        Object.assign(this, createDefaultOptions(), options)
        this.init();
        return this;
    }
    init() {
        this.target = new Container();
        this.target.x = this.x + 30;
        this.target.y = this.y + 60;
        this.target.zIndex = 100000;
        this.stage.addChild(this.target)
        this.draw();
        this.play();
    }
    draw() {
        let data = [{ name: "guo", text: "鼠儿果" }, { name: "cao", text: "龙涎草" }, { name: "jiu", text: "烧酒" }][this.type || 0]
        this.text = data.text;
        let sprite = createSprite({
            name: data.name,
            anchor: 0.5,
        });
        this.target.addChild(sprite)
    }
    play() {
        let ani = new TimelineMax({
            onComplete: () => {
                this.state = ITEM_STATE.use;
                Bus.$emit("addBuff", this)
                ani.kill()
                this.clearChildren();
            }
        })
        ani.fromTo(this.target, .36, {
            alpha: 0,
        }, {
            alpha: 1,
            y: this.target.y + 30
        })
            .to(this.target, .5, {
                alpha: .5,
                x: this.hero.x + 80,
                y: this.hero.y + 50
            }, "+=.2")
            .to(this.target, .5, {
                alpha: 0,
            }, "+=.1")
    }
    clearChildren() {
        this.target.removeChildren(0, this.target.children.length)
    }
}

export default Item;