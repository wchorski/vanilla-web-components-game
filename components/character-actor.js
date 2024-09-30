/**
 * @typedef {import('../types/Character.js').Character} Character
 * @typedef {import('../types/Character.js').State} CharState
 * @typedef {import('../types/Character.js').AnimState} AnimState
 * @typedef {import('../types/Coordinates.js').Coordinates2d} Coordinates2d
 * @typedef {import('../types/Coordinates.js').CardinalDirections} CardinalDirections
 */
import { triggerRandomRoutine } from "../script.js"
import { clamp } from "../lib/clamp.js"
import { durationInSteps } from "../lib/durationInSteps.js"

const animStates = [
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
	"egg",
]

// todo add html template here
/**
 * @extends HTMLElement
 * @example
 * <character-actor id="char-1" class="character char_translate" alt="Character" src="./sprites/chao-neutral-v6.png" state="eat" hunger="0.5" sleep="0.5" energy="0.5" happyness="0.5"></character-actor>
 */
class CharacterActor extends HTMLElement {
	constructor() {
		super()
		// this.sprite = null
		// this.controller = null
		// this.sleep = 1.0
		// //todo either
		// //1. distance travel ups or lowers speed
		// //2. speed up or low depending on distance
		// this.speed = 7000
		// this.translateAnim = null
		// this.healthUi = document.querySelector(`#${this.id}-health-ui`)
	}

	connectedCallback() {
		this.healthUi = document.querySelector(`#${this.id}-health-ui`)

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
		this.x = Number(this.getAttribute("x")) || 0
		this.y = Number(this.getAttribute("y")) || 0
		this.style.top = String(this.y) + "px"
		this.style.left = String(this.x) + "px"
		this.speed = this.getAttribute("speed") || 7000

		// this.setAnimation()
		switch (this.state) {
			case "egg":
				this.eggRoutine()
				break

			default:
				this.transformRoutine()
				break
		}

		this.setAnimation()
	}

	// disconnectedCallback() {
	//   // remove any event listeners
	//   console.log("Custom element removed from page.");
	// }

	static get observedAttributes() {
		return ["src", "alt", "state", "x", "y", "x_dest", "y_dest"]
	}

	get speed() {
		return this.getAttribute("speed")
	}
	set speed(value) {
		this.setAttribute("speed", value)
	}

	/**
	 * todo why does this `|string` remove the auto complete?
	 * @type {CharState|string}
	 * @attr {CharState|string} state
	 */
	get state() {
		return this.getAttribute("state") || "sit_down"
	}

	/** @param {CharState} value */
	set state(value) {
		if (this.state !== value) {
			this.setAttribute("state", value)
		}
	}
	get id() {
		return this.getAttribute("id")
	}
	/** @param {string} value */
	set id(value) {
		this.setAttribute("id", value)
	}

	get hunger() {
		return Number(this.getAttribute("hunger"))
	}
	/** @param {number} value */
	set hunger(value) {
		const currentPoints = Number(this.getAttribute("hunger")) || 0.0
		const clampedPoints = clamp(currentPoints + value, 0, 1)
		this.setAttribute("hunger", String(clampedPoints))
		this.healthUi = document.querySelector(`#${this.id}-health-ui`)
		if (!this.healthUi) return
		this.healthUi
			.querySelector("health-meter.hungerMeter")
			.setAttribute("value", String(clampedPoints))
	}

	get sleep() {
		return Number(this.getAttribute("sleep"))
	}
	/** @param {number} value */
	set sleep(value) {
		const currentPoints = Number(this.getAttribute("sleep"))
		const clampedPoints = clamp(currentPoints + value, 0, 1)
		this.setAttribute("sleep", String(clampedPoints))
		//todo don't query this.healthUi every time. figure out how to only one time
		this.healthUi = document.querySelector(`#${this.id}-health-ui`)
		if (!this.healthUi) return
		this.healthUi
			.querySelector("health-meter.sleepMeter")
			.setAttribute("value", String(clampedPoints))
	}

	get energy() {
		return Number(this.getAttribute("energy"))
	}
	/** @param {number} value */
	set energy(value) {
		const currentPoints = Number(this.getAttribute("energy"))
		const clampedPoints = clamp(currentPoints + value, 0, 1)
		this.setAttribute("energy", String(clampedPoints))
		if (!this.healthUi) return
		this.healthUi
			.querySelector("health-meter.energyMeter")
			.setAttribute("value", String(clampedPoints))
	}

	get happyness() {
		return Number(this.getAttribute("happyness"))
	}
	/** @param {number} value */
	set happyness(value) {
		const currentPoints = Number(this.getAttribute("happyness"))
		const clampedPoints = clamp(currentPoints + value, 0, 1)
		this.setAttribute("happyness", String(clampedPoints))
		if (!this.healthUi) return
		this.healthUi
			.querySelector("health-meter.happynessMeter")
			.setAttribute("value", String(clampedPoints))
	}
	/**
	 *
	 * @param {'src'|'alt'|'state'|'x'|"y"} name
	 * @param {*} oldValue
	 * @param {*} newValue
	 */
	attributeChangedCallback(name, oldValue, newValue) {
		//todo here is where i should change animation and sprites.
		if (name === "state" && oldValue !== newValue) {
			// console.log("attributeChangedCallback: ", this.state)
			this.setAnimation()
		}

		// if (this.sprite) {
		// 	if (name === "src" && oldValue !== newValue) {
		// 		this.sprite.src = newValue
		// 	} else if (name === "state") {
		// 		this.setAnimation()
		// 	}
		// }
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
		//todo don't query playfield everytime. pass down through prop?
		const playfieldEl = document.querySelector("#playfield")
		// const playfieldEl = window.playfield

		const playfieldBounds = {
			x: playfieldEl.clientWidth - this.offsetWidth,
			y: playfieldEl.clientHeight - this.offsetHeight,
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
				// todo
				// duration: this.speed,
				duration: 7000,
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

		this.x = destinationPos.x
		this.y = destinationPos.y

		const finish = () => {
			this.state = "face_still"
			// this.setAnimation()
			triggerRandomRoutine([
				// () => this.transformRoutine(),
				this.hunger > 0.2 ? () => this.sleepRoutine() : () => this.cryRoutine(),
				() => this.sitRoutine(),
			])
		}

		const steps = 3

		durationInSteps({
			duration: this.speed,
			steps,
			onFinish: finish,
			signal: signal,
			funcs: [
				() => (this.sleep = -0.1 / steps),
				() => (this.hunger = -0.05 / steps),
				() => (this.energy = -0.15 / steps),
			],
		})
	}

	exciteRoutine() {
		this.abortOngoingRoutine()
		this.controller = new AbortController()
		const signal = this.controller.signal

		this.state = "excite"

		this.classList.add("char_translate_paused")

		const finish = () => {
			triggerRandomRoutine([
				() => this.transformRoutine(),
				this.hunger > 0.2 ? () => this.sleepRoutine() : () => this.cryRoutine(),
				() => this.sitRoutine(),
			])
		}

		const steps = 3

		durationInSteps({
			duration: 5000,
			steps,
			onFinish: finish,
			signal: signal,
			funcs: [() => (this.happyness = 0.1 / steps)],
		})
	}

	eggRoutine() {
		this.abortOngoingRoutine()
		this.controller = new AbortController()
		const signal = this.controller.signal

		this.state = "egg"

		this.classList.add("char_translate_paused")

		const finish = () => {
			this.birth = new Date().toISOString()
			this.sitRoutine()
		}

		const steps = 1

		durationInSteps({
			duration: 20000,
			steps,
			onFinish: finish,
			signal: signal,
			funcs: [() => console.log("egg timer: wait 20 second to hatch")],
		})
	}

	sitRoutine() {
		this.abortOngoingRoutine()
		this.controller = new AbortController()
		const signal = this.controller.signal

		this.state = "sit_down"
		this.classList.add("char_translate_paused")

		const finish = () => {
			//todo isHappy() that checks hunger, sleep, etc to see if exciteRoutine will be triggered
			triggerRandomRoutine([
				() => this.transformRoutine(),
				this.hunger > 0.2 ? () => this.sleepRoutine() : () => this.cryRoutine(),
				...(this.sleep > 0.4 && this.hunger > 0.4
					? [() => this.exciteRoutine()]
					: []),
			])
		}

		const steps = 8

		durationInSteps({
			duration: 5000,
			steps,
			onFinish: finish,
			signal: signal,
			funcs: [
				() => (this.sleep = -0.02 / steps),
				() => (this.hunger = -0.01 / steps),
				() => (this.energy = -0.02 / steps),
			],
		})
	}

	eatRoutine(hungerValue) {
		this.abortOngoingRoutine()
		this.controller = new AbortController()
		const signal = this.controller.signal

		if (this.translateAnim) {
			this.translateAnim.pause()
			const rect = this.getBoundingClientRect()

			this.x = rect.left
			this.y = rect.top
		}

		this.classList.add("char_translate_paused")

		//todo if tummy full then refuse eat
		if (this.hunger > 0.9) {
			this.state = "no"
			// this.setAnimation()

			setTimeout(() => {
				triggerRandomRoutine([
					() => this.transformRoutine(),
					() => this.sitRoutine(),
					this.hunger > 0.2
						? () => this.sleepRoutine()
						: () => this.cryRoutine(),
				])
			}, 3000)
		} else {
			this.state = "eat"

			const finish = () => {
				triggerRandomRoutine([
					() => this.transformRoutine(),
					() => this.sitRoutine(),
					this.hunger > 0.2
						? () => this.sleepRoutine()
						: () => this.cryRoutine(),
				])
			}

			const steps = 13

			durationInSteps({
				duration: 8000,
				steps,
				onFinish: finish,
				signal: signal,
				funcs: [
					() => (this.energy = 0.2 / steps),
					() => (this.hunger = hungerValue / steps),
				],
			})
		}
	}

	sleepRoutine() {
		this.abortOngoingRoutine()
		this.controller = new AbortController()
		const signal = this.controller.signal

		this.classList.add("char_translate_paused")
		this.state = "sleep"

		const finish = () => {
			triggerRandomRoutine([
				() => this.transformRoutine(),
				() => this.sitRoutine(),
				// () => this.sleepRoutine(),
			])
		}

		const steps = 10

		durationInSteps({
			duration: 5000,
			steps,
			onFinish: finish,
			signal: signal,
			funcs: [
				() => (this.sleep = 0.35 / steps),
				() => (this.energy = 0.3 / steps),
				() => (this.hunger = -0.01 / steps),
			],
		})
	}

	cryRoutine() {
		this.abortOngoingRoutine()
		this.controller = new AbortController()
		const signal = this.controller.signal

		this.classList.add("char_translate_paused")
		this.state = "cry"

		const finish = () => {
			triggerRandomRoutine([
				...(this.energy > 0.3 ? [() => this.transformRoutine()] : []),
				() => this.sitRoutine(),
				// () => this.sleepRoutine(),
			])
		}

		const steps = 8

		durationInSteps({
			duration: 5000,
			steps,
			onFinish: finish,
			signal: signal,
			funcs: [() => (this.happyness = -0.02 / steps)],
		})
	}

	setAnimation() {
		// @ts-ignore
		animProperties(this.state, this)
		// console.log("setAnimation; ", this.state)

		if (this.sprite) {
			animStates.forEach((dir) => this.sprite.classList.remove(dir))
			// @ts-ignore
			if (this.state && animStates.includes(this.state)) {
				this.sprite.classList.add(this.state)
			}
		}
	}
}

customElements.define("character-actor", CharacterActor)

/**
 *
 * @param {CharState} state
 * @param {Character} elCharacter
 */
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
		case "egg":
			animFrames = 1
			break
		//TODO default isn't needed but could reduce redundant code
		default:
			animFrames = 4
			break
	}

	elCharacter.style.setProperty("--anim-frames", String(animFrames))
}
/**
 *
 * @param {Coordinates2d} start
 * @param {Coordinates2d} destination
 * @returns {CardinalDirections}
 */
function getDominantDirection(start, destination) {
	const yDiff = destination.y - start.y
	const xDiff = destination.x - start.x

	if (Math.abs(yDiff) > Math.abs(xDiff)) {
		return yDiff > 0 ? "south" : "north"
	} else {
		return xDiff > 0 ? "east" : "west"
	}
}
