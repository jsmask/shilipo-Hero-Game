import Yong from "./yong"
import JiuWeng from "./jiuweng"
import MiFeng from "./mifeng"
import Green from "./green"
import Black from "./black"

const createEnemyData = () => {
    return {
        yong: {
            hp: 10,
            speed: .78,
            animationSpeed: .1,
            score: 7,
        },
        jiuweng: {
            hp: 9,
            speed: 1.02,
            animationSpeed: .075,
            score: 6
        },
        mifeng: {
            hp: 3,
            speed: 3.2,
            animationSpeed: .2,
            score: 2
        },
        green: {
            hp: 4,
            speed: 1.82,
            animationSpeed: .12,
            score: 2
        },
        black: {
            hp: 6,
            speed: 1.65,
            animationSpeed: .12,
            score: 3
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