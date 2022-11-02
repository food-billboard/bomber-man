// Function

function toBeGod() {}
function stopGame() {
	isStart = !isStart
	StopButton.innerHTML = isStart ? '暂停' : '开始';
	startPrompt && startPrompt();
	if(!isStart) {
		startPrompt = createGamePrompt({
			content: '游戏暂停(*^▽^*)',
			timeout: -1,
			onRestart: () => {
				startPrompt && startPrompt()
				isStart = true 
				EventEmitter.emit(EMITTER_START_OP)
			}
		})
	}
	EventEmitter.emit(EMITTER_START_OP)
}
function getInfo(target) {
	return {
		x: target.x(),
		y: target.y(),
		width: target.width(),
		height: target.height(),
	}
}

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

const TimeContent = query('.banner .banner-time')

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
		if(key === 'P') {
			stopGame()
		}else {
			EventEmitter.emit(actionMap[key])
		}
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
StopButton.addEventListener('click', stopGame)

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
// 游戏状态
let isStart = true  
let startPrompt 

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
// 炸弹创建
const EMITTER_BOOM_CREATE = "EMITTER_BOOM_CREATE"
// 放炸弹操作
const EMITTER_DROP_OP = "EMITTER_DROP_OP"
// 释放炸弹操作
const EMITTER_BOOM_OP = "EMITTER_BOOM_OP"
// 开始暂停操作
const EMITTER_START_OP = "EMITTER_START_OP"
// 进入下一关操作
const EMITTER_NEXT_OP = "EMITTER_NEXT_OP"
// 全局动画
const EMITTER_TIMER = "EMITTER_TIMER"
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
	disabled = false 
	id

	create() {}

	actionWrapper(action) {
		const that = this 
		return function(...args) {
			if(that.disabled) return 
			action.call(that, ...args)
		}
	}

	eventBind() {
		EventEmitter.once(EMITTER_DESTROY, this.destroy)
		EventEmitter.addListener(EMITTER_START_OP, this.onStart, this)
	}

	eventUnBind() {
		EventEmitter.removeListener(EMITTER_START_OP, this.onStart, this)
	}

	updatePosition(position) {
		if(position) {
			this.x = position.x
			this.y = position.y
		}
		this.instance && this.instance.absolutePosition({ x: this.x * UNIT, y: this.y * UNIT })
	}

	destroy() {
		this.instance && this.instance.destroy()
		this.eventUnBind()
	}

	onStart() {
		isStart ? this.start() : this.stop()
	}

	stop() {
		this.disabled = true 
	}

	start() {
		this.disabled = false 
	}

}

// 角色
class Person extends CoreObject {

	constructor(position, life) {
		super(position)
		this.create()
		this.life = life
		this.move = this.actionWrapper(this.move) 
		this.dropBoom = this.actionWrapper(this.dropBoom)
		this.eventBind()
	}

	type = 'PERSON'

	// buff 
	boom = new BoomFactory()
	// 穿墙
	crossable = false
	life = 3

	create() {
		this.instance = new Konva.Image({
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
						case 'BOOM-D':
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
		const position = {
			x: this.x, 
			y: this.y
		}
		this.boom.create(position)
		this.move({
			deltaX: this.x,
			deltaY: this.y 
		})
		const counter = EventEmitter.listenerCount(EMITTER_DROP_OP)
		EventEmitter.emit(EMITTER_BOOM_CREATE, position, () => {
			if(counter === 0) {

			}
		})
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

	onBoomCreate() {

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

		EventEmitter.addListener(EMITTER_BOOM_CREATE, this.onBoomCreate, this)
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

		EventEmitter.removeListener(EMITTER_BOOM_CREATE, this.onBoomCreate, this)

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
	// timeing wait boom destroy 
	timeStep = 0
	timeoutStart
	timeoutRest = 5000 

	initBoomInstace
	boomVertical 
	boomHorizontal

	onTargetMove = (instance, position, onKnock) => {
		const isKnock = knockJudge(position, { x: this.x, y: this.y })
		onKnock(this.type + (this.timeStep != 2 ? '-L' : '-D'), isKnock)
	}

	eventBind = () => {
		super.eventBind()
		EventEmitter.addListener(EMITTER_PERSON_MOVE, this.onTargetMove, this)
		EventEmitter.addListener(EMITTER_MONSTER_MOVE, this.onTargetMove, this)
		EventEmitter.addListener(EMITTER_TIMER, this.animation, this)
	}

	eventUnBind = () => {
		super.eventBind()
		EventEmitter.removeListener(EMITTER_PERSON_MOVE, this.onTargetMove, this)
		EventEmitter.removeListener(EMITTER_MONSTER_MOVE, this.onTargetMove, this)
		EventEmitter.removeListener(EMITTER_TIMER, this.animation, this)
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
		this.timeoutStart = Date.now() 
		if(this.timeState) this.timeStep = 1
	}

	animation() {
		if(this.timeStep === 0) {
			this.timeoutRest -= (Date.now() - this.timeoutStart)
			this.timeoutStart = Date.now() 
			if(this.timeoutRest <= 0) this.timeStep += 2
		}else if(this.timeStep === 2) {
			this.immediateBoom()
		}
	}

	// 立刻爆炸
	immediateBoom() {
		// init 
		if(!this.boomVertical) {
			this.initBoomInstace.destroy()
			this.boomVertical = {
				boomStart: false,
				boomEnd: false,
				instance: new Konva.Rect({
					x: this.x * UNIT,
					y: this.y * UNIT,
					width: UNIT,
					height: UNIT
				})
			}
			this.boomHorizontal = {
				boomStart: false,
				boomEnd: false,
				instance: new Konva.Rect({
					x: this.x * UNIT,
					y: this.y * UNIT,
					width: UNIT,
					height: UNIT
				})
			}
			Layer.add(this.boomVertical.instance)
			Layer.add(this.boomHorizontal.instance)
			return 
		}
		// destroy 
		if(this.boomVertical.boomStart && this.boomHorizontal.boomStart && this.boomVertical.boomEnd && this.boomHorizontal.boomEnd) {
			this.timeStep = 3 
			this.boomVertical.instance.destroy()
			this.boomHorizontal.instance.destroy()
			this.onBoom(this.id)
			return 
		}
		// update 
		if(!this.boomVertical.boomStart || !this.boomVertical.boomEnd) {
			let newPosition = getInfo(this.boomVertical.instance)
			if(!this.boomVertical.boomStart) {
				const templatePosition = {
					...newPosition,
					y: newPosition.y - UNIT,
					height: newPosition.height + UNIT
				}
				const x = Math.floor(templatePosition.x / UNIT)
				const y = Math.floor(templatePosition.y / UNIT)
				this.boomVertical.boomStart = knockWall[x, y]
				if(!this.boomVertical.boomStart) {
					newPosition = {
						...newPosition,
						...templatePosition
					}
				}
			}
			if(!this.boomVertical.boomEnd) {
				const templatePosition = {
					...newPosition,
					height: newPosition.height + UNIT
				}
				const x = Math.floor(templatePosition.x / UNIT)
				const y = Math.floor(templatePosition.y / UNIT)
				const height = Math.floor(templatePosition.height / UNIT)
				this.boomVertical.boomEnd = knockWall[x, y + height - 1]
				if(!this.boomVertical.boomEnd) {
					newPosition = {
						...newPosition,
						...templatePosition
					}
				}
			}
			const { y, height } = newPosition
			this.boomVertical.instance.y(y * UNIT)
			this.boomVertical.instance.height(height * UNIT)
		}
		if(!this.boomHorizontal.boomStart || !this.boomHorizontal.boomEnd) {
			let newPosition = getInfo(this.boomHorizontal.instance)
			if(!this.boomHorizontal.boomStart) {
				const templatePosition = {
					...newPosition,
					x: newPosition.x - UNIT,
					width: newPosition.width + UNIT
				}
				const x = Math.floor(templatePosition.x / UNIT)
				const y = Math.floor(templatePosition.y / UNIT)
				this.boomHorizontal.boomStart = knockWall[x, y]
				if(!this.boomHorizontal.boomStart) {
					newPosition = {
						...newPosition,
						...templatePosition
					}
				}
			}
			if(!this.boomHorizontal.boomEnd) {
				const templatePosition = {
					...newPosition,
					width: newPosition.width + UNIT
				}
				const x = Math.floor(templatePosition.x / UNIT)
				const y = Math.floor(templatePosition.y / UNIT)
				const width = Math.floor(templatePosition.width / UNIT)
				this.boomHorizontal.boomEnd = knockWall[x + width - 1, y]
				if(!this.boomHorizontal.boomEnd) {
					newPosition = {
						...newPosition,
						...templatePosition
					}
				}
			}
			const { x, width } = newPosition
			this.boomHorizontal.instance.x(x * UNIT)
			this.boomHorizontal.instance.width(width * UNIT)
		}
	}

	destroy() {
		super.destroy() 
		try {
			this.initBoomInstace.destroy()
			this.boomVertical.instance.destroy() 
			this.boomHorizontal.instance.destroy()
		}catch(err) {}
	}
}

class BoomFactory {

	multipleState = false
	timeState = false
	hugeState = false

	boomMap = {}

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
		this.instance = new Konva.Image({
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
		super(position, DOOR)
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
		loader(this.destructible ? DESTRUCTIBLE_WALL : UN_DESTRUCTIBLE_WALL, (image) => {
			this.instance = new Konva.Image({
				x: this.x * UNIT,
				y: this.y * UNIT,
				width: UNIT,
				height: UNIT,
				fillPatternImage: image,
			})
			Layer.add(this.instance)
		})
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
	}

	type = "MONSTER"

	// 移动速度
	speed = 1
	// 可穿越
	crossable = false

	// 运动方向 
	direction 
	// 运动距离  
	moveCounter = 0 

	create(image) {
		loader(image, image => {
			this.instance = new Konva.Image({
				x: this.x * UNIT,
				y: this.y * UNIT,
				width: UNIT,
				height: UNIT,
				image: image,
			})
			Layer.add(this.instance)
		})
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
		const newX = this.x + deltaX * MOVE_UNIT * this.speed / UNIT
		const newY = this.y + deltaY * MOVE_UNIT * this.speed / UNIT
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
				if(!this.crossable || type !== 'WALL') {
					knocked = true 
					knockType = type 
				}
			}
			if(counter === 0) {
				if(knocked) {
					switch(type) {
						case 'BOOM-D':
							this.destroy()
							break 
						default: 
							console.log('monster knocked', knockType)
							this.moveCounter = 0		
					}
				}else {
					this.updatePosition(newPosition)		
				}
				this.loading = false 
			}
		})
	}

	onCreateBoom(position) {

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
		EventEmitter.addListener(EMITTER_TIMER, this.move, this)
		EventEmitter.addListener(EMITTER_BOOM_CREATE, this.onCreateBoom, this)
	}

	eventUnBind() {
		super.eventUnBind()
		EventEmitter.removeListener(EMITTER_PERSON_MOVE, this.onTargetMove, this)
		EventEmitter.removeListener(EMITTER_MONSTER_CREATE, this.createMonster, this)
		EventEmitter.removeListener(EMITTER_TIMER, this.move, this)
		EventEmitter.removeListener(EMITTER_BOOM_CREATE, this.onCreateBoom, this)
	}
	
}

// 气球怪
class BalloonMonster extends Monster {
	constructor(position) {
		super(position, BALLOON_MONSTER)
	}	
}

// 穿墙怪
class CrossWallMonster extends Monster {
	crossable = true
	constructor(position) {
		super(position, CROSS_MONSTER)
	}	
}

// 高速怪
class SpeedMonster extends Monster {
	speed = this.speed * 3
	constructor(position) {
		super(position, SPEED_MONSTER)
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
	return group.destroy.bind(group)
}

class Game {
	constructor() {
		this.init()
		this.eventBind()
	}

	animationTimer 
	timer
	timeout = 480

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
		this.start()
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
				onRestart: () => {
					this.personLife = 3 
					this.restart()
				},
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

	onStart() {
		isStart ? this.start() : this.stop()
	}

	eventBind() {
		EventEmitter.addListener(EMITTER_GAME_OVER, this.onGameOver, this)
		EventEmitter.addListener(EMITTER_NEXT_OP, this.onNext, this)
		EventEmitter.addListener(EMITTER_START_OP, this.onStart, this)
	}

	eventUnBind() {
		EventEmitter.removeListener(EMITTER_GAME_OVER, this.onGameOver, this)
		EventEmitter.removeListener(EMITTER_NEXT_OP, this.onNext, this)
		EventEmitter.removeListener(EMITTER_START_OP, this.onStart, this)
	}

	start() {
		TimeContent.innerHTML = this.timeout
		this.timer = setInterval(() => {
			this.timeout--
			TimeContent.innerHTML = this.timeout
			if(this.timeout === 0) {
				this.stop()
				this.onGameOver()
			}
		}, 1000)
		this.animationTimer = setInterval(() => {
			EventEmitter.emit(EMITTER_TIMER)
		}, 1000 / 60)
	}

	stop() {
		clearInterval(this.timer)
		clearInterval(this.animationTimer)
	}

	destroy() {
		EventEmitter.emit(EMITTER_DESTROY)
	}

	restart() {
		this.loading = false 
		this.timeout = 480 
		this.stop()
		this.destroy()
		this.eventUnBind()
		this.init()
	}
}

new Game()