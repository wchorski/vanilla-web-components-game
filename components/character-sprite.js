class CharacterSprite extends HTMLElement {
	constructor() {
		super()
		this.sprite = null
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
		emote.src = "chaos/emote.png"
		emote.alt = "Character Emote"
		emote.classList.add("char_emote")

		this.appendChild(emote_wrap)
		emote_wrap.appendChild(emote)
		this.appendChild(shadow)
		this.appendChild(sprite_wrap)
		sprite_wrap.appendChild(this.sprite)

		const dropZone = document.createElement("drop-zone")
		this.appendChild(dropZone)

		this.updateDirection()
	}

	static get observedAttributes() {
		return ["src", "alt", "direction"]
	}

	attributeChangedCallback(name, oldValue, newValue) {
		if (this.sprite) {
			if (name === "src" && oldValue !== newValue) {
				this.sprite.src = newValue
			} else if (name === "direction") {
				this.updateDirection()
			}
		}
	}

	updateDirection() {
		const direction = this.getAttribute("direction")
		const directions = [
			"face_down",
			"face_right",
			"face_left",
			"face_up",
			"angry",
			"expressionless",
			"sitting",
		]

		if (this.sprite) {
			directions.forEach((dir) => this.sprite.classList.remove(dir))

			if (direction && directions.includes(direction)) {
				this.sprite.classList.add(direction)
			}
		}
	}
}

customElements.define("character-sprite", CharacterSprite)
