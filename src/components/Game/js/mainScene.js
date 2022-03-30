import { Text, Graphics, Container } from "pixi.js";
import { createSprite, trottle } from "./tools"
import Bus from "@/utils/bus"
import Scene from "./scene"
import Hero from "./hero"
import Npc from "./npc"
import createEnemy from "./enemy";

export default class MainScene extends Scene {
    constructor(game) {
        super(game)
        this.enemyList = []
        return this;
    }
    init() {
        this.enemyList.length = 0;
        this.clear();
        this.addStageContainer();
        this.stageContainer.addChild(this.drawBgStage())
        this.addUiContainer();
        this.addHero();
        this.onStart();
        return this
    }
    update(delta) {
        if (!this.stage.visible) return;
        // this.enemyList.forEach(enemy => {
        //     enemy && enemy.move()
        // })
    }
    addUiContainer() {
        const { game } = this;
        this.uiContainer = new Container();
        this.uiContainer.width = game.width;
        this.uiContainer.height = game.height;
        this.stage.addChild(this.uiContainer);
    }
    addStageContainer() {
        const { game } = this;
        this.stageContainer = new Container();
        this.stageContainer.sortableChildren = true
        this.stageContainer.interactive = true;
        this.stageContainer.width = game.width;
        this.stageContainer.height = game.height;
        this.stage.addChild(this.stageContainer);
    }
    addEnemy() {
        let enemy_options = {
            x: 150,
            y: 140,
            vx: -1,
            vy: 1,
            stage: this.stage
        }
        let enemy_options1 = {
            x: 100,
            y: 190,
            vx: -1,
            vy: 1,
            stage: this.stage
        }
        let enemy = createEnemy("jiuweng", enemy_options)
        let enemy1 = createEnemy("yong", enemy_options1)
        this.enemyList.push(enemy)
        this.enemyList.push(enemy1)
        console.log(this.enemyList)
    }
    addHero() {
        this.hero = new Hero({
            x: 600,
            y: 340,
            stage: this.stage
        });
    }
    drawBgStage() {
        const { game } = this;
        const { width, height } = game;
        let sprite = createSprite({
            name: "stage",
            width,
            height,
            x: 0,
            y: 0,
            anchor: 0
        })
        sprite.zIndex = 9
        return sprite;
    }
    async onStart() {
        await this.beginGame()
        this.addEnemy();
        this.npc = new Npc({
            x: 650,
            y: 90,
            stage: this.stage
        })
    }
    async beginGame() {
        this.stage.on("pointerdown", e => {
            Bus.$emit("attack", {
                power: 1,
                pos: e.data.global
            });
        })

    }
}