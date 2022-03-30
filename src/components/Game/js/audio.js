import assets from "./assets"
let hitVoice = new Audio(assets["hit"])
let attackVoice = new Audio(assets["attack"])
let bgmVoice = new Audio(assets["bgm"])

export function playHit(){
    hitVoice.volume = .25
    hitVoice.playbackRate = 1.5
    hitVoice.currentTime = 0
    hitVoice.play()
}

export function playAttack(){
    attackVoice.volume = .1
    attackVoice.currentTime = 0
    attackVoice.play()
}



export function playBgm() {
    bgmVoice.volume = .2
    bgmVoice.loop = true;
    bgmVoice.play()
}
