// drag example - https://jsfiddle.net/LULbV/
// drag cred - https://stackoverflow.com/questions/11169554/how-to-style-dragged-element

class InitComponent extends HTMLElement {
	constructor() {
		super()
		// props have 3 places `constructor()`, `this.getAttribute("prop")`, and `observedAttributes()`
		this.prop = "custom_prop"
	}
	connectedCallback() {
		//todo how to get html syntax highlighting?
		const html = String.raw`
      <style>
        init-component {

        }
      </style>

      <div></div>
    `

		this.innerHTML = html
		this.classList.add("init-component", this.getAttribute("prop") || this.prop)
		this.prop = this.getAttribute("prop") || this.prop

		//? functions
		this.onClick()
	}

	static get observedAttributes() {
		return ["prop"]
	}

	onClick() {
		this.addEventListener("click", () => {
			console.log("init-component clicky")
		})
	}
}
customElements.define("init-component", InitComponent)
