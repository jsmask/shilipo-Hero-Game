import { Text, Graphics, Container } from "pixi.js";
import { createSprite, trottle } from "./tools"
import Bus from "@/utils/bus"
import Scene from "./scene"

export default class beginScene extends Scene {
    constructor(game) {
        super(game)
        return this;
    }
    init() {
        this.clear();
        return this
    }  
}