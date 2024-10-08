// drag example - https://jsfiddle.net/LULbV/
// drag cred - https://stackoverflow.com/questions/11169554/how-to-style-dragged-element

import { envs } from "../envs.js"
import { randomValueBetweenRange } from "../lib/clamp.js"
import { addToPoints } from "../script.js"

// cred example 2 - https://github.com/prof3ssorSt3v3/web-components-props/blob/main/bigbang.js
export class PlayfieldWeed extends HTMLElement {
	static stylesheetAdded = false

	constructor() {
		super()
		// props have 3 places `constructor()`, `this.getAttribute("prop")`, and `observedAttributes()`
		this.onClick = this.onClick.bind(this)

		if (!PlayfieldWeed.stylesheetAdded) {
			this.loadStylesheet()
			PlayfieldWeed.stylesheetAdded = true
		}
	}
	async loadStylesheet() {
		const response = await fetch(envs.ENDPOINT + "/css/playfield-weed.css")
		const cssText = await response.text()
		const style = document.createElement("style")
		style.textContent = cssText

		this.appendChild(style)
	}

	connectedCallback() {
		this.prop = "custom_prop"
		this.ringValue = randomValueBetweenRange(5, 30)
		this.classList.add("playfield-weed", "playfield-item")

		if (!this.x || !this.y) {
			const maxX = window.playfield.clientWidth - this.offsetWidth
			const maxY = window.playfield.clientHeight - this.offsetHeight
			const randomX = Math.random() * maxX
			const randomY = Math.random() * maxY
			this.x = randomX
			this.y = randomY
		}

		this.style.left = `${this.x}px`
		this.style.top = `${this.y}px`

		//? functions
		this.addEventListener("click", this.onClick)

		this.render()
	}

	/** @returns {number} */
	get x() {
		return Number(this.getAttribute("x"))
	}
	/** @param {number} val */
	set x(val) {
		this.setAttribute("x", String(val))
	}
	/** @returns {number} */
	get y() {
		return Number(this.getAttribute("y"))
	}
	/** @param {number} val */
	set y(val) {
		this.setAttribute("y", String(val))
	}

	static get observedAttributes() {
		return ["x", "y"]
	}

	/**
	 *
	 * @param {"prop"} name
	 * @param {*} oldValue
	 * @param {*} newValue
	 */
	attributeChangedCallback(name, oldValue, newValue) {
		//todo here is where i should change animation and sprites.
		//as i set this.state handle all the visual stuff down here
		// console.log(`character-sprite: `, name, oldValue, newValue)
		if (name === "prop" && oldValue !== newValue) {
			console.log("attributeChangedCallback: ", newValue)
		}
	}

	disconnectedCallback() {
		// remove any event listeners
		this.removeEventListener("click", this.onClick)
		console.log("playfield-weed removed from page.")
	}

	onClick() {
		this.classList.add("animate")

		addPointsDelayed(0.1, this.ringValue)

		setTimeout(() => {
			this.remove()
			// this.classList.remove("animate")
		}, 2000)
	}

	render() {
		this.innerHTML = String.raw`
      <img src="./sprites/weed.png" alt="Pluckable Weed" />
      <span class="point_score"> +${this.ringValue} </span>
    `
	}
}
customElements.define("playfield-weed", PlayfieldWeed)

async function addPointsDelayed(delay, iterations) {
	for (let index = 0; index < iterations; index++) {
		await new Promise((resolve) => setTimeout(resolve, delay))
		addToPoints()
	}
}
