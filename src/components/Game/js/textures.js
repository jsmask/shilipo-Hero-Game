let textures = {}

export function setTextures(key, value) {
    textures[key] = value;
}

export function getTextures(key) {
    return textures[key]
}

export function getTexturesAll(){
    return textures
}