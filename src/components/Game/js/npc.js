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
        this.animatedSprite = new AnimatedSprite(drink_list);
        this.animatedSprite.loop = true;
        this.animatedSprite.animationSpeed = .1;
        this.animatedSprite.gotoAndPlay(0);
        this.animatedSprite.onComplete = () => {
            // this.out();
            // this.drink();
        }
        this.target.addChild(this.animatedSprite)
    }
    hide() {
        this.target.visible = false;
    }
    show() {
        this.target.visible = true;
    }
    wait() {
        this.state = NPC_STATE.wait
        this.show();
        let wait_list = []
        this.target.removeChildren(0, this.target.children.length)
        for (let i = 0; i < 2; i++) {
            wait_list.push(createSprite({ name: "npc_wait_" + i, anchor: 0 }).texture);
        }
        this.animatedSprite = new AnimatedSprite(wait_list);
        this.animatedSprite.loop = true;
        this.animatedSprite.animationSpeed = .1;
        this.animatedSprite.gotoAndPlay(0);
        this.target.addChild(this.animatedSprite)

        return new Promise((resove, reject) => {
            this.waitAni = new TimelineMax({
                onComplete: () => {
                    resove()
                }
            })
            this.waitAni.fromTo(this.target, .8, {
                alpha: 0
            }, {
                alpha: 1,
            })
            this.waitAni.play()
        })
    }
    out() {
        if (this.state === NPC_STATE.out) return;
        this.state = NPC_STATE.out
        this.outAni = new TimelineMax({
            onComplete: () => {
                this.hide()
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