function query(queryString) {
  return document.querySelector(queryString)
}

// 保留4位小数
function toFixed4(number) {
  return parseFloat(number.toFixed(4))
}

// 碰撞检测
function knockJudge(origin, target, coincide) {
  if(!!coincide) return origin.x === target.x && origin.y === target.y
  return origin.x < target.x + 1 && origin.x + 1 > target.x && origin.y < target.y + 1 && origin.y + 1 > target.y 
}

// 碰撞障碍墙检测
function knockWall(position) {
  const { x, y } = position
  const isOuter = x < 1 || x > 31 || y < 1 || y > 11
  if(isOuter) return true  
  if(x % 1 !== 0 || y % 1 !== 0) {
    const maxX = Math.ceil(x)
    const minX = Math.floor(x)
    const maxY = Math.ceil(y)
    const minY = Math.floor(y)
    return [{ x: minX, y: minY }, { x: minX, y: maxY }, { x: maxX, y: minY }, { x: maxX, y: maxY }].some(knockWall)
  }
  return x % 2 === 0 && y % 2 === 0
}