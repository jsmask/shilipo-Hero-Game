import { Text, Graphics, Container, AnimatedSprite } from "pixi.js";
import { createSprite } from "./tools"
import Bus from "@/utils/bus"
import { TimelineMax } from "gsap"
import { NPC_STATE } from "./types"

const defaultOptions = {
    x: 0,
    y: 0,
    target: new Container(),
    stage: new Container()
}

class Npc {
    constructor(options) {
        Object.assign(this, defaultOptions, options)
        this.init();
        return this;
    }
    init() {
        this.state = NPC_STATE.normal
        this.target = new Container();
        this.target.x = this.x;
        this.target.y = this.y;
        this.stage.addChild(this.target)
        this.normal();
        Bus.$on("drink", this.drink.bind(this));
    }
    normal() {
        this.drink();
    }
    drink() {
        let drink_list = []
        for (let i = 16; i <= 36; i++) {
            drink_list.push(createSprite({ name: "npc_drink_" + i, anchor: 0 }).texture);
        }
        this.drinkAnimatedSprite = new AnimatedSprite(drink_list);
        this.drinkAnimatedSprite.loop = false;
        this.drinkAnimatedSprite.animationSpeed = .1;
        this.drinkAnimatedSprite.gotoAndPlay(0);
        this.drinkAnimatedSprite.onComplete = () => {
            this.out();
        }
        this.target.addChild(this.drinkAnimatedSprite)
    }
    out() {
        if(this.state === NPC_STATE.out) return;
        this.state = NPC_STATE.out
        this.outAni = new TimelineMax({
            onComplete: () => { 
                this.destroy();
            }
        })
        this.outAni.to(this.target, 1, {
            alpha: 0,
        })
        this.outAni.play()

    }
    destroy() {
        if (this.target.parent) {
            this.target.parent.removeChild(this.target)
        }
    }
}

export default Npc;