import { Text, Graphics, Container } from "pixi.js";
import { createSprite, random } from "./tools"
import Bus from "@/utils/bus"
import Scene from "./scene"
import Hero from "./hero"
import Npc from "./npc"
import createEnemy from "./enemy";
import { playBgm, pauseBgm } from "./audio"
import Talk from "./talk";
import { ENEMY_STATE } from "./types";

export default class MainScene extends Scene {
    constructor(game) {
        super(game)
        this.enemyList = []
        return this;
    }
    init() {
        pauseBgm();
        this.isStartGame = false;
        this.isGameOver = false;
        this.enemyList.length = 0;
        this.power = 1;
        this.createEnemyNum = 1;
        this.count = 0;
        this.totalDelta = 0
        this.clear();
        this.addStageContainer();
        this.stageContainer.addChild(this.drawBgStage())
        this.addUiContainer();
        this.uiContainer.visible = false;
        this.talk = new Talk({ stage: this.stage })
        this.onStart();
        return this
    }
    update(delta) {
        if (!this.stage.visible) return;
        if (this.isStartGame) {
            this.totalDelta += delta;
            if (~~(this.totalDelta) % 120 == 0) {
                this.addEnemy();
            }
            this.enemyList.forEach(enemy => {
                enemy && enemy.move()
                if (enemy.x >= this.stage.width - 100 || enemy.y >= this.stage.height) {
                    enemy.out();
                }
            })
            this.enemyList = this.enemyList.filter(e => e.state !== ENEMY_STATE.destroy)
            
        }
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
        let enemyTypes = ["jiuweng", "yong", "mifeng", "green", "black"]
        for (let i = 0; i < this.createEnemyNum; i++) {
            let enemy = createEnemy(enemyTypes[~~random(0, enemyTypes.length)], {
                x: -random(0, 20),
                y: random(-120, 280),
                posY:random(180, 540),
                stage: this.stage
            })
            this.enemyList.push(enemy)
        }
        console.log(this.enemyList)
    }
    addHero() {
        this.hero = new Hero({
            x: 600,
            y: 340,
            stage: this.stage
        });
    }
    addNpc() {
        this.stage.removeChild(this.npc)
        this.npc = new Npc({
            x: 650,
            y: 90,
            stage: this.stage
        })
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
        this.addNpc();
        await this.stageTalk();
        await this.beginGame()
    }
    async beginGame() {
        this.isStartGame = true;
        this.npc.out();
        playBgm();
        this.uiContainer.visible = true;
        this.addHero();
        this.stage.on("pointerdown", e => {
            Bus.$emit("attack", {
                power: this.power,
                pos: e.data.global
            });
        })
    }
    async stageTalk() {
        await this.talk.show({
            name: "李逍遥",
            face: "hero_face_1",
            content: `村子和十里坡逛个遍，怎么还没找到离开的办法啊~`
        })
        await this.talk.show({
            name: "酒剑仙",
            face: "npc_face_0",
            content: `小子，没找到出路不如在十里坡多练练武功，以后出去了也不至于吃亏嘛。`
        })
        await this.talk.show({
            name: "李逍遥",
            face: "hero_face_0",
            content: `（老酒鬼言之有理），多谢前辈指教~`
        })
        await this.talk.show({
            name: "酒剑仙",
            face: "npc_face_0",
            content: `哝，妖怪要来了~`
        })
        await this.talk.show({
            name: "李逍遥",
            face: "hero_face_2",
            content: `咦！！！`
        })
    }
}