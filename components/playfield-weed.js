// drag example - https://jsfiddle.net/LULbV/
// drag cred - https://stackoverflow.com/questions/11169554/how-to-style-dragged-element
// cred example 2 - https://github.com/prof3ssorSt3v3/web-components-props/blob/main/bigbang.js
class PlayfieldWeed extends HTMLElement {
	static stylesheetAdded = false

	constructor() {
		super()
		// props have 3 places `constructor()`, `this.getAttribute("prop")`, and `observedAttributes()`
		this.prop = "custom_prop"
		this.onClick = this.onClick.bind(this)

		// if (!PlayfieldWeed.stylesheetAdded) {
		// 	this.loadStylesheet()
		// 	PlayfieldWeed.stylesheetAdded = true
		// }

		this.render()
	}
	async loadStylesheet() {
		const response = await fetch("../css/playfield-weed.css")
		const cssText = await response.text()
		const style = document.createElement("style")
		style.textContent = cssText

		this.appendChild(style)
	}

	connectedCallback() {
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
		console.log("playfield-weed removed from page.")
	}

	onClick() {
		console.log("playfield-weed clicky")
	}

	render() {
		this.innerHTML = String.raw`
      <style>
        playfield-weed {
          position: absolute;
          width: 16px;
          height: 16px;
          overflow: hidden;
          z-index: 9;
          touch-action: none;

          img {
            // animation-name: animFruitSprite;
            animation-duration: 10s;
            animation-timing-function: steps(7);
            animation-iteration-count: infinite;
            width: auto;
            pointer-events: none;
          }
        }
      </style>

      <img src="./sprites/weed.png" alt="Pluckable Weed" />
    `
	}
}
customElements.define("playfield-weed", PlayfieldWeed)
