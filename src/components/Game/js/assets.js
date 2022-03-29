import { getImageUrl } from "./tools"

const stage = getImageUrl("stage/s0","jpg");

const heroList = {
    hero_normal_0:getImageUrl("hero/653-1"),
    hero_attack_0:getImageUrl("hero/653-5"),
    hero_attack_1:getImageUrl("hero/653-6"),
    hero_attack_2:getImageUrl("hero/653-7"),
}

const enemyList0 = {
    enemy_0_0:getImageUrl("enemy/01/278-1"),
    enemy_0_1:getImageUrl("enemy/01/278-2"),
}

export default {
    stage,
    ...heroList,
    ...enemyList0,
}