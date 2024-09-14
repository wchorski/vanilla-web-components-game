class NumberCounter extends HTMLElement {
	constructor() {
		super()
		this.value = 0
	}

	connectedCallback() {
		// Get elements from the light DOM
		this.decrementButton = this.querySelector(".subtract")
		this.incrementButton = this.querySelector(".add")
		this.display = this.querySelector("span")

		//todo handle this in some `score mgmt`?
		// Attach event listeners using handleEvent
		// this.decrementButton.addEventListener("click", this)
		// this.incrementButton.addEventListener("click", this)
	}

	// handleEvent(event) {
	// 	if (event.target === this.decrementButton) {
	// 		this.value -= 1
	// 	} else if (event.target === this.incrementButton) {
	// 		this.value += 1
	// 	}

	// 	// Update the display
	// 	this.display.textContent = this.value
	// }

	// disconnectedCallback() {
	// 	// Remove event listeners when the component is detached
	// 	this.decrementButton.removeEventListener("click", this)
	// 	this.incrementButton.removeEventListener("click", this)
	// }
}

// Define the custom element
customElements.define("number-counter", NumberCounter)
