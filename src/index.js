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
			return BalloonMonster
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

const DropButton = query(".action-j")
const BoomButton = query(".action-K")
const NextButton = query(".action-l")
const StopButton = query(".action-p")

let CANVAS_WIDTH = 800 
let CANVAS_HEIGHT = CANVAS_WIDTH * 13 / 33
const UNIT = CANVAS_WIDTH / 33
// 单步移动
const MOVE_UNIT = UNIT / 100

const Stage = new Konva.Stage({
  container: 'container',
  width: CANVAS_WIDTH,
  height: CANVAS_HEIGHT
})

const Layer = new Konva.Layer();
Stage.add(Layer);

let idCounter = 0

// 墙被摧毁
const EMITTER_WALL_DESTROY = "EMITTER_WALL_DESTROY"
// 怪物被消灭
const EMITTER_MONSTER_DESTROY = "EMITTER_MONSTER_DESTROY"
// 移动
const EMITTER_TARGET_MOVE = "EMITTER_TARGET_MOVE"
// 碰撞
const EMITTER_TARGET_KNOCK = "EMITTER_TARGET_KNOCK"
const EventEmitter = new EventEmitter3()

// Object

class CoreObject {

	// 在这里监听unit改变

	constructor(position) {
		this.id = idCounter++
		this.x = position[0]
		this.y = position[1]
	}

	x = 0
	y = 0
	instance 

	id

	create() {}

	eventBind() {}

	updatePosition(position) {
		if(position) {
			this.x = position.x
			this.y = position.y
		}
		this.instance && this.instance.absolutePosition({ x: this.x * UNIT, y: this.y * UNIT })
	}

	update() {}

	destroy() {}

	stop() {

	}

	start() {

	}

}

// 角色
class Person extends CoreObject {

	constructor(position) {
		super(position)
		this.create()
	}

	// 穿墙
	static crossable = false

	life = 3

	create() {
		const person = new Konva.Rect({
			x: this.x * UNIT,
			y: this.y * UNIT,
			width: UNIT,
			height: UNIT,
			fill: 'red'
		})
		Layer.add(person)
	}

	die() {
		this.life--
	}

	eventBind() {

	}

	eventUnBind() {

	}

}

// 炸弹
class Boom extends CoreObject {
	static multiple = false
	static time = false
	static huge = false

	constructor(options) {
		const { onBoom } = options 
		this.onBoom = onBoom
	}

	onBoom 
	timeout 
	timeoutStart
	timeoutRest = 5000 
	timer 

	boomVertical 
	boomHorizontal

	create() {
		const boom = new Konva.Rect({
			x: this.x * UNIT,
			y: this.y * UNIT,
			width: UNIT,
			height: UNIT,
			// 后面改成图片
			fill: '#CCFFFF',
		})
		Layer.add(boom)
		if(!Boom.time) this.boom()
	}

	// 立刻爆炸
	immediateBoom() {
		// TODO 
		this.timer = setInterval(() => {
			// init 
			if(!this.boomVertical) {

			}
		}, 1000 / 60)
	}

	// 炸弹爆炸
	boom() {
		this.timeoutStart = Date.now() 
		this.timeout = setTimeout(() => {
			this.immediateBoom()
			this.timeoutRest = 0 
		}, this.timeoutRest)
	}

	stop() {
		if(this.timeoutRest !== 0) {
			this.timeoutRest = Date.now() - this.timeoutStart
			clearTimeout(this.timeout)
		}
		if(Boom.time) {
			clearInterval(this.timer)
		}
	}
}

class BoomFactory {

	constructor() {
		this.eventBind()
	}

	boomMap = {

	}

	onBoom(id) {
		delete this.boomMap[id]
	}

	create() {
		if(Object.keys(this.boomMap).length >= (Boom.multiple ? 5 : 1)) return
		const boom = new Boom({
			onBoom: this.onBoom
		})
		this.boomMap[boom.id] = boom 
	}

	boom() {
		const targetId = Math.min(...Object.keys(this.boomMap))	
		!!this.boomMap[targetId] && this.boomMap[targetId].immediateBoom()
	}

}

class Buff extends CoreObject {

  display = true 

	create(image) {
		const buff = new Konva.Rect({
			x: this.x * UNIT,
			y: this.y * UNIT,
			width: UNIT,
			height: UNIT,
			// 后面改成图片
			fill: this.display ? image : 'transparent',
		})
		Layer.add(buff)
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
class LoopBuff extends Buff {

	constructor(position) {
		super(position)
		this.create('green')
	}

}

// 炸弹顶点爆炸buff
class TimeBoomBuff extends Buff {
	constructor(position) {
		super(position)
		this.create('black')
	}
}

// 穿墙buff
class CrossWallBuff extends Buff {
	constructor(position) {
		super(position)
		this.create('pink')
	}
}

// 炸弹爆炸范围buff
class SuperBoomBuff extends Buff {
	constructor(position) {
		super(position)
		this.create('gray')
	}
}

class Door extends Buff {

	constructor(position) {
		super(position)
		this.create('#ff0')
	}

	update() {}

}

class Wall extends CoreObject {
	constructor(position, destructible) {
		super(position)
		this.destructible = destructible
		this.create()
		this.eventBind()
	}

	// 是否可以被破坏
	destructible = false
	// 位置
	position = []
	// canvas 对象实例
	instance

	create() {
		const wall = new Konva.Rect({
			x: this.x * UNIT,
			y: this.y * UNIT,
			width: UNIT,
			height: UNIT,
			fill: this.destructible ? 'blue' : 'yellow',
		})
		Layer.add(wall)
	}

	onMonsterMove({ x, y }) {
		
	}

	eventBind() {
		EventEmitter.addListener(EMITTER_TARGET_MOVE, this.onMonsterMove)
	}

	eventUnBind() {
		EventEmitter.addListener(EMITTER_TARGET_MOVE, this.onMonsterMove)
	}

	destroy() {
		super.destroy()

	}

}

class Monster extends CoreObject {

	constructor(position, image) {
		super(position)
		this.create(image)
		// this.timer = setInterval(this.move.bind(this), 1000 / 60)
	}

	// 移动速度
	speed = 10
	// 可穿越
	crossable = false

	// 运动方向 
	direction 
	// 运动距离  
	moveCounter = 0 

	timer 

	create(image) {
		this.instance = new Konva.Rect({
			x: this.x * UNIT,
			y: this.y * UNIT,
			width: UNIT,
			height: UNIT,
			fill: image,
			// 后期换成图片
		})
		Layer.add(this.instance)
	}

	move() {
		if(this.moveCounter === 0) {
			// left top right bottom 
			const directions = [ [-1, 0], [0, -1], [1, 0], [0, 1] ]
			this.direction = directions[Math.floor(Math.random() * directions.length)]
			this.moveCounter = Math.floor(Math.random() * (1 + 8) + 1) * 100 
		}
		this.moveCounter -- 
		const [ deltaX, deltaY ] = this.direction
		const newX = this.x + deltaX * MOVE_UNIT / UNIT
		const newY = this.y + deltaY * MOVE_UNIT / UNIT
		const newPosition = {
			x: newX,
			y: newY
		}
		this.updatePosition(newPosition)
		EventEmitter.emit(EMITTER_TARGET_MOVE, newPosition)
	}

	start() {
		super.start()
		this.timer = setInterval(this.move, 1000 / 60)
	}

	stop() {
		super.stop()
		clearInterval(this.time)
	}

	destroy() {
		super.destroy()
		clearInterval(this.timer)
	}
	
}

// 气球怪
class BalloonMonster extends Monster {
	constructor(position) {
		super(position, '#f0f')
	}	
}

// 穿墙怪
class CrossWallMonster extends Monster {
	crossable = true
	constructor(position) {
		super(position, '#ef0')
	}	
}

// 高速怪
class SpeedMonster extends Monster {
	speed = this.speed * 2
	constructor(position) {
		super(position, '#0ff')
	}
}

class Game {
	constructor() {
		this.init()
	}

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
		return LEVEL_MAP[this.level - 1]
	}

	init() {
		const { wall, destructibleWall, monster, time, buff } = this.levelData
		this.timeout = time
		wall.forEach(this.createWall.bind(this, false))
		destructibleWall.forEach(this.createWall.bind(this, true))
		monster.forEach(this.createMonster.bind(this))
		buff.forEach(this.createBuff.bind(this))
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
		const monster = new (getMonster(type))(position)
		this.monster.push(monster)
	}

	// 创建buff
	createBuff([type, ...position]) {
		const buff = new (getBuff(type))(position)
		this.buff.push(buff)
	}

	// 创建门
	initDoor() {
		const { destructibleWall } = this.levelData
		const index = Math.floor(Math.random() * destructibleWall.length)
		this.door = new Door(destructibleWall[index])
	}

	// 创建角色
	initPerson() {
		this.person = new Person([1, 2])
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
