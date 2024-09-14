class HealthMeter extends HTMLElement {
	constructor() {
		super()
		this.value = 0.5
		this.label = "myMeter"
		this.hue = "17"
	}

	connectedCallback() {
		this.meter = document.createElement("progress")
		this.meter.value = this.getAttribute("value") || this.value
		this.meter.min = this.getAttribute("min") || 0
		this.meter.max = this.getAttribute("max") || 1.0
		this.meter.classList.add("meter")
		this.meter.style.setProperty(
			"--color-hue",
			this.getAttribute("hue") || this.hue
		)

		const label = document.createElement("label")
		label.innerText = this.getAttribute("label") || this.label

		this.appendChild(label)
		this.appendChild(this.meter)

		// this.updateDirection()
	}

	static get observedAttributes() {
		return ["value", "min", "max", "label", "hue"]
	}

	// attributeChangedCallback(name, oldValue, newValue) {
	// 	if (this.sprite) {
	// 		if (name === "src" && oldValue !== newValue) {
	// 			this.sprite.src = newValue
	// 		} else if (name === "direction") {
	// 			this.updateDirection()
	// 		}
	// 	}
	// }

	// updateDirection() {
	// 	const direction = this.getAttribute("direction")
	// 	const directions = [
	// 		"face_down",
	// 		"face_right",
	// 		"face_left",
	// 		"face_up",
	// 		"angry",
	// 		"expressionless",
	// 		"sitting",
	// 	]

	// 	if (this.sprite) {
	// 		directions.forEach((dir) => this.sprite.classList.remove(dir))

	// 		if (direction && directions.includes(direction)) {
	// 			this.sprite.classList.add(direction)
	// 		}
	// 	}
	// }
}

customElements.define("health-meter", HealthMeter)
