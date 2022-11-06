// Function

function toBeGod() {}
function stopGame() {
	isStart = !isStart
	StopButton.innerHTML = isStart ? "⏺ " : "⏩"
	startPrompt && startPrompt()
	if (!isStart) {
		startPrompt = createGamePrompt({
			content: "游戏暂停(*^▽^*)",
			timeout: -1,
			onRestart: () => {
				startPrompt && startPrompt()
				isStart = true
				EventEmitter.emit(EMITTER_START_OP)
			},
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

function formatInfo(target) {
	const parse = (value) => Math.round(value / UNIT)
	return {
		x: parse(target.x),
		y: parse(target.y),
		width: parse(target.width),
		height: parse(target.height)
	}
}

// type
// LoopBuff TimeBoomBuff SuperBoomBuff
function getBuff(type) {
	switch (type) {
		case "LoopBuff":
			return LoopBuff
		case "TimeBoomBuff":
			return TimeBoomBuff
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

const TimeContent = query(".banner .banner-title-time")
const LevelContent = query(".banner .banner-title-level")

const IS_MOBILE = isMobile.any 

function CreateKeyboardAnimation() {
	let pressMap = {
		W: 0,
		S: 0,
		A: 0,
		D: 0
	}
	let currentList = [] 
	let index = 0 

	const moveMap = {
		W: [EMITTER_TOP_OP, { deltaX: 0, deltaY: -1 }],
		S: [EMITTER_BOTTOM_OP, { deltaX: 0, deltaY: 1 }],
		A: [EMITTER_LEFT_OP, { deltaX: -1, deltaY: 0 }],
		D: [EMITTER_RIGHT_OP, { deltaX: 1, deltaY: 0 }],
	}
	const validKeys = Object.keys(moveMap)

	const isValid = (key) => validKeys.includes(key)

	function press(key) {
		if(!isValid(key)) return 
		const index = currentList.indexOf(key)
		if(!~index) {
			currentList.push(key)
		}else {
			currentList.splice(index, 1)
			currentList.push(key)
		}
		pressMap[key] ++ 
	}

	function animation() {
		index ++ 
		index = index % 5
		if(index === 0 && currentList.length) EventEmitter.emit(...moveMap[currentList[currentList.length - 1]])
	}

	function up(key) {
		if(isValid(key)) {
			pressMap[key] = 0 
			const index = currentList.indexOf(key)
			if(!!~index) currentList.splice(index, 1)
		}
	}

	return {
		press,
		up,
		animation
	}

}
function buttonActionBind(target, key) {
	const start = IS_MOBILE ? 'touchstart' : 'mousedown'
	const end = IS_MOBILE ? 'touchend' : 'mouseup'
	target.addEventListener(start, (e) => {
		e.preventDefault()
		if(!game.loading) {
			createKeyboardAnimation.press(key)
			window.addEventListener(end, (e) => {
				e.preventDefault()
				if(!game.loading) {
					createKeyboardAnimation.up(key)
				}
			})
		}
	})
}

document.addEventListener("keydown", (e) => {
	const key = e.key.toUpperCase()
	if(!game.loading) {
		createKeyboardAnimation.press(key)
	}
})

document.addEventListener("keyup", (e) => {
	const key = e.key.toUpperCase()
	const actionMap = {
		J: EMITTER_DROP_OP,
		K: EMITTER_BOOM_OP,
		P: EMITTER_START_OP,
	}
	if (!game.loading) {
		createKeyboardAnimation.up(key)
		if(Object.keys(actionMap).includes(key)) {
			if (key === "P") {
				stopGame()
			} else {
				EventEmitter.emit(actionMap[key])
			}
		}
	}
})

buttonActionBind(LeftMoveButton, 'A')
buttonActionBind(RightMoveButton, 'D')
buttonActionBind(TopMoveButton, 'W')
buttonActionBind(BottomMoveButton, 'S')

DropButton.addEventListener("click", () => {
	EventEmitter.emit(EMITTER_DROP_OP)
})
BoomButton.addEventListener("click", () => {
	EventEmitter.emit(EMITTER_BOOM_OP)
})
StopButton.addEventListener("click", stopGame)

let CANVAS_WIDTH = document.documentElement.offsetWidth
let CANVAS_HEIGHT = (CANVAS_WIDTH * 13) / 33
const UNIT = CANVAS_WIDTH / 33
// 单步移动
const MOVE_UNIT = UNIT / 100

const Stage = new Konva.Stage({
	container: "container",
	width: CANVAS_WIDTH,
	height: CANVAS_HEIGHT,
})

const Layer = new Konva.Layer()
const MonsterLayer = new Konva.Layer()
const BoomLayer = new Konva.Layer() 
const PromptLayer = new Konva.Layer()

Stage.add(Layer)
Stage.add(MonsterLayer)
Stage.add(BoomLayer)
Stage.add(PromptLayer)

PromptLayer.zIndex(3)
MonsterLayer.zIndex(2)
BoomLayer.zIndex(1)

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
// 炸弹爆炸
const EMITTER_BOOM_BOOMING = "EMITTER_BOOM_BOOMING"
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

const createKeyboardAnimation = CreateKeyboardAnimation()

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
		return function (...args) {
			if (that.disabled) return
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
		if (position) {
			this.x = position.x
			this.y = position.y
		}
		this.instance &&
			this.instance.absolutePosition({ x: this.x * UNIT, y: this.y * UNIT })
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

class AnimationObject extends CoreObject {

	constructor(position) {
		super(position)
	}

	normalImage 
	dieImage 
	destroyingImage = []
	moveImage 

	lifeCycle = 1

	moveIndex = 0 

	get isAlive() {
		return this.lifeCycle === 1
	}

	// 创建
	create(afterCrate) {
		loader(this.normalImage, image => {
			this.instance = new Konva.Image({
				x: this.x * UNIT,
				y: this.y * UNIT,
				width: UNIT,
				height: UNIT,
				image,
			})
			Layer.add(this.instance)
			afterCrate && afterCrate()
		})
	}

	// 全局循环
	loop() {
		if(this.isAlive) {
			this.moveAnimation()
		}else if(this.lifeCycle >= 2 && this.lifeCycle < 100) {
			this.dieAnimation()
		}else if(this.lifeCycle >= 100) {
			this.destroyAnimation()
		}
		return !this.isAlive
	}

	over() {
		this.lifeCycle = 2
	}

	update() {
		this.moveIndex = 0 
	}

	// 运动动画
	moveAnimation() {
		const move = this.moveImage 
		if(Array.isArray(move) && move.length) {
			const length = move.length
			loader(move[this.moveIndex], image => {
				this.instance.image(image)
			})
			this.moveIndex ++
			this.moveIndex %= length
		}
	}

	// 死亡动画
	dieAnimation() {
		if(!this.dieImage) {
			this.lifeCycle = 100 
			return 
		}
		if(this.lifeCycle === 2) {
			loader(this.dieImage, (image) => {
				this.instance.image(image)
			})
		}
		this.lifeCycle ++
	}

	// 消失动画
	destroyAnimation() {
		const destroy = this.destroyingImage 
		const destroyImageLength = destroy.length
		if(this.lifeCycle > 120 + 20 * destroyImageLength) {
			return this.destroy()
		}
		const index = (this.lifeCycle - 100) / 20 
		const targetImage = destroy[index]
		if(targetImage) {
			loader(targetImage, (image) => {
				this.instance.image(image)
			})
		}
		this.lifeCycle ++
	}

}

// 角色
class Person extends AnimationObject {
	constructor(position, life) {
		super(position)
		this.create()
		this.life = life
		this.move = this.actionWrapper(this.move)
		this.dropBoom = this.actionWrapper(this.dropBoom)
		this.eventBind()
	}

	type = "PERSON"

	// buff
	boom = new BoomFactory()
	life = 3

	create() {
		super.create(() => {
			EventEmitter.emit(
				EMITTER_PERSON_MOVE,
				this,
				{ x: this.x, y: this.y },
				() => {}
			)
		})
	}

	die() {
		this.life--
		EventEmitter.emit(EMITTER_GAME_OVER, this.life)
	}

	revisePosition(position, delta) {
		const { x, y } = position 
		const newPosition = {
			...position
		}
		const { deltaX, deltaY } = delta 
		const roundX = Math.round(x)
		const roundY = Math.round(y)
		let newX = Math.abs(roundX - x) <= 0.3 ? roundX : x
		let newY = Math.abs(roundY - y) <= 0.3 ? roundY : y
		if(!!deltaX) {
			newPosition.y = newY
		}else if(!!deltaY) {
			newPosition.x = newX
		}
		return newPosition
	}

	move(delta) {
		if (this.loading || this.loop()) return
		this.loading = true
		const { deltaX, deltaY } = delta
		let newX = this.x + (deltaX * MOVE_UNIT * 20) / UNIT
		let newY = this.y + (deltaY * MOVE_UNIT * 20) / UNIT
		newX = toFixed4(newX)
		newY = toFixed4(newY)
		const newPosition = this.revisePosition({
			x: newX,
			y: newY,
		}, delta)
		// 碰到障碍墙
		if (knockWall(newPosition)) {
			console.log("person knocked wall")
			this.loading = false 
			return
		}
		let counter = EventEmitter.listenerCount(EMITTER_PERSON_MOVE)
		if (counter === 0) {
			this.updatePosition(newPosition)
			this.loading = false
			return
		}
		let knocked = false
		let knockType
		EventEmitter.emit(
			EMITTER_PERSON_MOVE,
			this,
			newPosition,
			(type, isKnock) => {
				counter--
				if (isKnock) {
					knocked = true
					knockType = type
				}
				if (counter === 0) {
					if (knocked && knockType !== "BUFF") {
						switch (knockType) {
							case "MONSTER":
							case "FIRE":
								this.die()
								break
							default:
								console.log("hello world")
						}
					} else {
						this.updatePosition(newPosition)
					}
					this.loading = false
				}
			}
		)
	}

	dropBoom() {
		const position = {
			x: this.x,
			y: this.y,
		}
		this.boom.create(position)
		const counter = EventEmitter.listenerCount(EMITTER_DROP_OP)
		EventEmitter.emit(EMITTER_BOOM_CREATE, position, () => {
			if (counter === 0) {
				// TODO 
				// ! 这里写关于放置炸弹和人物和怪物和墙之间的关系
			}
		})
	}

	boomedBoom() {
		this.boom.boom()
	}

	onTargetMove(instance, position, onKnock) {
		const isKnock = knockJudge({ x: this.x, y: this.y }, { ...position })
		if (isKnock) {
			this.die()
		}
		onKnock(this.type, isKnock)
	}

	onBoomCreate() {}

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
		EventEmitter.addListener(EMITTER_BOOM_BOOMING, this.onTargetMove, this)
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
		EventEmitter.removeListener(EMITTER_BOOM_BOOMING, this.onTargetMove, this)
	}
}

// 火🔥
class Fire extends CoreObject {
	constructor(position, options) {
		super(position)
		const { maxBoomArea, align } = options
		this.maxBoomArea = maxBoomArea
		this.align = align
		this.create()
		this.eventBind()
	}

	type = "FIRE"

	align = 'vertical'
	maxBoomArea = 5 
	boomStart = 0
	boomEnd = 0
	boomAnimation = 0 
	boomUpdated = false 

	nextEventBindEnd = false 

	emitBooming({ x, y }, callback) {
		let counter = EventEmitter.listenerCount(EMITTER_BOOM_BOOMING)
		let knockType
		let knocked = false
		EventEmitter.emit(EMITTER_BOOM_BOOMING, this, { x, y }, (type, isKnock) => {
			counter--
			if (isKnock) {
				knockType = type
				knocked = true
			}
			if (counter === 0) {
				callback(knocked && knockType === "WALL")
			}
		})
	}

	create() {
		this.instance = new Konva.Image({
			x: this.x * UNIT,
			y: this.y * UNIT,
			width: UNIT,
			height: UNIT,
			fill: this.align === "vertical" ? "yellow" : "black",
		})
		BoomLayer.add(this.instance)
	}

	get updatePosition() {
		return this.align === 'vertical' ? 'y' : 'x'
	}

	get updateSize() {
		return this.align === 'vertical' ? 'height' : 'width'
	}

	animation() {
		// destroy
		this.loading = this.boomStart >= this.maxBoomArea && this.boomEnd >= this.maxBoomArea
		if(this.loading) {
			if(!this.nextEventBindEnd) {
				this.nextEventBindEnd = true 
				this.nextEventBind()
			}
			return 
		} 
		this.boomAnimation++
		this.boomAnimation %= 5
		if (this.boomAnimation !== 0 && !this.boomUpdated) return
		this.boomCounter = false 
		// update
		if (
			this.boomStart < this.maxBoomArea ||
			this.boomEnd < this.maxBoomArea
		) {
			let newPosition = getInfo(this.instance)
			new Promise((resolve) => {
				if (this.boomStart < this.maxBoomArea) {
					const templatePosition = {
						...newPosition,
						[this.updatePosition]: newPosition[this.updatePosition] - UNIT,
						[this.updateSize]: newPosition[this.updateSize] + UNIT,
					}
					const x = Math.round(templatePosition.x / UNIT)
					const y = Math.round(templatePosition.y / UNIT)
					if(knockWall({ x, y })) this.boomStart = this.maxBoomArea
					if (this.boomStart < this.maxBoomArea) {
						this.emitBooming({ x, y }, (isKnock) => {
							if (isKnock) {
								this.boomStart = this.maxBoomArea
							}else {
								this.boomStart ++
							}
							newPosition = {
								...newPosition,
								...templatePosition,
							}
							resolve()
						})
					}else {
						this.boomStart ++
						resolve() 
					}
				} else {
					resolve()
				}
			})
			.then(() => {
				return new Promise((resolve) => {
					if (this.boomEnd < this.maxBoomArea) {
						const templatePosition = {
							...newPosition,
							[this.updateSize]: newPosition[this.updateSize] + UNIT,
						}
						const x = Math.round(templatePosition.x / UNIT)
						const y = Math.round(templatePosition.y / UNIT)
						const size = Math.round(templatePosition[this.updateSize] / UNIT)
						const knockTarget = this.align === 'vertical' ? { x, y: y + size - 1 } : { x: x + size - 1, y }
						if(knockWall(knockTarget)) this.boomEnd = this.maxBoomArea
						if (this.boomEnd < this.maxBoomArea) {
							this.emitBooming(knockTarget, (isKnock) => {
								if (isKnock) {
									this.boomEnd = this.maxBoomArea
								}else {
									this.boomEnd ++
								}
								newPosition = {
									...newPosition,
									...templatePosition,
								}
								resolve()
							})
						}else {
							this.boomEnd ++
							resolve() 
						}
					} else {
						resolve()
					}
				})
			})
			.then(() => {
				this.boomUpdated = true 
				this.instance[this.updatePosition](newPosition[this.updatePosition])
				this.instance[this.updateSize](newPosition[this.updateSize])
			})
		} else {
			this.boomUpdated = true 
		}
	}

	onTargetMove(instance, position, onKnock) {
		const isKnock = knockJudge(formatInfo(getInfo(this.instance)), position)
		onKnock(this.type, isKnock)
	}

	eventBind = () => {
		super.eventBind()
		EventEmitter.addListener(EMITTER_TIMER, this.animation, this)
	}

	eventUnBind = () => {
		super.eventBind()
		EventEmitter.removeListener(EMITTER_TIMER, this.animation, this)
		EventEmitter.removeListener(EMITTER_PERSON_MOVE, this.onTargetMove, this)
		EventEmitter.removeListener(EMITTER_MONSTER_MOVE, this.onTargetMove, this)
	}

	nextEventBind = () => {
		EventEmitter.addListener(EMITTER_PERSON_MOVE, this.onTargetMove, this)
		EventEmitter.addListener(EMITTER_MONSTER_MOVE, this.onTargetMove, this)
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

	type = "BOOM"

	multipleState = false
	timeState = false
	hugeState = false

	onBoom
	// loading timeing wait boom destroy
	timeStep = -1
	timeoutStart
	timeoutRest = 5000

	initBoomInstance
	boomVertical
	boomHorizontal

	boomAnimation = 0

	get maxBoomArea() {
		return this.hugeState ? 6 : 3
	}

	get isBoomed() {
		return this.timeStep > 4
	}

	onTargetMove = (instance, position, onKnock) => {
		const isKnock = knockJudge(position, { x: this.x, y: this.y })
		onKnock(this.type, isKnock)
	}

	eventBind = () => {
		super.eventBind()
		// EventEmitter.addListener(EMITTER_PERSON_MOVE, this.onTargetMove, this)
		EventEmitter.addListener(EMITTER_MONSTER_MOVE, this.onTargetMove, this)
		EventEmitter.addListener(EMITTER_TIMER, this.animation, this)
	}

	eventUnBind = () => {
		super.eventBind()
		// EventEmitter.removeListener(EMITTER_PERSON_MOVE, this.onTargetMove, this)
		EventEmitter.removeListener(EMITTER_MONSTER_MOVE, this.onTargetMove, this)
		EventEmitter.removeListener(EMITTER_TIMER, this.animation, this)
	}

	create() {
		loader(BOOM, (image) => {
			this.initBoomInstance = new Konva.Image({
				x: this.x * UNIT,
				y: this.y * UNIT,
				width: UNIT,
				height: UNIT,
				image,
			})
			this.timeStep = 0
			Layer.add(this.initBoomInstance)
			this.timeoutStart = Date.now()
			if (this.timeState) {
				this.timeStep = 1
			}
		})
	}

	animation() {
		if (this.timeStep === 0) {
			const now = Date.now()
			this.timeoutRest -= now - this.timeoutStart
			this.timeoutStart = now
			if (this.timeoutRest <= 0) this.timeStep += 2
		} else if (this.timeStep >= 2) {
			this.immediateBoom()
		}
	}

	// 立刻爆炸
	immediateBoom(step) {
		if(step !== undefined) this.timeStep = 2
		// init
		if (!this.boomVertical) {
			this.type = 'FIRE'
			EventEmitter.emit(EMITTER_BOOM_BOOMING, this, { x: this.x, y: this.y }, () => {
				this.type = 'BOOM'
			})
			this.initBoomInstance.destroy()
			this.boomVertical = new Fire([this.x, this.y], {
				align: 'vertical',
				maxBoomArea: this.maxBoomArea
			})
			this.boomHorizontal = new Fire([this.x, this.y], {
				align: 'horizontal',
				maxBoomArea: this.maxBoomArea
			})
			return
		}
		// destroy
		if (
			this.boomVertical.loading && this.boomHorizontal.loading
		) {
			this.timeStep++
			if (this.timeStep > 50) {
				this.onBoom(this.id)
				this.destroy()
			}
		}
	}

	destroy() {
		super.destroy()
		try {
			this.initBoomInstance.destroy()
			this.boomVertical.destroy()
			this.boomHorizontal.destroy()
			this.boomVertical = undefined
			this.boomHorizontal = undefined
		} catch (err) {}
	}
}

class BoomFactory {
	multipleState = true
	timeState = true
	hugeState = true

	boomMap = {}

	onBoom = (id) => {
		this.boomMap[id] = undefined
		delete this.boomMap[id]
	}

	create(position) {
		if (Object.keys(this.boomMap).length >= (this.multipleState ? 5 : 1)) return
		const { x, y } = position
		const boom = new Boom([Math.round(x), Math.round(y)], {
			onBoom: this.onBoom,
			multipleState: this.multipleState,
			timeState: this.timeState,
			hugeState: this.hugeState,
		})
		this.boomMap[boom.id] = boom
	}

	boom() {
		const targetId = Math.min(...Object.entries(this.boomMap).filter(item => !item[1].isBoomed).map(item => item[0]))
		!!this.boomMap[targetId] && this.boomMap[targetId].immediateBoom(2)
	}
}

class Buff extends CoreObject {
	display = false

	constructor(position, image) {
		super(position)
		this.image = image 
		this.eventBind()
	}

	type = "BUFF"
	image 

	create() {
		loader(this.image, image => {
			this.instance = new Konva.Image({
				x: this.x * UNIT,
				y: this.y * UNIT,
				width: UNIT,
				height: UNIT,
				image,
			})
			Layer.add(this.instance)
		})
	}

	onTargetMove(instance, position, onKnock) {
		const isKnock = knockJudge(position, { x: this.x, y: this.y })
		onKnock(this.type, isKnock)
		if (isKnock) {
			this.destroy()
		}
	}

	onWallDestroy(position) {
		if (position.x === this.x && position.y === this.y) {
			this.create()
			this.nextEventBind()
		}
	}

	nextEventBind() {
		EventEmitter.addListener(EMITTER_PERSON_MOVE, this.onTargetMove, this)
	}

	eventBind = () => {
		super.eventBind()
		EventEmitter.addListener(EMITTER_WALL_DESTROY, this.onWallDestroy, this)
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
		super(position, LOOP_BOOM_BUFF)
	}

	onTargetMove(instance, position, onKnock) {
		super.onTargetMove(instance, position, (type, isKnock) => {
			onKnock(type, isKnock)
			if (isKnock) instance.boom.multipleState = true
		})
	}
}

// 炸弹定点爆炸buff
class TimeBoomBuff extends Buff {
	constructor(position) {
		super(position, TIME_BOOM_BUFF)
	}
	onTargetMove(instance, position, onKnock) {
		super.onTargetMove(instance, position, (type, isKnock) => {
			onKnock(type, isKnock)
			if (isKnock) instance.boom.timeState = true
		})
	}
}

// 炸弹爆炸范围buff
class SuperBoomBuff extends Buff {
	constructor(position) {
		super(position, SUPER_BOOM_BUFF)
	}
	onTargetMove(instance, position, onKnock) {
		super.onTargetMove(instance, position, (type, isKnock) => {
			onKnock(type, isKnock)
			if (isKnock) instance.boom.hugeState = true
		})
	}
}

class Door extends Buff {
	constructor(position) {
		super(position, DOOR)
	}

	type = "DOOR"

	onTargetMove(instance, position, onKnock) {
		if (EventEmitter.listenerCount(EMITTER_MONSTER_CREATE) !== 0) {
			return onKnock(this.type, false)
		}
		super.onTargetMove(instance, position, (type, isKnock) => {
			onKnock(this.type, isKnock)
			if (isKnock) {
				EventEmitter.emit(EMITTER_NEXT_OP)
			}
		})
	}
}

class Wall extends AnimationObject {
	constructor(position, destructible) {
		super(position)
		this.destructible = destructible
		this.loading = this.destructible
		this.normalImage = this.destructible ? DESTRUCTIBLE_WALL : UN_DESTRUCTIBLE_WALL
		this.create()
		this.destructible && this.eventBind()
	}

	// 是否可以被破坏
	destructible = false
	// 位置
	position = []
	type = "WALL"

	loading = true 

	destroyingImage = [
		WALL_DESTROY
	]

	onTargetMove(instance, position, onKnock) {
		if(this.loading || !this.isAlive) return onKnock(this.type, false)
		const isKnock = knockJudge({ x: this.x, y: this.y }, { ...position })
		onKnock(this.type, isKnock)
		if(isKnock && instance.type === 'FIRE') {
			this.nextEventBind()
			this.over()
		}
	}

	nextEventBind() {
		EventEmitter.addListener(EMITTER_TIMER, this.loop, this)
	}

	eventBind() {
		super.eventBind()
		EventEmitter.addListener(EMITTER_PERSON_MOVE, this.onTargetMove, this)
		EventEmitter.addListener(EMITTER_MONSTER_MOVE, this.onTargetMove, this)
		EventEmitter.addListener(EMITTER_BOOM_BOOMING, this.onTargetMove, this)
	}

	eventUnBind() {
		super.eventUnBind()
		EventEmitter.removeListener(EMITTER_PERSON_MOVE, this.onTargetMove, this)
		EventEmitter.removeListener(EMITTER_MONSTER_MOVE, this.onTargetMove, this)
		EventEmitter.removeListener(EMITTER_BOOM_BOOMING, this.onTargetMove, this)
		EventEmitter.removeListener(EMITTER_TIMER, this.loop, this)
	}

	destroy() {
		super.destroy() 
		EventEmitter.emit(EMITTER_WALL_DESTROY, { x: this.x, y: this.y })
	}

}

class Monster extends AnimationObject {
	constructor(position) {
		super(position)
		this.create()
		this.eventBind()
	}

	destroyingImage = [
		MONSTER_DESTROYING_1,
		MONSTER_DESTROYING_2,
		MONSTER_DESTROYING_3,
		MONSTER_DESTROYING_4
	]

	type = "MONSTER"

	// 移动速度
	speed = 1
	// 可穿越
	crossable = false

	// 运动方向
	direction
	// 运动距离
	moveCounter = 0
	animationIndex = 0

	loading = true 

	animation() {}

	_animation() {
		this.animationIndex++
		this.animationIndex %= 40
		if (this.animationIndex === 0) {
			this.animation()
		}
	}

	move = () => {
		if (this.loading || (this.destroyAnimation && this.loop())) return
		this.loading = true
		if (this.moveCounter === 0) {
			// left top right bottom
			const directions = [
				[-1, 0],
				[0, -1],
				[1, 0],
				[0, 1],
			]
			const moveCounters = [1, 3, 5, 7, 9]
			this.direction = directions[Math.floor(Math.random() * directions.length)]
			this.moveCounter =
				moveCounters[Math.floor(Math.random() * moveCounters.length)] * 100
		}
		this.moveCounter--
		const [deltaX, deltaY] = this.direction
		const newX = this.x + (deltaX * MOVE_UNIT * this.speed) / UNIT
		const newY = this.y + (deltaY * MOVE_UNIT * this.speed) / UNIT
		const newPosition = {
			x: toFixed4(newX),
			y: toFixed4(newY),
		}
		// 碰到障碍墙
		if (knockWall(newPosition)) {
			this.moveCounter = 0
			this.loading = false
			console.log("monster knock the undestructible wall")
			return
		}
		let counter = EventEmitter.listenerCount(EMITTER_MONSTER_MOVE)
		if (counter === 0) {
			this.updatePosition(newPosition)
			this.loading = false
			return
		}
		let knocked = false
		let knockType
		EventEmitter.emit(
			EMITTER_MONSTER_MOVE,
			this,
			newPosition,
			(type, isKnock) => {
				counter--
				if (isKnock) {
					if (!this.crossable || type !== "WALL") {
						knocked = true
						knockType = type
					}
				}
				if (counter === 0) {
					if (knocked) {
						console.log("monster knocked", knockType)
						if(knockType === 'FIRE') {
							// 死亡
							this.over()
						}
						this.moveCounter = 0
					} else {
						this.updatePosition(newPosition)
					}
					this.loading = false
				}
			}
		)
	}

	onCreateBoom(position) {}

	onTargetMove(instance, position, onKnock) {
		if(this.loading || !this.isAlive) return onKnock(this.type, false)
		const isKnock = knockJudge(position, { x: this.x, y: this.y })
		onKnock(this.type, isKnock)
		if (instance.type === "FIRE" && isKnock) {
			this.over()
		}
	}

	createMonster() {
		/** Prefix */
	}

	eventBind() {
		super.eventBind()
		EventEmitter.addListener(EMITTER_PERSON_MOVE, this.onTargetMove, this)
		EventEmitter.addListener(EMITTER_BOOM_BOOMING, this.onTargetMove, this)
		EventEmitter.addListener(EMITTER_MONSTER_CREATE, this.createMonster, this)
		EventEmitter.addListener(EMITTER_TIMER, this.move, this)
		EventEmitter.addListener(EMITTER_BOOM_CREATE, this.onCreateBoom, this)
	}

	eventUnBind() {
		super.eventUnBind()
		EventEmitter.removeListener(EMITTER_PERSON_MOVE, this.onTargetMove, this)
		EventEmitter.removeListener(EMITTER_BOOM_BOOMING, this.onTargetMove, this)
		EventEmitter.removeListener(
			EMITTER_MONSTER_CREATE,
			this.createMonster,
			this
		)
		EventEmitter.removeListener(EMITTER_TIMER, this.move, this)
		EventEmitter.removeListener(EMITTER_BOOM_CREATE, this.onCreateBoom, this)
	}

}

// 气球怪
class BalloonMonster extends Monster {

	normalImage = BALLOON_MONSTER
	dieImage = BALLOON_MONSTER_DIE

	animation() {
		const scaleY = this.instance.scaleY() || 1
		this.instance.scaleY(scaleY == 1 ? 0.8 : 1)
	}
}

// 穿墙怪
class CrossWallMonster extends Monster {
	crossable = true

	normalImage = CROSS_MONSTER
	dieImage = CROSS_MONSTER_DIE

	animation() {
		const scaleX = this.instance.scaleX() || 1
		this.instance.scaleX(scaleX == 1 ? 0.8 : 1)
	}
}

// 高速怪
class SpeedMonster extends Monster {
	speed = this.speed * 3

	normalImage = SPEED_MONSTER
	dieImage = SPEED_MONSTER_DIE
	animation() {
		const scaleX = this.instance.scaleX() || 1
		this.instance.scaleX(scaleX == 1 ? 0.8 : 1)
	}
}

function createGamePrompt({ content, onRestart, timeout }) {
	const group = new Konva.Group({
		width: CANVAS_WIDTH,
		height: CANVAS_HEIGHT,
		x: 0,
		y: 0,
	})
	group.add(
		new Konva.Rect({
			width: CANVAS_WIDTH,
			height: CANVAS_HEIGHT,
			x: 0,
			y: 0,
			fill: "rgba(0, 0, 0, 0.9)",
		})
	)
	PromptLayer.add(group)
	const commonFontConfig = {
		align: "center",
		verticalAlign: "center",
		fontSize: CANVAS_WIDTH / 50,
		x: Stage.width() / 2,
		y: Stage.height() / 2,
		fill: "#fff",
	}
	const text = new Konva.Text({
		...commonFontConfig,
		text: content,
	})
	text.offsetX(text.width() / 2)
	text.offsetY(text.height() / 2)

	if (!~timeout) {
		text.on("click", () => {
			group.destroy()
			onRestart()
		})
	}

	group.add(text)
	if (!!~timeout) {
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
		this.initlevel()
		this.start()
	}

	initlevel() {
		LevelContent.innerHTML = this.level
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
		const { door } = this.levelData
		new Door(door)
	}

	// 创建角色
	initPerson() {
		new Person([1, 2], this.personLife)
	}

	onGameOver(life) {
		if (this.loading) return
		this.loading = true
		this.personLife = typeof life === "number" ? life : this.personLife - 1
		this.destroy()
		if (this.personLife !== 0) {
			createGamePrompt({
				content: `你已阵亡！（还剩${this.personLife}次机会）`,
				onRestart: this.restart.bind(this),
				timeout: 3000,
			})
		} else {
			createGamePrompt({
				content: `你已阵亡！点我继续(*^▽^*)`,
				onRestart: () => {
					this.personLife = 3
					this.restart()
				},
				timeout: -1,
			})
		}
	}

	onNext() {
		this.loading = true 
		this.destroy()
		if (this.level === LEVEL_MAP.length) {
			createGamePrompt({
				content: "恭喜通关！！！点我重玩(*^▽^*)",
				onRestart: () => {
					this.level = 1
					this.personLife = 3
					this.restart()
				},
				timeout: -1,
			})
		} else {
			this.level++
			createGamePrompt({
				content: `恭喜通过本关！！即将进入下一关`,
				onRestart: this.restart.bind(this),
				timeout: 3000,
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
			if (this.timeout === 0) {
				this.stop()
				this.onGameOver()
			}
		}, 1000)
		this.animationTimer = setInterval(() => {
			EventEmitter.emit(EMITTER_TIMER)
			createKeyboardAnimation.animation()
		}, 1000 / 60)
	}

	stop() {
		clearInterval(this.timer)
		clearInterval(this.animationTimer)
	}

	destroy() {
		this.stop()
		this.loading = false
		this.timeout = 480
		EventEmitter.emit(EMITTER_DESTROY)
	}

	restart() {
		this.destroy()
		this.init()
	}
}

const game = new Game()
