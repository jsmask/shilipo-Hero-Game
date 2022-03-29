import { Text, Graphics, Container, AnimatedSprite } from "pixi.js";
import { createSprite } from "../tools"
import Bus from "@/utils/bus"
import Health from "./health";

const defaultOptions = {
    x: 0,
    y: 0,
    target: new Container(),
    stage: new Container(),
    animationSpeed: .1,
    hp: 3
}

class Enemy {
    constructor(options) {
        Object.assign(this, defaultOptions, options)
        this.init();
        return this;
    }
    init() {
        this.target = new Container();
        this.target.x = this.x;
        this.target.y = this.y;
        this.stage.addChild(this.target)
        this.addHealth();
        this.action();
        Bus.$on("attack", this.hunt.bind(this));
    }
    addHealth() {
        this.health = new Health({
            x: 0,
            y: -100,
            maxHp: this.hp,
            nowHp: this.hp,
            parent: this.target
        })
    }
    action() {
        let list = []
        for (let i = 0; i < 2; i++) {
            list.push(createSprite({ name: "enemy_0_" + i }).texture);
        }
        this.animatedSprite = new AnimatedSprite(list);
        this.animatedSprite.loop = true;
        this.animatedSprite.animationSpeed = this.animationSpeed;
        this.animatedSprite.gotoAndPlay(0);
        this.target.addChild(this.animatedSprite)
    }
    hunt(e) {
        if (this.nowHp <= 0) return;
        this.hp -= 1;
        this.health.cut(this.hp)
        if (this.hp <= 0) {
            this.die();
        }
    }
    die(){
        this.target.alpha = 0;
    }
}

export default Enemy;