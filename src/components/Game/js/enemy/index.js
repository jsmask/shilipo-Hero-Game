import Yong from "./yong"
import JiuWeng from "./jiuweng"
import MiFeng from "./mifeng"
import Green from "./green"
import Black from "./black"

const createEnemyData = () => {
    return {
        yong: {
            hp: 100,
            speed: .78,
            animationSpeed: .1,
            score: 7,
            itemType: 1,
            chance: 30
        },
        jiuweng: {
            hp: 93,
            speed: 1.02,
            animationSpeed: .075,
            score: 6,
            itemType: 2,
            chance: 30
        },
        mifeng: {
            hp: 27,
            speed: 3.2,
            animationSpeed: .2,
            score: 4,
            itemType: 0,
            chance: 25
        },
        green: {
            hp: 36,
            speed: 1.82,
            animationSpeed: .12,
            score: 4,
            itemType: 0,
            chance: 25
        },
        black: {
            hp: 66,
            speed: 1.65,
            animationSpeed: .12,
            score: 5,
            itemType: 1,
            chance: 15
        }
    }
}


export default function createEnemy(type, options) {
    const { yong, jiuweng, mifeng, green, black } = createEnemyData();
    switch (type) {
        case "yong": return new Yong({ ...yong, ...options })
        case "jiuweng": return new JiuWeng({ ...jiuweng, ...options })
        case "mifeng": return new MiFeng({ ...mifeng, ...options })
        case "green": return new Green({ ...green, ...options })
        case "black": return new Black({ ...black, ...options })
        default: return createEnemy("yong", options)
    }
}