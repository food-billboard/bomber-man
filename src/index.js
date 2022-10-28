// Function

function toBeGod() {}

// type
// LoopBuff TimeBoomBuff CrossWallBuff SuperBoomBuff
function getBuff(type) {
	switch (type) {
		case "LoopBuff":
			return LoopBuff
		case "TimeBoomBuff":
			return TimeBoomBuff
		case "CrossWallBuff":
			return CrossWallBuff
		case "SuperBoomBuff":
			return SuperBoomBuff
	}
}

// type
// BalloonMonster CrossWallMonster SpeedMonster
function getMonster(type) {
	switch (type) {
		case "BalloonMonster":
			return LoopBuff
		case "CrossWallMonster":
			return CrossWallMonster
		case "SpeedMonster":
			return SpeedMonster
	}
}

// Constants

const LeftMoveButton = query(".action-left")
const RightMoveButton = query(".action-right")
const TopMoveButton = query(".action-top")
const BottomMoveButton = query(".action-bottom")

const JropButton = query(".action-j")
const BoomButton = query(".action-K")
const NextButton = query(".action-l")
const StopButton = query(".action-p")

const Stage = new Konva.Stage({
  container: 'app',
  width: 500,
  height: 500
})

const Layer = new Konva.Layer();
Stage.add(Layer);

const rect = new Konva.Rect({
  x: 300,
  y: 300,
  width: 100,
  height: 80,
  stroke: 'red',
})

Layer.add(rect)

let idCounter = 0

// 墙被摧毁
const EMITTER_WALL_DESTROY = "EMITTER_WALL_DESTROY"
// 怪物被消灭
const EMITTER_MONSTER_DESTROY = "EMITTER_MONSTER_DESTROY"
const EventEmitter = new EventEmitter3()

// Object

class CoreObject {
	x = 0
	y = 0

	id

	constructor() {
		this.id = idCounter++
	}

	create() {}

	eventBind() {}

	update() {}

	destroy() {}
}

// 角色
class Person extends CoreObject {
	// 穿墙
	static crossable = false

	life = 3

	constructor() {}

	create() {}

	die() {
		this.life--
	}
}

// 炸弹
class Boom extends CoreObject {
	static multiple = false
	static time = false
	static huge = false

	stop() {}
}

class Buff extends CoreObject {

  display = false 

	// 生成的位置范围
	constructor(position) {
		this.x = position[0]
		this.y = position[1]
	}

	update() {}

	listenMethod(position) {
		if (position[0] === this.x && position[1] === this.y) this.display = true
	}

	eventBind() {
		EventEmitter.addListener(EMITTER_WALL_DESTROY, this.listenMethod)
	}

	eventUnBind() {
		EventEmitter.removeListener(EMITTER_WALL_DESTROY, this.listenMethod)
	}

	destroy() {
		this.eventUnBind()
	}
}

// 连放炸弹buff
class LoopBuff extends Buff {}

// 炸弹顶点爆炸buff
class TimeBoomBuff extends Buff {}

// 穿墙buff
class CrossWallBuff extends Buff {}

// 炸弹爆炸范围buff
class SuperBoomBuff extends Buff {}

class Door extends Buff {

	update() {}

}

class Wall extends CoreObject {
	constructor(position, destructible) {
		this.destructible = destructible
		this.position = position
		this.create()
	}

	// 是否可以被破坏
	destructible = false
	// 位置
	position = []
	// canvas 对象实例
	instance

	create() {}
}

class Monster extends CoreObject {
	// 移动速度
	speed = 10
	// 可穿越
	crossable = false

	stop() {}
}

// 气球怪
class BalloonMonster extends Monster {}

// 穿墙怪
class CrossWallMonster extends Monster {
	crossable = true
}

// 高速怪
class SpeedMonster extends Monster {
	speed = this.speed * 2
}

class Game {
	constructor() {}

	timer
	timeout = 240

	level = 1

	wall = []
	destructibleWall = []
	monster = []
	buff = []
	door
	person

	get levelData() {
		return LEVEL_MAP[this.level]
	}

	init() {
		const { wall, destructibleWall, monster, time, buff } = this.levelData
		this.timeout = time
		wall.forEach(this.createWall.bind(this, false))
		destructibleWall.forEach(this.createWall.bind(this, true))
		monster.forEach(this.createMonster)
		buff.forEach(this.createBuff)
		this.initDoor()
		this.initPerson()
	}

	// 创建障碍墙
	createWall(destructible, position) {
		const wall = new Wall(position, destructible)
		this[destructible ? "destructibleWall" : "wall"].push(wall)
	}

	// 创建怪物
	createMonster([type, ...position]) {
		const monster = new (getMonster(type))(position, destructible)
		this.monster.push(monster)
	}

	// 创建buff
	createBuff([type, ...position]) {
		const monster = new (getBuff(type))(position, destructible)
		this.buff.push(monster)
	}

	// 创建门
	initDoor() {
		const { destructibleWall } = this.levelData
		const index = Math.floor(Math.random() * destructibleWall.length)
		this.door = new Door(destructibleWall[index])
	}

	// 创建角色
	initPerson() {
		this.person = new Person()
	}

	start() {
		this.timer = setInterval(() => {
			this.timeout--
		}, 1000)
	}

	stop() {
		clearInterval(this.timer)
	}

	destroy() {
		this.wall.forEach((item) => item.destroy())
		this.destructibleWall.forEach((item) => item.destroy())
		this.door.destroy()
		this.person.destroy()

		this.wall = []
		this.destructibleWall = []
		this.door = undefined
		this.person = undefined
	}

	restart() {
		this.destroy()
		this.level = 1
		this.init()
	}
}

new Game()
