// drag example - https://jsfiddle.net/LULbV/
// drag cred - https://stackoverflow.com/questions/11169554/how-to-style-dragged-element
// cred example 2 - https://github.com/prof3ssorSt3v3/web-components-icons/blob/main/bigbang.js

/**
 * @typedef {import('../types/ButtonState.js').State} ButtonState
 * @typedef {import('../types/ButtonState.js').Icon} ButtonIcon
 */
/**
 * @extends HTMLElement
 * @element button-stateful
 * @example
 * todo paste example
 */
class ButtonStateful extends HTMLElement {
	static stylesheetAdded = false

	constructor() {
		super()
		// icons have 3 places `constructor()`, `this.getAttribute("icon")`, and `observedAttributes()`
		this.icon = "hi-star"
		this.label = this.getAttribute("label")
		//todo am i gonna fully remove action?
		this.onAction = this.onAction.bind(this)

		if (!ButtonStateful.stylesheetAdded) {
			this.loadStylesheet()
			ButtonStateful.stylesheetAdded = true
		}

		this.render()
	}
	async loadStylesheet() {
		const response = await fetch("../css/button-stateful.css")
		const cssText = await response.text()
		const style = document.createElement("style")
		style.textContent = cssText

		this.appendChild(style)
	}

	connectedCallback() {
		//todo how to get html syntax highlighting?

		this.classList.add(
			"button-stateful",
			this.getAttribute("icon") || this.icon
		)
		this.icon = this.getAttribute("icon") || this.icon
		this.iconUse = this.querySelector("use")
		this.iconSVG = this.querySelector("svg")
		this.errorEl = this.querySelector(".error")
		this.button = this.querySelector("button")
		// this.action = this.getAttribute("action")

		//? functions
		this.button.addEventListener("click", this.onAction)
	}

	static get observedAttributes() {
		return ["state", "label", "errorMsg"]
	}

	get action() {
		return this._action
	}
	/** @param {() => void} value */
	set action(value) {
		this._action = value
	}

	get state() {
		return this.getAttribute("state")
	}
	/** @param {ButtonState} value */
	set state(value) {
		this.setAttribute("state", value)
		if (!this.iconUse) return
		this.iconUse.setAttribute("href", `./icons/${this.icon}.svg#${this.icon}`)
		if (value === "loading") {
			this.button.disabled = true
		} else {
			this.button.disabled = false
		}
	}

	get icon() {
		return this.getAttribute("icon")
	}
	/** @param {"hi-star"|"hi-cog"|"hi-check"|"hi-warning"} value */
	set icon(value) {
		this.setAttribute("icon", value)
		if (!this.iconUse) return
		this.iconUse.setAttribute("href", `./icons/${this.icon}.svg#${this.icon}`)
	}

	get errorMsg() {}
	set errorMsg(value) {
		this.setAttribute("errorMsg", value)
		if (!this.errorEl) return
		this.errorEl.innerText = value
	}

	//todo how to define conditional 2nd paramter set that is dependant on 1st parameter
	/**
	 *
	 * @param {"icon"|"state"} name
	 * @param {(ButtonIcon)|(ButtonState)} oldValue
	 * @param {(ButtonIcon)|(ButtonState)} newValue
	 */
	attributeChangedCallback(name, oldValue, newValue) {
		// if (name === "icon" && oldValue !== newValue) {
		// 	console.log("attributeChangedCallback: ", newValue)
		// }
		if (name === "state" && oldValue !== newValue) {
			switch (newValue) {
				case "loading":
					this.icon = "hi-cog"
					break

				case "success":
					this.button.disabled = false
					this.icon = "hi-check"
					break

				case "error":
					this.button.disabled = false
					this.icon = "hi-warning"
					break

				default:
					this.button.disabled = false
					this.icon = "hi-star"
					break
			}

			newValue === "loading"
				? this.iconSVG.classList.add("spin")
				: this.iconSVG.classList.remove("spin")
		}
	}

	disconnectedCallback() {
		// remove any event listeners
		this.removeEventListener("click", this.onAction)
	}

	onAction() {
		this._action()
	}

	render() {
		this.innerHTML = String.raw`

      <button type="button">
        <span>
          ${this.label}
        </span>

        <svg class="icon" width="15" height="15">
          <use href="./icons/${this.icon}.svg#${this.icon}"></use>
        </svg>
        
      </button>
      <p class="error">${this.errorMsg || ""}</p>
    `
	}
}
customElements.define("button-stateful", ButtonStateful)
