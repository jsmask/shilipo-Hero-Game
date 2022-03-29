import { Sprite} from "pixi.js"
import { getTextures } from "./textures"

export function random(lower, upper) {
    lower = +lower || 0
    upper = +upper || 0
    return Math.random() * (upper - lower) + lower;
}

export function createSprite({ name, x = 0, y = 0, scale = 1, width, height, zIndex = 0, anchor = 0 }) {
    let texture = getTextures(name);
    let sprite = new Sprite(texture);
    sprite.x = x;
    sprite.y = y;
    sprite.width = (width || texture.width) * scale;
    sprite.height = (height || texture.height) * scale;
    sprite.zIndex = zIndex;
    sprite.anchor.set(anchor)
    return sprite;
}

export function getImageUrl(name, ext = "png") {
    return new URL(`/src/assets/${name}.${ext}`, import.meta.url).href
}


export function trottle(handler=null, delay=1000) {
    let last = 0;
    return function(e) {
        let now = +new Date();
        if(now - last > delay) {
            handler.apply(this, arguments);
            last = now;
        }
    }
}