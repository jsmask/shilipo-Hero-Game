import assets from "./assets"
let hitVoice = new Audio(assets["hit"])
let bgmVoice = new Audio(assets["bgm"])

export function playHit(){
    hitVoice.volume = .2
    hitVoice.currentTime = 0
    hitVoice.play()
}

export function playBgm() {
    bgmVoice.volume = .2
    bgmVoice.loop = true;
    bgmVoice.play()
}
