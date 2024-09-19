import {
	setEnergy,
	setHunger,
	setSleep,
	triggerRandomRoutine,
} from "../script.js"

class CharacterSprite extends HTMLElement {
	constructor() {
		super()
		this.sprite = null
		this.state = "sit_down"
		this.controller = null
		this.sleepPoints = 1.0
		//todo either
		//1. distance travel ups or lowers speed
		//2. speed up or low depending on distance
		this.speed = 7000
		this.x = 0
		this.y = 0
		this.translateAnim = null
	}

	connectedCallback() {
		const sprite_wrap = document.createElement("div")
		sprite_wrap.classList.add("sprite_wrap")

		this.sprite = document.createElement("img")
		this.sprite.src = this.getAttribute("src") || ""
		this.sprite.alt = this.getAttribute("alt") || ""
		this.sprite.classList.add("char_spritesheet")

		const shadow = document.createElement("img")
		shadow.src = "chaos/shadow.png"
		shadow.alt = "Character Shadow"
		shadow.classList.add("char_shadow")

		const emote_wrap = document.createElement("div")
		emote_wrap.classList.add("emote_wrap")
		const emote = document.createElement("img")
		emote.src = "./sprites/chao-emote-v2.png"
		emote.alt = "Character Emote"
		emote.classList.add("char_emote")

		this.appendChild(emote_wrap)
		emote_wrap.appendChild(emote)
		this.appendChild(shadow)
		this.appendChild(sprite_wrap)
		sprite_wrap.appendChild(this.sprite)

		const dropZone = document.createElement("drop-zone")
		sprite_wrap.appendChild(dropZone)

		this.state = this.getAttribute("state") || this.state
		this.updateAnimation()
		// this.updateTranslate()
	}

	static get observedAttributes() {
		return ["src", "alt", "state", "x", "y", "x_dest", "y_dest"]
	}

	attributeChangedCallback(name, oldValue, newValue) {
		if (this.sprite) {
			if (name === "src" && oldValue !== newValue) {
				this.sprite.src = newValue
			} else if (name === "state") {
				this.updateAnimation()
			}
		}
	}

	abortOngoingRoutine() {
		if (this.controller) {
			this.controller.abort()
		}
	}

	transformRoutine() {
		this.abortOngoingRoutine()
		this.controller = new AbortController()
		const signal = this.controller.signal

		this.classList.remove("char_translate_paused")

		const playfieldBounds = {
			x: window.playfield.clientWidth - this.offsetWidth,
			y: window.playfield.clientHeight - this.offsetHeight,
		}

		const destinationPos = {
			x: Math.random() * playfieldBounds.x,
			y: Math.random() * playfieldBounds.y,
		}

		const currPos = {
			x: this.x,
			y: this.y,
		}

		this.style.setProperty(
			"--translate-current",
			`${currPos.x}px, ${currPos.y}px`
		)
		this.style.setProperty(
			"--translate-destination",
			`${destinationPos.x}px, ${destinationPos.y}px`
		)

		const current = getComputedStyle(this).getPropertyValue(
			"--translate-current"
		)
		const destination = getComputedStyle(this).getPropertyValue(
			"--translate-destination"
		)

		// this.style.transform = `translate(${current})`
		this.translateAnim = this.animate(
			[
				{ transform: `translate(${current})` },
				{ transform: `translate(${destination})` },
			],
			{
				duration: this.speed,
				easing: "linear",
				fill: "forwards",
			}
		)

		// this.animation.pause()

		const cardinalDirection = getDominantDirection(currPos, destinationPos)

		switch (cardinalDirection) {
			case "north":
				this.state = "face_up"
				break
			case "south":
				this.state = "face_down"
				break
			case "east":
				this.state = "face_right"
				break
			case "west":
				this.state = "face_left"
				break

			default:
				this.state = "face_still"
				break
		}
		this.updateAnimation()

		this.x = destinationPos.x
		this.y = destinationPos.y

		const duration = this.speed
		const iterations = 3
		const timeDelay = duration / iterations

		const iterateWithPause = async (onFinish) => {
			for (let i = 0; i < iterations; i++) {
				if (signal.aborted) return

				await new Promise((resolve) => setTimeout(resolve, timeDelay))
				//? splits the total reduction across num of iterations
				setSleep(-0.3 / iterations)
				setHunger(-0.1 / iterations)
				setEnergy(-0.4 / iterations)
			}

			if (signal.aborted) return
			onFinish()
		}

		const finish = () => {
			this.state = "face_still"
			this.updateAnimation()
			triggerRandomRoutine([
				// () => this.transformRoutine(),
				() => this.sleepRoutine(),
				() => this.sitRoutine(),
			])
		}

		iterateWithPause(finish)

		// // //? reset to stop when done anim
		// setTimeout(() => {
		// 	this.state = "face_still"
		// 	this.updateAnimation()
		// 	triggerRandomRoutine([
		// 		// () => this.transformRoutine(),
		// 		() => this.sleepRoutine(),
		// 	])
		// }, this.speed)
	}

	sitRoutine() {
		this.abortOngoingRoutine()
		this.controller = new AbortController()
		const signal = this.controller.signal

		this.state = "sit_down"
		this.updateAnimation()
		const duration = 5000
		const iterations = 8
		const timeDelay = duration / iterations

		this.classList.add("char_translate_paused")

		const iterateWithPause = async (onFinish) => {
			for (let i = 0; i < iterations; i++) {
				if (signal.aborted) return

				await new Promise((resolve) => setTimeout(resolve, timeDelay))
				setSleep(-0.05 / iterations)
				setHunger(-0.01 / iterations)
				setEnergy(-0.02 / iterations)
			}
			if (signal.aborted) return
			onFinish()
		}

		const finish = () => {
			triggerRandomRoutine([
				() => this.transformRoutine(),
				() => this.sleepRoutine(),
				// () => this.sitRoutine(),
			])
		}

		iterateWithPause(finish)
	}

	//todo stop other routines even if in middle
	eatRoutine(hungerValue) {
		this.abortOngoingRoutine()
		this.controller = new AbortController()
		const signal = this.controller.signal

		if (this.translateAnim) {
			this.translateAnim.pause()
			const rect = this.getBoundingClientRect()

			this.x = rect.left
			this.y = rect.top

			// const computedStyle = getComputedStyle(this)
			// const currTransform = computedStyle.transform
			// console.log(currTransform)
		}
		this.state = "eat"
		this.updateAnimation()
		this.classList.add("char_translate_paused")
		// todo make these input var for func
		const duration = 8000
		const iterations = 13
		const timeDelay = duration / iterations

		const iterateWithPause = async (onFinish) => {
			for (let i = 0; i < iterations; i++) {
				if (signal.aborted) return

				await new Promise((resolve) => setTimeout(resolve, timeDelay))
				setSleep(0.1 / iterations)
				setEnergy(0.15 / iterations)
				setHunger(hungerValue / iterations)
			}

			if (signal.aborted) return
			onFinish()
		}

		const finish = () => {
			triggerRandomRoutine([
				() => this.transformRoutine(),
				() => this.sitRoutine(),
				() => this.sleepRoutine(),
			])
		}

		iterateWithPause(finish)
	}

	sleepRoutine() {
		this.abortOngoingRoutine()
		this.controller = new AbortController()
		const signal = this.controller.signal

		this.classList.add("char_translate_paused")
		this.state = "sleep"
		this.updateAnimation()
		// todo make these input var for func
		const iterations = 10
		const timeDelay = 500

		const iterateWithPause = async (onFinish) => {
			for (let i = 0; i < iterations; i++) {
				if (signal.aborted) return

				await new Promise((resolve) => setTimeout(resolve, timeDelay))
				setSleep(0.35 / iterations)
				setEnergy(0.25 / iterations)
				setHunger(-0.01 / iterations)
			}

			if (signal.aborted) return
			onFinish()
		}

		const finish = () => {
			triggerRandomRoutine([
				() => this.transformRoutine(),
				() => this.sitRoutine(),
				// () => this.sleepRoutine(),
			])
		}

		iterateWithPause(finish)
	}

	updateAnimation() {
		const state = this.getAttribute("state")
		const states = [
			"face_still",
			"face_down",
			"face_right",
			"face_left",
			"face_up",
			"angry",
			"no",
			"crouch",
			"crawl",
			"cry",
			"sway",
			"eat",
			"eat_favorite",
			"excite",
			"sleep",
			"excite_2",
			"nasty",
			"point",
			"yawn",
			"sit_down",
			"think",
			"sit_left",
		]

		animProperties(this.state, this)

		if (this.sprite) {
			states.forEach((dir) => this.sprite.classList.remove(dir))

			if (this.state && states.includes(this.state)) {
				this.sprite.classList.add(this.state)
			}
		}
	}
}

customElements.define("character-sprite", CharacterSprite)

function animProperties(state, elCharacter) {
	let animFrames = 4

	switch (state) {
		case "face_down":
		case "face_right":
		case "face_left":
		case "face_up":
			animFrames = 4
			break

		case "angry":
		case "no":
		case "crouch":
		case "sway":
		case "eat":
			animFrames = 3
			break

		case "crawl":
		case "eat_favorite":
		case "excite":
		case "excite_2":
		case "sleep":
		case "nasty":
		case "point":
		case "yawn":
			animFrames = 2
			break

		case "cry":
			animFrames = 7
			break

		case "face_still":
		case "sit_down":
		case "sit_left":
			animFrames = 1
			break
		//TODO default isn't needed but could reduce redundant code
		default:
			animFrames = 4
			break
	}

	elCharacter.style.setProperty("--anim-frames", animFrames)
}

function getDominantDirection(start, destination) {
	const yDiff = destination.y - start.y
	const xDiff = destination.x - start.x

	if (Math.abs(yDiff) > Math.abs(xDiff)) {
		return yDiff > 0 ? "south" : "north"
	} else {
		return xDiff > 0 ? "east" : "west"
	}
}
