import { envs } from "../envs.js"

/**
 * <progress> element with label
 * @extends HTMLElement
 * @element health-meter
 * @example
 * todo paste example
 */
export class HealthMeter extends HTMLElement {
	static stylesheetAdded = false

	constructor() {
		super()
		// this.value = 0.5
		this.isInitialized = false

		if (!HealthMeter.stylesheetAdded) {
			this.loadStylesheet()
			HealthMeter.stylesheetAdded = true
		}

		this.render()
	}

	async loadStylesheet() {
		const response = await fetch(envs.ENDPOINT + "/css/health-meter.css")
		const cssText = await response.text()
		const style = document.createElement("style")
		style.textContent = cssText

		this.appendChild(style)
	}

	connectedCallback() {
		// this.value = Number(this.getAttribute("value"))

		this.labelEl = this.querySelector("label")
		this.meter = this.querySelector("progress")

		//defaults
		this.meter.value = this.getAttribute("value") || 0.5
		this.meter.min = this.getAttribute("min") || 0
		this.meter.max = this.getAttribute("max") || 1.0
		this.meter.style.setProperty(
			"--color-hue",
			this.getAttribute("hue") || "10"
		)

		this.isInitialized = true
	}
	/** @returns {number} */
	get value() {
		return Number(this.getAttribute("value"))
	}
	/** @param {number} val */
	set value(val) {
		this.setAttribute("value", String(val))
	}

	/**@returns {string}*/
	get label() {
		return this.getAttribute("label")
	}
	/**@param {string} val*/
	set label(val) {
		this.setAttribute("label", String(val))
	}

	/**@returns {string}*/
	get hue() {
		return this.getAttribute("hue")
	}
	/**@param {string} val*/
	set hue(val) {
		this.setAttribute("hue", String(val))
	}

	static get observedAttributes() {
		return ["value", "min", "max", "label", "hue"]
	}
	/**
	 *
	 * @param {"value"|"min"|"max"|"label"|"hue"} name
	 * @param {*} prevValue
	 * @param {*} newValue
	 */
	attributeChangedCallback(name, prevValue, newValue) {
		if (!this.isInitialized) return console.log("HealthMeter not initialized")

		if (name === "value") {
			// console.log("attr value: ", newValue)
			this.meter.value = newValue ? newValue : 0.0
		}

		if (name === "label") {
			this.labelEl.innerHTML = newValue
		}

		if (name === "hue") {
			this.meter.style.setProperty("--color-hue", newValue || "10")
		}
	}

	render() {
		this.innerHTML = String.raw`
      <label>${this.label}</label>
      <progress value="0.79375" max="1" class="meter" ></progress>
    `
	}
}

customElements.define("health-meter", HealthMeter)
