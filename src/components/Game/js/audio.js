import assets from "./assets"
let hitVoice = new Audio(assets["hit"])
let attackVoice = new Audio(assets["attack"])
let bgmVoice = new Audio(assets["bgm"])
let clickVoice = new Audio(assets["click"])
let successVoice = new Audio(assets["success"])

export function playHit(){
    hitVoice.volume = .15
    hitVoice.playbackRate = 1.8
    hitVoice.currentTime = 0
    hitVoice.play()
}

export function playAttack(){
    attackVoice.volume = .07
    attackVoice.currentTime = 0
    attackVoice.play()
}

export function playBgm() {
    bgmVoice.volume = .2
    bgmVoice.currentTime = 0
    bgmVoice.loop = true;
    bgmVoice.play()
}

export function playClick(){
    clickVoice.volume = .2
    clickVoice.currentTime = 0
    clickVoice.play()
}

export function pauseBgm() {
    bgmVoice.pause()
}

export function playSuccess() {
    successVoice.volume = .2
    successVoice.currentTime = 0
    successVoice.play()
}

export function pauseSuccess() {
    successVoice.pause()
}
