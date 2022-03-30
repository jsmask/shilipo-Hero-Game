import Yong from "./yong"
import JiuWeng from "./jiuweng"

const createEnemyData = () => {
    return {
        yong: {
            hp: 10,
            speed: .7,
            animationSpeed: .1,
        },
        jiuweng: {
            hp: 8,
            speed: .7,
            animationSpeed: .075,
        }
    }
}


export default function createEnemy(type, options) {
    const { yong, jiuweng } = createEnemyData();
    switch (type) {
        case "yong": return new Yong({ ...yong, ...options })
        case "jiuweng": return new JiuWeng({ ...jiuweng, ...options })
        default: return createEnemy("yong", options)
    }
}