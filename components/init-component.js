// drag example - https://jsfiddle.net/LULbV/
// drag cred - https://stackoverflow.com/questions/11169554/how-to-style-dragged-element
// cred example 2 - https://github.com/prof3ssorSt3v3/web-components-props/blob/main/bigbang.js
class InitComponent extends HTMLElement {
	static stylesheetAdded = false

	constructor() {
		super()
		// props have 3 places `constructor()`, `this.getAttribute("prop")`, and `observedAttributes()`
		this.prop = "custom_prop"
		this.onClick = this.onClick.bind(this)

		if (!InitComponent.stylesheetAdded) {
			this.loadStylesheet()
			InitComponent.stylesheetAdded = true
		}

		this.render()
	}
	async loadStylesheet() {
		const response = await fetch("../css/init-component.css")
		const cssText = await response.text()
		const style = document.createElement("style")
		style.textContent = cssText

		document.head.appendChild(style)
	}

	connectedCallback() {
		this.classList.add("init-component", this.getAttribute("prop") || this.prop)
		this.prop = this.getAttribute("prop") || this.prop

		//? functions
		this.addEventListener("click", this.onClick)
	}

	static get observedAttributes() {
		return ["prop"]
	}

	get prop() {
		return this.getAttribute("prop")
	}
	/** @param {string} value */
	set prop(value) {
		this.setAttribute("prop", value)
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
		console.log("init-component removed from page.")
	}

	onClick() {
		console.log("init-component clicky")
	}

	render() {
		this.innerHTML = String.raw`
      <style>
        init-component {

        }
      </style>

      <button>
        init-component
      </button>
    `
	}
}
customElements.define("init-component", InitComponent)
