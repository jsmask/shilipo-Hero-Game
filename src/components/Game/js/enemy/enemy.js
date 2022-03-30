import { Text, Graphics, Container, AnimatedSprite } from "pixi.js";
import { createSprite, bump } from "../tools"
import Bus from "@/utils/bus"
import Health from "./health";
import { TimelineMax } from "gsap"
import { ENEMY_STATE } from "../types"

const createDefaultOptions = () => {
    return {
        x: 0,
        y: 0,
        target: new Container(),
        stage: new Container(),
        animationSpeed: .1,
        hp: 3,
        state: ENEMY_STATE.normal,
        score: 1,
        vx: 0,
        vy: 0,
        speed: 2,
    }
}

class Enemy {
    constructor(options) {
        Object.assign(this, createDefaultOptions(), options)
        this.init();
        return this;
    }
    init() {
        this.target = new Container();
        this.target.x = this.x;
        this.target.y = this.y;
        this.stage.addChild(this.target)
        this.action();
        this.addHealth();
        Bus.$on("attack", this.hunt.bind(this));
        return this;
    }
    move() {
        if (this.state === ENEMY_STATE.normal) {
            this.x += this.vx * this.speed;
            this.y += this.vy * this.speed;

            this.target.x = this.x;
            this.target.y = this.y;
        }
    }
    addHealth() {
        this.health = new Health({
            x: -10,
            y: -10,
            maxHp: this.hp,
            nowHp: this.hp,
            parent: this.target
        })
    }
    action() {
        // 行动
    }
    hunt(e) {
        if (this.hp <= 0 || this.state === ENEMY_STATE.die) return;
        if (!bump.hit(e.pos, this.target, true, true)) return;
        this.hp -= e.power;
        this.health.cut(this.hp)
        if (this.hp <= 0) {
            this.die();
        }
    }
    die() {
        if (this.state === ENEMY_STATE.die) return;
        this.state = ENEMY_STATE.die;
        this.animatedSprite.stop()
        this.health.destroy()

        this.dieAni = new TimelineMax({
            onComplete: this.destroy.bind(this)
        })
        this.dieAni.to(this.target, .6, {
            alpha: .1,
            x: this.target.x - this.target.width * 0.36,
            y: -this.target.height,
            delay: .15
        }).to(this.target.scale, .6, {
            x: 1.3,
            y: 1.3,
        }, "-=.6")
            .to(this.target.skew, .2, {
                x: .02,
                y: .04,
            }, "-=.8")
        this.dieAni.play()
    }
    destroy() {
        this.state = ENEMY_STATE.destroy
        this.health = null;
        if (this.target.parent) {
            this.target.parent.removeChild(this.target)
        }
    }
}

export default Enemy;