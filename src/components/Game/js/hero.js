import { Text, Graphics, Container, AnimatedSprite } from "pixi.js";
import { createSprite } from "./tools"
import { HERO_STATE } from "./types"
import Bus from "@/utils/bus"
import {playHit} from "./audio"

const defaultOptions = {
    x: 0,
    y: 0,
    target: new Container(),
    stage: new Container()
}

class Hero {
    constructor(options) {
        Object.assign(this, defaultOptions, options)
        this.init();
        return this;
    }
    init() {
        this.state = HERO_STATE.normal;
        this.target = new Container();
        this.target.x = this.x;
        this.target.y = this.y;
        this.stage.addChild(this.target)
        this.normal();

        Bus.$on("attack", this.attack.bind(this));
    }
    normal() {
        this.state = HERO_STATE.normal;
        this.clearChildren();
        this.target.addChild(createSprite({ name: "hero_normal_0", anchor: 0 }))
    }
    attack() {
        if (this.state === HERO_STATE.attack) return;
        this.state = HERO_STATE.attack;
        playHit();
        this.clearChildren();
        let attack_list = []
        for (let i = 0; i < 3; i++) {
            attack_list.push(createSprite({ name: "hero_attack_" + i, anchor: 0 }).texture);
        }
        this.attackAnimatedSprite = new AnimatedSprite(attack_list);
        this.attackAnimatedSprite.loop = false;
        this.attackAnimatedSprite.animationSpeed = .2;
        this.attackAnimatedSprite.gotoAndPlay(0);
        this.attackAnimatedSprite.onComplete = () => {
            this.normal()
        }
        this.target.addChild(this.attackAnimatedSprite)
    }
    clearChildren() {
        this.target.removeChildren(0, this.target.children.length)
    }
}

export default Hero;