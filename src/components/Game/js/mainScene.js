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

const createDefalutOptions = () => {
    return {
        isStartGame: false,
        isGameOver: false,
        enemyList: [],
        power: 1,
        createEnemyNum: 1,
        count: 0,
        score: 0,
        totalDelta: 0,
        time: 60 * 60 + 40,
        countTxt: null,
        timeTxt: null,
        stageContainer: null,
        uiContainer: null
    }
}

export default class MainScene extends Scene {
    constructor(game) {
        super(game)
        return this;
    }
    init() {
        pauseBgm();
        const options = createDefalutOptions();
        for (const key in options) {
            if (options.hasOwnProperty(key)) {
                this[key] = options[key];
            }
        }
        this.clear();
        this.addStageContainer();
        this.stageContainer.addChild(this.drawBgStage())
        this.addUiContainer();
        this.uiContainer.visible = false;
        this.talk = new Talk({ stage: this.stage })
        this.addNpc()
        return this
    }
    endGame() {
        this.time = 0;
        this.isGameOver = true;
        this.uiContainer.visible = false;
        pauseBgm();
        this.stage.off("pointerdown", this.handleAttack, this)
        Bus.$off("addCount")
        Bus.$off("attack")
        this.enemyList.forEach(e => {
            e && e.out();
        })
        Bus.$emit("gameover", {
            score: this.score,
            count: this.count,
        })
    }
    update(delta) {
        if (!this.stage.visible) return;
        if (this.isStartGame && !this.isGameOver) {
            this.time -= delta
            this.drawTimeTxt()
            this.drawCountTxt();
            if (this.time <= 0) {
                return this.endGame();
            }
            this.totalDelta += delta;
            let t = Math.floor(this.totalDelta)
            if (t % (20 * 60) == 0 && t != 0) {
                this.createEnemyNum += 1;
            }
            if (t % 90 == 0) {
                this.addEnemy();
            }
            this.enemyList.forEach(enemy => {
                enemy && enemy.move()
                if (enemy.x >= this.stage.width - 50 || enemy.y >= this.stage.height) {
                    enemy.out();
                }
            })
            this.enemyList = this.enemyList.filter(e => e.state !== ENEMY_STATE.destroy)
        }
    }
    showUi() {
        this.uiContainer.removeChildren(0, this.uiContainer.length)
        this.uiContainer.visible = true;
        this.drawTimeTxt();
        this.drawCountTxt();
    }
    drawCountTxt() {
        if (this.countTxt) return this.countTxt.text = "击杀:" + this.count;
        this.countTxt = new Text("击杀:" + this.count, {
            fontSize: 24,
            fill: ['#ffffff', '#ff3443'],
            align: 'left',
        })
        this.countTxt.x = 30;
        this.countTxt.y = 560;
        this.countTxt.anchor.set(0, 0.5)
        this.uiContainer.addChild(this.countTxt)
    }
    drawTimeTxt() {
        if (this.timeTxt) return this.timeTxt.text = ~~(this.time / 60);
        this.timeTxt = new Text(~~(this.time / 60), {
            fontSize: 36,
            fill: ['#ffffff', '#ffc000'],
            align: 'center',
        })
        this.timeTxt.x = this.stage.width / 2;
        this.timeTxt.y = 30;
        this.timeTxt.anchor.set(0.5, 0.5)
        this.uiContainer.addChild(this.timeTxt)
    }
    addUiContainer() {
        const { game } = this;
        this.uiContainer = new Container();
        this.uiContainer.width = game.width;
        this.uiContainer.height = game.height;
        this.uiContainer.zIndex = 999;
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
                x: -random(0, 30),
                y: random(-100, 270),
                posY: random(300, this.stage.height),
                stage: this.stage
            })
            console.log(enemy)
            this.enemyList.push(enemy)
        }
    }
    addHero() {
        this.hero = new Hero({
            x: 600,
            y: 340,
            stage: this.stage
        });
    }
    addNpc() {
        this.npc = null
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
        await this.stageTalk();
        await this.beginGame()
    }
    async beginGame() {
        this.isStartGame = true;
        this.npc.out();
        playBgm();
        Bus.$off("addCount")
        Bus.$off("attack")
        Bus.$on("addCount", this.addCount.bind(this))
        this.stage.off("pointerdown", this.handleAttack, this)
        this.stage.on("pointerdown", this.handleAttack, this)
        this.showUi();
        this.addHero();
    }
    addCount(obj) {
        this.score += obj.score;
        this.count += 1;
    }
    handleAttack(e) {
        Bus.$emit("attack", {
            power: this.power,
            pos: e.data.global
        });
    }
    async stageTalk() {
        await this.talk.show({
            name: "李逍遙",
            face: "hero_face_1",
            content: `村子和十裏坡逛個遍，怎麽還沒找到離開的辦法啊~`
        })
        await this.talk.show({
            name: "酒劍仙",
            face: "npc_face_0",
            content: `小子，沒找到出路不如在十裏坡多練練武功，以後出去了也不至于吃虧嘛。`
        })
        await this.talk.show({
            name: "李逍遙",
            face: "hero_face_0",
            content: `（那老酒鬼所說不無道理）多謝前輩指教~`
        })
        await this.talk.show({
            name: "酒劍仙",
            face: "npc_face_0",
            content: `哝，妖怪要來了~`
        })
        await this.talk.show({
            name: "李逍遙",
            face: "hero_face_2",
            content: `哇！！！`
        })
    }
}