import { Text, Graphics, Container } from "pixi.js";
import { createSprite } from "./tools"
import Bus from "@/utils/bus"
import { playClick } from "./audio"

const createDefaultOptions = () => {
    return {
        stage: new Container(),
        target: new Container(),
        box: new Container(),
    }
}

class Talk {
    constructor(options) {
        Object.assign(this, createDefaultOptions(), options)
        this.init();
        return this;
    }
    init() {
        this.state = 0;
        this.target.x = 0;
        this.target.y = 0;
        this.target.interactive = true;
        this.target.buttonMode = true;
        this.target.sortableChildren = true
        this.target.width = this.stage.width;
        this.target.height = this.stage.height;
        this.target.zIndex = 1000
        this.target.off("pointerdown", this.handleNext, this)
        this.target.on("pointerdown", this.handleNext, this)
        this.stage.addChild(this.target)
        this.target.addChild(this.box);
    }
    handleNext(e) {
        playClick();
        this.hide()
        Bus.$emit("talk_next")
    }
    show({ name, face, content, position }) {
        this.target.visible = false;
        return new Promise((resolve, reject) => {
            this.clearChildren();
            this.drawInfo({ name, face, content, position });
            this.target.visible = true;
            Bus.$on("talk_next", () => {
                Bus.$off("talk_next")
                resolve()
            })
        })
    }
    drawInfo({ name, face, content, position = "right" }) {
        this.drawRect();
        this.drawName(name, position)
        this.drawFace(face, position)
        this.drawContent(content, position)
    }
    drawFace(name, position) {
        const { width, height } = this.stage;
        this.faceSprite = createSprite({ name, anchor: 0 })
        this.faceSprite.x = width - this.faceSprite.width - 15
        this.faceSprite.y = height - this.faceSprite.height
        if (position == "left") {
            this.faceSprite.x = 15
        }
        this.box.addChild(this.faceSprite)
    }
    drawName(name = "???", position) {
        const { width, height } = this.stage;
        this.nameText = new Text(name + "：", {
            fontSize: 24,
            fill: '#ea8821',
            stroke: '#ea8821',
            lineJoin: 'round',
        })
        this.nameText.x = 20;
        this.nameText.y = height - 185;
        if (position == "left") {
            this.nameText.x = 215
        }
        this.box.addChild(this.nameText)
    }
    drawContent(content = "", position) {
        const { width, height } = this.stage;
        let contentList = content.split("")
        content.split("").forEach((char, index) => {
            if (index % 24 == 0 && index != 0) {
                contentList.splice(index - 1, 0, "\n")
            }
        })
        this.contentText = new Text(contentList.join(""), {
            fontSize: 22,
            fill: '#FFFFFF',
            stroke: '#FFFFFF',
            lineJoin: 'round',
            lineHeight: 28,
        })
        this.contentText.x = 20;
        this.contentText.y = height - 145;
        if (position == "left") {
            this.contentText.x = 215
        }
        this.box.addChild(this.contentText)
    }
    hide() {
        this.target.visible = false
    }
    drawRect() {
        const { width, height } = this.stage;
        this.rect = new Graphics()

        this.rect.beginFill(0xFFFFFF, .01);
        this.rect.drawRect(0, 0, width, height);
        this.rect.endFill();

        this.rect.beginFill(0x6865cc, 0.5);
        this.rect.drawRect(0, height - 200, width, 180);
        this.rect.endFill();
        this.box.addChild(this.rect)
    }
    clearChildren() {
        this.box.removeChildren(0, this.box.children.length)
    }
}

export default Talk;