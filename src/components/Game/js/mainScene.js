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
import talkData from "./talkData"
import Item from "./item"

const createDefalutOptions = () => {
    return {
        isStartGame: false,
        isGameOver: false,
        enemyList: [],
        power: 10,
        createEnemyNum: 1,
        count: 0,
        score: 0,
        totalDelta: 0,
        maxTime: 60 * 60,
        time: 60 * 60 + 40,
        countTxt: null,
        timeTxt: null,
        timeBox: null,
        timeRect: null,
        powerTxt: null,
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
        Bus.$off("addBuff")
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
            this.drawPowerTxt();
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
        this.drawPowerTxt()
    }
    drawCountTxt() {
        if (this.countTxt) return this.countTxt.text = "擊殺：" + this.count;
        this.countTxt = new Text("擊殺:" + this.count, {
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
        let progress = Math.min(1, this.time / this.maxTime);
        if (this.timeBox) return this.timeRect.width = 300 * progress
        this.timeBox = new Container()
        let rect = new Graphics();
        rect.x = 490;
        rect.y = 10
        rect.lineStyle(1, 0x333333, 1);
        rect.beginFill(0xffffff, .36);
        rect.drawRect(0, 0, 300, 20);
        rect.endFill();

        let txt = new Text("時間：", {
            fontSize: 24,
            fill: ['#ffffff', '#ffc000'],
            align: 'center',
        })
        txt.x = 426;
        txt.y = 7;

        this.timeRect = new Graphics()
        this.timeRect.x = 490;
        this.timeRect.y = 10
        this.timeRect.beginFill(0xffc000, .6);
        this.timeRect.drawRect(0, 0, 300, 20);
        this.timeRect.endFill();

        this.timeBox.addChild(rect)
        this.timeBox.addChild(txt)
        this.timeBox.addChild(this.timeRect)
        this.uiContainer.addChild(this.timeBox)
    }
    drawPowerTxt() {
        if (this.powerTxt) return this.powerTxt.text = "武術：" + this.power
        this.powerTxt = new Text("武術：" + this.power, {
            fontSize: 24,
            fill: ['#ffffff', '#ffc000'],
            align: 'right',
        })
        this.powerTxt.x = 720;
        this.powerTxt.y = 560;
        this.powerTxt.anchor.set(0.5, 0.5)
        this.uiContainer.addChild(this.powerTxt)
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
                stage: this.stageContainer
            })
            this.enemyList.push(enemy)
        }
    }
    addHero() {
        this.hero = new Hero({
            x: 600,
            y: 340,
            stage: this.stageContainer
        });
    }
    addNpc() {
        this.npc = null
        this.stage.removeChild(this.npc)
        this.npc = new Npc({
            x: 650,
            y: 90,
            stage: this.stageContainer
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
        Bus.$off("addBuff")
        Bus.$on("addCount", this.addCount.bind(this))
        Bus.$on("addBuff", this.handleBuff.bind(this))
        this.stage.off("pointerdown", this.handleAttack, this)
        this.stage.on("pointerdown", this.handleAttack, this)
        this.showUi();
        this.addHero();
    }
    handleBuff(obj) {
        switch (obj.type) {
            case 0:
                this.time += 20;
                this.score += 10;
                break;
            case 1:
                this.time += 30
                this.power += 1;
                this.score += 20;
                break;
            case 2:
                this.power += 2
                this.score += 15;
                break;
            default:
                break;
        }
        this.stageContainer.removeChild(obj.target);
        obj = null;
    }
    addCount(obj) {
        if (random(0, 100) < obj.chance) {
            new Item({
                x: obj.x,
                y: obj.y,
                stage: this.stageContainer,
                hero: this.hero,
                type: obj.itemType
            })
        }
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
        await this.talk.show(talkData[0])
        await this.talk.show(talkData[1])
        await this.talk.show(talkData[2])
        await this.talk.show(talkData[3])
        await this.talk.show(talkData[4])
    }
}