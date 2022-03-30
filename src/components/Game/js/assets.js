import { getImageUrl, getEnemyImageUrl, getHeroImageUrl, getNpcImageUrl, getStageImageUrl, getOtherImageUrl } from "./tools"

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

const npcList = {
    npc_face_0: getNpcImageUrl("17-3"),
}
for (let i = 16; i <= 36; i++) {
    npcList["npc_drink_" + i] = getNpcImageUrl("1271-" + i)
}


export default {
    stage,
    ...heroList,
    ...npcList,
    ...enemyList0,

}