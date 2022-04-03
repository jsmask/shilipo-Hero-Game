import { Text, Graphics, Container, AnimatedSprite } from "pixi.js";
import { createSprite } from "./tools"
import { HERO_STATE } from "./types"
import Bus from "@/utils/bus"
import {playAttack} from "./audio"

const createDefaultOptions = ()=> {
    return {
        x: 0,
        y: 0,
        target: new Container(),
        stage: new Container()
    }
}

class Hero {
    constructor(options) {
        Object.assign(this, createDefaultOptions(), options)
        this.init();
        return this;
    }
    init() {
        this.state = HERO_STATE.normal;
        this.target = new Container();
        this.target.x = this.x;
        this.target.y = this.y;
        this.target.zIndex = this.y + 30
        this.stage.addChild(this.target)
        this.normal();
        Bus.$on("attack", this.attack.bind(this));
    }
    normal() {
        this.state = HERO_STATE.normal;
        this.clearChildren();
        this.target.addChild(createSprite({ name: "hero_normal_0", anchor: 0 }))
    }
    wait(){
        this.clearChildren();
        let wait_list = [];
        for (let i = 0; i < 2; i++) {
            wait_list.push(createSprite({ name: "hero_wait_" + i, anchor: 0 }).texture);
        }
        this.attackAnimatedSprite = new AnimatedSprite(wait_list);
        this.attackAnimatedSprite.loop = true;
        this.attackAnimatedSprite.animationSpeed = .12;
        this.attackAnimatedSprite.gotoAndPlay(0);
        this.target.addChild(this.attackAnimatedSprite)
    }
    attack() {
        if (this.state === HERO_STATE.attack) return;
        this.state = HERO_STATE.attack;
        playAttack();
        this.clearChildren();
        let attack_list = []
        for (let i = 0; i < 3; i++) {
            attack_list.push(createSprite({ name: "hero_attack_" + i, anchor: 0 }).texture);
        }
        this.attackAnimatedSprite = new AnimatedSprite(attack_list);
        this.attackAnimatedSprite.loop = false;
        this.attackAnimatedSprite.animationSpeed = .32;
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