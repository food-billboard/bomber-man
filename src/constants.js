
const UnDestructibleWallPosition = new Array(5).fill(0).reduce((acc, _, index) => {
  acc.push(...new Array(15).fill(0).map((_, inIndex) => {
    return [
      inIndex * 2 + 1,
      index * 2 + 1
    ]
  }))
  return acc 
}, [])

const LEVEL_MAP = [
  {
    wall: [
      ...UnDestructibleWallPosition
    ],
    destructibleWall: [

    ],
    monster: [

    ],
    buff: [
      
    ],
    time: 240 
  }
]