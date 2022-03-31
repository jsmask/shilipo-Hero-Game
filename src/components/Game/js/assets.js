import { getImageUrl, getEnemyImageUrl, getHeroImageUrl, getNpcImageUrl, getStageImageUrl, getOtherImageUrl, getAudioUrl } from "./tools"

const title = getImageUrl("title");
const stage = getStageImageUrl("s0", "jpg");

const heroList = {
    hero_face_0: getHeroImageUrl("15-4"),
    hero_face_1: getHeroImageUrl("15-10"),
    hero_face_2: getHeroImageUrl("15-12"),
    hero_normal_0: getHeroImageUrl("207-1"),
    hero_attack_0: getHeroImageUrl("207-5"),
    hero_attack_1: getHeroImageUrl("207-7"),
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

const enemyList2 = {
    enemy_2_0: getEnemyImageUrl("178-1"),
    enemy_2_1: getEnemyImageUrl("178-2"),
    enemy_2_2: getEnemyImageUrl("178-3"),
    enemy_2_2: getEnemyImageUrl("178-4"),
}

const enemyList3 = {
    enemy_3_0: getEnemyImageUrl("309-1"),
    enemy_3_1: getEnemyImageUrl("309-2"),
    enemy_3_2: getEnemyImageUrl("309-3"),
    enemy_3_2: getEnemyImageUrl("309-4"),
}

const enemyList4 = {
    enemy_4_0: getEnemyImageUrl("286-1"),
    enemy_4_1: getEnemyImageUrl("286-2"),
    enemy_4_2: getEnemyImageUrl("286-3"),
    enemy_4_2: getEnemyImageUrl("286-4"),
}

const npcList = {
    npc_face_0: getNpcImageUrl("17-3"),
}

for (let i = 16; i <= 36; i++) {
    npcList["npc_drink_" + i] = getNpcImageUrl("1271-" + i)
}

let audioList = {
    hit: getAudioUrl("hit"),
    bgm: getAudioUrl("bgm"),
    click: getAudioUrl("click"),
    success: getAudioUrl("success"),
    open: getAudioUrl("open"),
    attack: getAudioUrl("attack"),
}

export default {
    title,
    stage,
    ...audioList,
    ...heroList,
    ...npcList,
    ...enemyList0,
    ...enemyList1,
    ...enemyList2,
    ...enemyList3,
    ...enemyList4,
}