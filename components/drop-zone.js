// drag example - https://jsfiddle.net/LULbV/
// drag cred - https://stackoverflow.com/questions/11169554/how-to-style-dragged-element

class DropZone extends HTMLElement {
	constructor() {
		super()
		// props have 3 places `constructor()`, `this.getAttribute("prop")`, and `observedAttributes()`
		this.prop = "custom_prop"
		this.class = "drop-zone"
		this.onDrop = this.onDrop.bind(this)
		this.onTouchMove = this.onTouchMove.bind(this)
		this.onTouchEnd = this.onTouchEnd.bind(this)

		this.touchActive = false
	}
	connectedCallback() {
		this.innerHTML = String.raw`
      <style>
        drop-zone {
          position: absolute;
          top: 0;
          width: 24px;
          height: 24px;
          background-color: transparent;
          display: grid;
          place-content: center;
          // border: dotted 1px #ffffffa3;
          // box-shadow: inset 2px 2px 5px 6px #0000006e;
          transition-property: background, filter;
          transition-duration: .3s;
        }

        drop-zone.over {
          background-color: hsl(60deg 100% 50% / 33%);
          filter: saturate(0.4);
        }

        drop-zone * {
          pointer-events: none;
        }
      </style>
    `

		// Prevent the default behavior so drop event can occur (for desktop)
		this.addEventListener("dragover", this.onDragOver)
		this.addEventListener("drop", this.onDrop)
		this.addEventListener("dragenter", this.onDragEnter)
		this.addEventListener("dragleave", this.onDragLeave)

		// Touch support
		this.addEventListener("touchmove", this.onTouchMove)
		this.addEventListener("touchend", this.onTouchEnd)

		this.classList.add(this.getAttribute("class"))
		this.classList.add("drop-zone")
		this.prop = this.getAttribute("prop") || this.prop
	}

	static get observedAttributes() {
		return ["class"]
	}

	// --- Touch Support for Mobile ---
	onTouchMove(e) {
		e.preventDefault() // Prevent scrolling
		this.touchActive = true
		this.classList.add("over") // Indicate dragging over zone
	}

	onTouchEnd(e) {
		console.log("drop-zone: touchend")

		const touch = e.changedTouches[0] // Get the first touch point

		const targetElement = document.elementFromPoint(
			touch.clientX,
			touch.clientY
		)
	}

	// --- Drag and Drop (Desktop) ---
	onDragOver(e) {
		e.preventDefault() // Necessary to allow the drop
	}

	onDrop(e) {
		e.preventDefault()
		e.stopPropagation()
		this.classList.remove("over")
	}

	onDragEnter() {
		this.classList.add("over")
	}

	onDragLeave() {
		this.classList.remove("over")
	}
}
customElements.define("drop-zone", DropZone)
