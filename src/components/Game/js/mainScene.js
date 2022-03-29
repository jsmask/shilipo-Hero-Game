import { Text, Graphics, Container } from "pixi.js";
import { createSprite, trottle } from "./tools"
import Bus from "@/utils/bus"
import Scene from "./scene"
import Hero from "./hero"
import Enemy from "./enemy/enemy";

export default class MainScene extends Scene {
    constructor(game) {
        super(game)
        return this;
    }
    init() {
        this.clear();
        this.addStageContainer();
        this.stageContainer.addChild(this.drawBgStage())
        this.addHero();
        this.onStart();
        return this
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
        new Enemy({
            x: 150,
            y: 140,
            stage: this.stage
        })
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
            y: 0
        })
        sprite.zIndex = 9
        return sprite;
    }
    async onStart() {
        await this.beginGame()
        this.addEnemy();
    }
    async beginGame() {
        let handleClick = trottle(function(e){
            Bus.$emit("attack", e.data.global); 
        }, 200)
        this.stage.on("pointerdown", handleClick)

    }
}