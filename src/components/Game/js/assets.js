import { getImageUrl, getEnemyImageUrl, getHeroImageUrl, getNpcImageUrl, getStageImageUrl, getOtherImageUrl,getAudioUrl } from "./tools"

const stage = getStageImageUrl("s0", "jpg");

const heroList = {
    hero_face_0: getHeroImageUrl("15-4"),
    hero_normal_0: getHeroImageUrl("207-1"),
    hero_attack_0: getHeroImageUrl("207-5"),
    hero_attack_1: getHeroImageUrl("207-6"),
    hero_attack_2: getHeroImageUrl("207-7"),
}

const enemyList0 = {
    enemy_0_0: getEnemyImageUrl("278-1"),
    enemy_0_1: getEnemyImageUrl("278-2"),
}

const enemyList1 = {
    enemy_1_0: getEnemyImageUrl("288-1"),
    enemy_1_1: getEnemyImageUrl("288-2"),
    enemy_1_2: getEnemyImageUrl("288-3"),
}

const npcList = {
    npc_face_0: getNpcImageUrl("17-3"),
}

for (let i = 16; i <= 36; i++) {
    npcList["npc_drink_" + i] = getNpcImageUrl("1271-" + i)
}

let audioList = {
    hit:getAudioUrl("hit"),
    bgm:getAudioUrl("bgm"),
    click:getAudioUrl("click"),
    success:getAudioUrl("success"),
}

export default {
    stage,
    ...audioList,
    ...heroList,
    ...npcList,
    ...enemyList0,
    ...enemyList1,

}