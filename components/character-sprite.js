import { setSleep } from "../script.js"

class CharacterSprite extends HTMLElement {
	constructor() {
		super()
		this.sprite = null
		this.state = "face_still"
		this.sleepPoints = 1.0
		//todo either
		//1. distance travel ups or lowers speed
		//2. speed up or low depending on distance
		this.speed = 1900
		this.x = 0
		this.y = 0
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

		this.updateState()
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
				this.updateState()
			}
		}
	}

	updateTranslate() {
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

		this.style.transform = `translate(${current})`
		this.animate(
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
		//? reset to stop when done anim
		setTimeout(() => {
			this.state = "face_still"
			this.updateState()
		}, this.speed)

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
		this.updateState()

		this.x = destinationPos.x
		this.y = destinationPos.y
	}

	updateState() {
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

	setSleep() {
		this.state = "sleep"
		this.updateState()
		const sleepIntervalId = setInterval(() => {
			// this.sleepPoints += 0.2
			setSleep(0.06)
		}, 2000)

		setTimeout(() => {
			clearInterval(sleepIntervalId)
		}, 2000)
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
