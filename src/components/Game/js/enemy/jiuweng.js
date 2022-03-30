import { Text, Graphics, Container, AnimatedSprite } from "pixi.js";
import { createSprite, bump } from "../tools"
import Bus from "@/utils/bus"
import Health from "./health";
import { TimelineMax } from "gsap"
import { ENEMY_STATE } from "../types"
import Enemy from "./enemy"

class JiuWeng extends Enemy{
    constructor(options) {
        super(options)
        return this;
    }
    action(){
        let list = []
        for (let i = 0; i < 3; i++) {
            list.push(createSprite({ name: "enemy_1_" + i, anchor: 0.5 }).texture);
        }
        for (let i = 2; i >= 0; i--) {
            list.push(createSprite({ name: "enemy_1_" + i, anchor: 0.5 }).texture);
        }
        this.animatedSprite = new AnimatedSprite(list);
        this.animatedSprite.loop = true;
        this.animatedSprite.animationSpeed = this.animationSpeed;
        this.animatedSprite.gotoAndPlay(0);
        this.target.addChild(this.animatedSprite)
    }
}

export default JiuWeng