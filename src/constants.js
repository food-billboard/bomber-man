
const UnDestructibleWallPosition = [
  ...new Array(5).fill(0).reduce((acc, _, index) => {
    acc.push(...new Array(15).fill(0).map((_, inIndex) => {
      return [
        inIndex * 2 + 2,
        index * 2 + 2
      ]
    }))
    return acc 
  }, []),
  ...new Array(2).fill(0).reduce((acc, _, index) => {
    acc.push(...new Array(33).fill(0).map((_, inIndex) => {
      return [
        inIndex,
        index * 12
      ]
    }))
    return acc 
  }, []),
  ...new Array(2).fill(0).reduce((acc, _, index) => {
    acc.push(...new Array(13).fill(0).map((_, inIndex) => {
      return [
        index * 32,
        inIndex
      ]
    }))
    return acc 
  }, [])
]

const LEVEL_MAP = [
  {
    wall: [
      ...UnDestructibleWallPosition
    ],
    destructibleWall: [
      [2, 3], [3, 3], [4, 3], [5, 3], [1, 3], [10, 5]
    ],
    monster: [
      ['BalloonMonster', 8, 1],
      ['BalloonMonster', 20, 5],
      ['BalloonMonster', 14, 9],
      ['BalloonMonster', 8, 9],
      ['BalloonMonster', 10, 3],
      ['BalloonMonster', 30, 7]
    ],
    buff: [
      ["SuperBoomBuff", 2, 3],
      ["LoopBuff", 8, 7],
      ["TimeBoomBuff", 20, 3],
    ],
    time: 480 
  }
]