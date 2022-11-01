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
const BoomButton = query(".action-k")
const StopButton = query(".action-p")

document.addEventListener('keydown', (e) => {
	const key = e.key.toUpperCase() 
	const moveMap = {
		W: [EMITTER_TOP_OP, { deltaX: 0, deltaY: -1 }],
		S: [EMITTER_BOTTOM_OP, { deltaX: 0, deltaY: 1 }],
		A: [EMITTER_LEFT_OP, { deltaX: -1, deltaY: 0 }],
		D: [EMITTER_RIGHT_OP, { deltaX: 1, deltaY: 0 }],
	}
	if(Object.keys(moveMap).includes(key)) {
		EventEmitter.emit(...moveMap[key])
	}
})

document.addEventListener('keyup', (e) => {
	const key = e.key.toUpperCase() 
	const actionMap = {
		J: EMITTER_DROP_OP,
		K: EMITTER_BOOM_OP,
		P: EMITTER_START_OP,
	}
	if(Object.keys(actionMap).includes(key)) {
		EventEmitter.emit(actionMap[key])
	}
})

LeftMoveButton.addEventListener('mousedown', () => {
	
})
RightMoveButton.addEventListener('mousedown', () => {
	
})
TopMoveButton.addEventListener('mousedown', () => {
	
})
BottomMoveButton.addEventListener('mousedown', () => {
	
})
LeftMoveButton.addEventListener('mouseup', () => {
	
})
RightMoveButton.addEventListener('mouseup', () => {
	
})
TopMoveButton.addEventListener('mouseup', () => {
	
})
BottomMoveButton.addEventListener('mouseup', () => {
	
})
DropButton.addEventListener('click', () => {
	EventEmitter.emit(EMITTER_DROP_OP)
})
BoomButton.addEventListener('click', () => {
	EventEmitter.emit(EMITTER_BOOM_OP)
})
StopButton.addEventListener('click', () => {
	EventEmitter.emit(EMITTER_START_OP)
})

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

// 销毁
const EMITTER_DESTROY = "EMITTER_DESTROY"
// 游戏结束
const EMITTER_GAME_OVER = "EMITTER_GAME_OVER"
// 墙被摧毁
const EMITTER_WALL_DESTROY = "EMITTER_WALL_DESTROY"
// 怪物创建
const EMITTER_MONSTER_CREATE = "EMITTER_MONSTER_CREATE"
// 怪物移动
const EMITTER_MONSTER_MOVE = "EMITTER_MONSTER_MOVE"
// 人物移动
const EMITTER_PERSON_MOVE = "EMITTER_PERSON_MOVE"
// 左移动操作
const EMITTER_LEFT_OP = "EMITTER_LEFT_OP"
// 右移动操作
const EMITTER_RIGHT_OP = "EMITTER_RIGHT_OP"
// 上移动操作
const EMITTER_TOP_OP = "EMITTER_TOP_OP"
// 下移动操作
const EMITTER_BOTTOM_OP = "EMITTER_BOTTOM_OP"
// 放炸弹操作
const EMITTER_DROP_OP = "EMITTER_DROP_OP"
// 释放炸弹操作
const EMITTER_BOOM_OP = "EMITTER_BOOM_OP"
// 开始暂停操作
const EMITTER_START_OP = "EMITTER_START_OP"
// 进入下一关操作
const EMITTER_NEXT_OP = "EMITTER_NEXT_OP"
const EventEmitter = new EventEmitter3()

// Object

class CoreObject {

	// 在这里监听unit改变

	constructor(position) {
		this.id = idCounter++
		this.x = position[0]
		this.y = position[1]
		this.eventBind = this.eventBind.bind(this)
		this.eventUnBind = this.eventUnBind.bind(this)
		this.destroy = this.destroy.bind(this)
	}

	x = 0
	y = 0
	instance 
	loading = false 
	id

	create() {}

	eventBind() {
		EventEmitter.once(EMITTER_DESTROY, this.destroy)
	}

	eventUnBind() {

	}

	updatePosition(position) {
		if(position) {
			this.x = position.x
			this.y = position.y
		}
		this.instance && this.instance.absolutePosition({ x: this.x * UNIT, y: this.y * UNIT })
	}

	update() {}

	destroy() {
		this.instance && this.instance.destroy()
		this.eventUnBind()
	}

	stop() {

	}

	start() {

	}

}

// 角色
class Person extends CoreObject {

	constructor(position, life) {
		super(position)
		this.create()
		this.life = life 
		this.eventBind()
	}

	type = 'PERSON'

	// buff 
	boom = new BoomFactory()
	// 穿墙
	crossable = false
	life = 3

	create() {
		this.instance = new Konva.Rect({
			x: this.x * UNIT,
			y: this.y * UNIT,
			width: UNIT,
			height: UNIT,
			fill: 'red'
		})
		Layer.add(this.instance)
		EventEmitter.emit(EMITTER_PERSON_MOVE, this, { x: this.x, y: this.y }, () => {})
	}

	die() {
		this.life--
		EventEmitter.emit(EMITTER_GAME_OVER, this.life)
	}

	move({ deltaX, deltaY }) {
		if(this.loading) return 
		this.loading = true 
		const newX = this.x + deltaX * MOVE_UNIT * 20 / UNIT
		const newY = this.y + deltaY * MOVE_UNIT * 20 / UNIT
		const newPosition = {
			x: toFixed4(newX),
			y: toFixed4(newY)
		}
		// 碰到障碍墙
		if(knockWall(newPosition)) {
			this.loading = false 
			console.log('person knocked wall')
			return 
		}
		let counter = EventEmitter.listenerCount(EMITTER_PERSON_MOVE)
		if(counter === 0) {
			this.updatePosition(newPosition)		
			this.loading = false 
			return 
		}
		let knocked = false 
		let knockType 
		EventEmitter.emit(EMITTER_PERSON_MOVE, this, newPosition, (type, isKnock) => {
			counter -- 
			if(isKnock) {
				knocked = true 
				knockType = type 
			}
			if(counter === 0) {
				if(knocked && knockType !== 'BUFF') {
					switch(knockType) {
						case 'MONSTER':
						case 'BOOM':
							this.die()
							break 
						default:
							console.log('hello world')
					}
				}else {
					this.updatePosition(newPosition)		
				}
				this.loading = false 
			}
		})
	}

	dropBoom() {
		this.boom.create({ x: this.x, y: this.y })
	}

	boomedBoom() {
		this.boom.boom()
	}

	onTargetMove(instance, position, onKnock) {
		const isKnock = knockJudge({ x: this.x, y: this.y }, { ...position })
		if(isKnock) {
			this.die()
		}
		onKnock(this.type, isKnock)
	}

	eventBind() {
		super.eventBind()
		EventEmitter.addListener(EMITTER_LEFT_OP, this.move, this)
		EventEmitter.addListener(EMITTER_RIGHT_OP, this.move, this)
		EventEmitter.addListener(EMITTER_TOP_OP, this.move, this)
		EventEmitter.addListener(EMITTER_BOTTOM_OP, this.move, this)
		
		EventEmitter.addListener(EMITTER_DROP_OP, this.dropBoom, this)
		EventEmitter.addListener(EMITTER_BOOM_OP, this.boomedBoom, this)

		EventEmitter.addListener(EMITTER_MONSTER_MOVE, this.onTargetMove, this)

	}

	eventUnBind() {
		super.eventBind()
		EventEmitter.removeListener(EMITTER_LEFT_OP, this.move, this)
		EventEmitter.removeListener(EMITTER_RIGHT_OP, this.move, this)
		EventEmitter.removeListener(EMITTER_TOP_OP, this.move, this)
		EventEmitter.removeListener(EMITTER_BOTTOM_OP, this.move, this)

		EventEmitter.removeListener(EMITTER_DROP_OP, this.dropBoom, this)
		EventEmitter.removeListener(EMITTER_BOOM_OP, this.boomedBoom, this)

		EventEmitter.removeListener(EMITTER_MONSTER_MOVE, this.onTargetMove, this)

	}

}

// 炸弹
class Boom extends CoreObject {

	constructor(position, options) {
		super(position)
		const { onBoom, multipleState, timeState, hugeState } = options 
		this.onBoom = onBoom
		this.multipleState = multipleState
		this.timeState = timeState 
		this.hugeState = hugeState 
		this.create()
		this.eventBind()
	}

	type = 'BOOM'

	multipleState = false
	timeState = false
	hugeState = false

	onBoom 
	timeout 
	timeoutStart
	timeoutRest = 5000 
	timer 

	initBoomInstace
	boomVertical 
	boomHorizontal

	onTargetMove = (instance, position, onKnock) => {
		const isKnock = knockJudge(position, { x: this.x, y: this.y })
		onKnock(this.type, isKnock)
	}

	eventBind = () => {
		super.eventBind()
		EventEmitter.addListener(EMITTER_PERSON_MOVE, this.onTargetMove, this)
		EventEmitter.addListener(EMITTER_MONSTER_MOVE, this.onTargetMove, this)
	}

	eventUnBind = () => {
		super.eventBind()
		EventEmitter.removeListener(EMITTER_PERSON_MOVE, this.onTargetMove, this)
		EventEmitter.removeListener(EMITTER_MONSTER_MOVE, this.onTargetMove, this)
	}

	create() {
		this.initBoomInstace = new Konva.Rect({
			x: this.x * UNIT,
			y: this.y * UNIT,
			width: UNIT,
			height: UNIT,
			// 后面改成图片
			fill: '#CCFFFF',
		})
		Layer.add(this.initBoomInstace)
		if(!this.timeState) this.boom()
	}

	// 立刻爆炸
	immediateBoom() {
		console.log(this, 22222)
		this.onBoom(this.id)
		return 
		this.timer = setInterval(() => {
			// init 
			if(!this.boomVertical) {
				this.initBoomInstace.destroy()
				const commonState = {
					boom: false,
					x: this.x,
					y: this.y,
					width: UNIT,
					height: UNIT,fill
				}
				this.boomVertical = {
					...commonState,
					instance: new Konva.Rect({
						x: commonState.x * UNIT,
						y: commonState.y * UNIT
					})
				}
				this.boomHorizontal = {
					...commonState,
					instance: new Konva.Rect({
						x: commonState.x * UNIT,
						y: commonState.y * UNIT
					})
				}
				Layer.add(this.boomVertical.instance)
				Layer.add(this.boomHorizontal.instance)
				return 
			}
			// destroy 
			if(this.boomVertical.boom && this.boomHorizontal.boom) {
				clearInterval(this.timer)
				this.boomVertical.instance.destroy()
				this.boomHorizontal.instance.destroy()
				this.onBoom(this.id)
				return 
			}
			// update 
			if(!this.boomVertical.boom) {
				this.boomVertical.x = 
				this.boomVertical.instance.absolutePosition({
					
				})
			}
			if(!this.boomHorizontal.boom) {

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

	destroy() {
		super.destroy() 
		this.initBoomInstace.destroy()
	}

	stop() {
		if(this.timeoutRest !== 0) {
			this.timeoutRest = Date.now() - this.timeoutStart
			clearTimeout(this.timeout)
		}
		if(this.timeState) {
			clearInterval(this.timer)
		}
	}
}

class BoomFactory {

	constructor() {
		
	}

	multipleState = false
	timeState = false
	hugeState = false

	boomMap = {

	}

	onBoom(id) {
		delete this.boomMap[id]
	}

	create(position) {
		if(Object.keys(this.boomMap).length >= (this.multipleState ? 5 : 1)) return
		const { x, y } = position 
		const boom = new Boom([Math.round(x), Math.round(y)], {
			onBoom: this.onBoom,
			multipleState: this.multipleState,
			timeState: this.timeState,
			hugeState: this.hugeState
		})
		this.boomMap[boom.id] = boom 
	}

	boom() {
		const targetId = Math.min(...Object.keys(this.boomMap))	
		!!this.boomMap[targetId] && this.boomMap[targetId].immediateBoom()
	}

}

class Buff extends CoreObject {

  display = false 

	constructor(position, image) {
		super(position)
		this.create(image)
		this.eventBind()
	}

	 type = 'BUFF'

	create(image) {
		this.instance = new Konva.Rect({
			x: this.x * UNIT,
			y: this.y * UNIT,
			width: UNIT,
			height: UNIT,
			// 后面改成图片
			fill: this.display ? image : 'transparent',
		})
		Layer.add(this.instance)
	}

	onTargetMove(instance, position, onKnock) {
		const isKnock = !!this.display && knockJudge(position, { x: this.x, y: this.y })
		onKnock(this.type, isKnock)
		if(isKnock) {
			this.destroy()
		}
	}

	onWallDestroy(position) {
		if (position[0] === this.x && position[1] === this.y) this.display = true
	}

	eventBind = () => {
		super.eventBind()
		EventEmitter.addListener(EMITTER_WALL_DESTROY, this.onWallDestroy, this)
		EventEmitter.addListener(EMITTER_PERSON_MOVE, this.onTargetMove, this)
	}

	eventUnBind = () => {
		super.eventBind()
		EventEmitter.removeListener(EMITTER_WALL_DESTROY, this.onWallDestroy, this)
		EventEmitter.removeListener(EMITTER_PERSON_MOVE, this.onTargetMove, this)
	}
}

// 连放炸弹buff
class LoopBuff extends Buff {

	constructor(position) {
		super(position, 'green')
	}

	onTargetMove(instance, position, onKnock) {
		super.onTargetMove(instance, position, (type, isKnock) => {
			onKnock(type, isKnock)
			if(isKnock) instance.boom.multipleState = true 
		}) 
	}

}

// 炸弹定点爆炸buff
class TimeBoomBuff extends Buff {
	constructor(position) {
		super(position, 'black')
	}
	onTargetMove(instance, position, onKnock) {
		super.onTargetMove(instance, position, (type, isKnock) => {
			onKnock(type, isKnock)
			if(isKnock) instance.boom.timeState = true 
		}) 
	}
}

// 穿墙buff
class CrossWallBuff extends Buff {
	constructor(position) {
		super(position, 'pink')
	}
	onTargetMove(instance, position, onKnock) {
		super.onTargetMove(instance, position, (type, isKnock) => {
			onKnock(type, isKnock)
			if(isKnock) instance.crossable = true 
		}) 
	}
}

// 炸弹爆炸范围buff
class SuperBoomBuff extends Buff {
	constructor(position) {
		super(position, 'gray')
	}
	onTargetMove(instance, position, onKnock) {
		super.onTargetMove(instance, position, (type, isKnock) => {
			onKnock(type, isKnock)
			if(isKnock) instance.boom.huge = true 
		}) 
	}
}

class Door extends Buff {

	constructor(position) {
		super(position, '#3f0')
	}

	type = 'DOOR'

	onTargetMove(instance, position, onKnock) {
		if(EventEmitter.listenerCount(EMITTER_MONSTER_CREATE) !== 0) {
			return onKnock(this.type, false)
		}
		super.onTargetMove(instance, position, (type, isKnock) => {
			onKnock(this.type, isKnock)
			if(isKnock) {
				EventEmitter.emit(EMITTER_NEXT_OP)
			}
		}) 
	}

}

class Wall extends CoreObject {
	constructor(position, destructible) {
		super(position)
		this.destructible = destructible
		this.create()
		this.destructible && this.eventBind()
	}

	// 是否可以被破坏
	destructible = false
	// 位置
	position = []
	type = 'WALL'

	create() {
		this.instance = new Konva.Rect({
			x: this.x * UNIT,
			y: this.y * UNIT,
			width: UNIT,
			height: UNIT,
			fill: this.destructible ? 'blue' : 'yellow',
		})
		Layer.add(this.instance)
	}

	onTargetMove(instance, position, onKnock) {
		const isKnock = knockJudge({ x: this.x, y: this.y }, { ...position })
		onKnock(this.type, isKnock)
	}

	eventBind() {
		super.eventBind()
		EventEmitter.addListener(EMITTER_PERSON_MOVE, this.onTargetMove, this)
		EventEmitter.addListener(EMITTER_MONSTER_MOVE, this.onTargetMove, this)
	}

	eventUnBind() {
		super.eventUnBind()
		EventEmitter.removeListener(EMITTER_PERSON_MOVE, this.onTargetMove, this)
		EventEmitter.removeListener(EMITTER_MONSTER_MOVE, this.onTargetMove, this)
	}

}

class Monster extends CoreObject {

	constructor(position, image) {
		super(position)
		this.create(image)
		this.eventBind()
		this.timer = setInterval(this.move, 1000 / 60)
		this.move = this.move.bind(this)
	}

	type = "MONSTER"

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

	move = () => {
		if(this.loading) return 
		this.loading = true 
		if(this.moveCounter === 0) {
			// left top right bottom 
			const directions = [ [-1, 0], [0, -1], [1, 0], [0, 1] ]
			const moveCounters = [1, 3, 5, 7, 9] 
			this.direction = directions[Math.floor(Math.random() * directions.length)]
			this.moveCounter = moveCounters[Math.floor(Math.random() * moveCounters.length)] * 100 
		}
		this.moveCounter -- 
		const [ deltaX, deltaY ] = this.direction
		const newX = this.x + deltaX * MOVE_UNIT / UNIT
		const newY = this.y + deltaY * MOVE_UNIT / UNIT
		const newPosition = {
			x: toFixed4(newX),
			y: toFixed4(newY)
		}
		// 碰到障碍墙
		if(knockWall(newPosition)) {
			this.moveCounter = 0
			this.loading = false 
			console.log('monster knock the undestructible wall')
			return 
		}
		let counter = EventEmitter.listenerCount(EMITTER_MONSTER_MOVE)
		if(counter === 0) {
			this.updatePosition(newPosition)		
			this.loading = false 
			return 
		}
		let knocked = false 
		let knockType 
		EventEmitter.emit(EMITTER_MONSTER_MOVE, this, newPosition, (type, isKnock) => {
			counter -- 
			if(isKnock) {
				knocked = true 
				knockType = type 
			}
			if(counter === 0) {
				if(knocked) {
					console.log('monster knocked', knockType)
					this.moveCounter = 0
				}else {
					this.updatePosition(newPosition)		
				}
				this.loading = false 
			}
		})
	}

	onTargetMove(instance, position, onKnock) {
		const isKnock = knockJudge(position, { x: this.x, y: this.y })
		onKnock(this.type, isKnock)
	}

	createMonster() {/** Prefix */}

	eventBind() {
		super.eventBind()
		EventEmitter.addListener(EMITTER_PERSON_MOVE, this.onTargetMove, this)
		EventEmitter.addListener(EMITTER_MONSTER_CREATE, this.createMonster, this)
	}

	eventUnBind() {
		super.eventUnBind()
		EventEmitter.removeListener(EMITTER_PERSON_MOVE, this.onTargetMove, this)
		EventEmitter.removeListener(EMITTER_MONSTER_CREATE, this.createMonster, this)
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
		super.destroy()
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

function createGamePrompt({
	content,
	onRestart,
	timeout
}) {
	const group = new Konva.Group({
		width: CANVAS_WIDTH,
		height: CANVAS_HEIGHT,
		x: 0,
		y: 0 
	}) 
	group.add(new Konva.Rect({
		width: CANVAS_WIDTH,
		height: CANVAS_HEIGHT,
		x: 0,
		y: 0,
		fill: 'rgba(0, 0, 0, 0.3)',
	}))
	Layer.add(group)
	const commonFontConfig = {
		align: 'center',
		verticalAlign: 'center',
		fontSize: CANVAS_WIDTH / 50,
		x: Stage.width() / 2,
    y: Stage.height() / 2,
		fill: '#fff',
	}
	const text = new Konva.Text({
		...commonFontConfig,
		text: content,
	})
	text.offsetX(text.width() / 2)
	text.offsetY(text.height() / 2)

	if(!~timeout) {
		text.on('click', () => {
			group.destroy() 
			onRestart()
		})
	}

	group.add(text)
	if(!!~timeout) {
		setTimeout(() => {
			group.destroy()
			onRestart()
		}, timeout)
	}
}

class Game {
	constructor() {
		this.init()
		this.eventBind()
	}

	timer
	timeout = 240

	level = 1
	person
	personLife = 3 

	loading = false 

	get levelData() {
		return LEVEL_MAP[this.level - 1]
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

		// setTimeout(() => {
		// 	this.onNext()
		// }, 5000)

	}

	// 创建障碍墙
	createWall(destructible, position) {
		new Wall(position, destructible)
	}

	// 创建怪物
	createMonster([type, ...position]) {
		new (getMonster(type))(position)
	}

	// 创建buff
	createBuff([type, ...position]) {
		new (getBuff(type))(position)
	}

	// 创建门
	initDoor() {
		const { destructibleWall } = this.levelData
		const index = Math.floor(Math.random() * destructibleWall.length)
		new Door(destructibleWall[index])
	}

	// 创建角色
	initPerson() {
		this.person = new Person([1, 2], this.personLife)
	}

	onGameOver(life) {
		if(this.loading) return 
		this.loading = true 
		this.personLife = typeof life === 'number' ? life : (this.personLife - 1)
		this.destroy()
		if(this.personLife !== 0) {
			createGamePrompt({
				content: `你已阵亡！（还剩${this.personLife}次机会）`,
				onRestart: this.restart.bind(this),
				timeout: 3000 
			})
		}else {
			createGamePrompt({
				content: `你已阵亡！点我继续(*^▽^*)`,
				onRestart: this.restart.bind(this),
				timeout: -1 
			})	
		}
	}

	onNext() {
		this.destroy()
		if(this.level === LEVEL_MAP.length) {
			createGamePrompt({
				content: '恭喜通关！！！点我重玩(*^▽^*)',
				onRestart: () => {
					this.level = 1
					this.personLife = 3 
					this.restart()
				},
				timeout: -1 
			})	
		}else {
			this.level ++
			createGamePrompt({
				content: `恭喜通过本关！！即将进入下一关`,
				onRestart: this.restart.bind(this),
				timeout: 3000 
			})	
		}
	}

	eventBind() {
		EventEmitter.addListener(EMITTER_GAME_OVER, this.onGameOver, this)
		EventEmitter.addListener(EMITTER_NEXT_OP, this.onNext, this)
	}

	eventUnBind() {
		EventEmitter.removeListener(EMITTER_GAME_OVER, this.onGameOver, this)
		EventEmitter.removeListener(EMITTER_NEXT_OP, this.onNext, this)
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
		EventEmitter.emit(EMITTER_DESTROY)
	}

	restart() {
		this.loading = false 
		this.destroy()
		this.eventUnBind()
		this.init()
	}
}

new Game()
