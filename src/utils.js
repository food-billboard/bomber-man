function query(queryString) {
  return document.querySelector(queryString)
}

// 碰撞检测
function knockJudge(positionA, positionB, coincide) {
  if(!!coincide) return positionA.x === positionB.x && positionA.y === positionB.y
  return !(positionA.y + 1 < positionB.y || positionA.x > positionB.x + 1 || positionA.y > positionB.y + 1 || positionA.x + 1 < positionB.x) 
}