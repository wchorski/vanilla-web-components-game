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

		// this.onMouseEnter = this.onMouseEnter.bind(this)
		// this.onPointerUp = this.onPointerUp.bind(this)
		// this.onPointerEnter = this.onPointerEnter.bind(this)
		// this.onPointerLeave = this.onPointerLeave.bind(this)

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

		// this.addEventListener("mouseenter", this.onMouseEnter)
		// this.addEventListener("pointerup", this.onPointerUp)
		// this.addEventListener("pointerenter", this.onPointerEnter)
		// this.addEventListener("pointerleave", this.onPointerLeave)

		// Touch support
		this.addEventListener("touchmove", this.onTouchMove)
		this.addEventListener("touchend", this.onTouchEnd)

		this.classList.add(this.getAttribute("class"))
		this.classList.add("drop-zone")
		this.prop = this.getAttribute("prop") || this.prop

		//? functions
		// this.onDrop()
	}

	static get observedAttributes() {
		return ["class"]
	}

	// onPointerUp(e) {
	// 	console.log("onPointerUp")
	// }
	// onPointerEnter(e) {
	// 	console.log("onPointerEnter")
	// 	this.classList.add("over")
	// }
	// onPointerLeave(e) {
	// 	console.log("onPointerLeave")
	// 	this.classList.remove("over")
	// }
	// onMouseEnter(e) {
	// 	// console.log("onMouseEnter")
	// }

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

		console.log(targetElement)
		// if (this.touchActive) {
		// 	this.touchActive = false
		// 	this.classList.remove("over")
		// 	alert("Element dropped successfully (touch)!")
		// }
	}

	// --- Drag and Drop (Desktop) ---
	onDragOver(e) {
		e.preventDefault() // Necessary to allow the drop
	}

	onDrop(e) {
		e.preventDefault()
		e.stopPropagation()
		this.classList.remove("over")
		// console.log(e.target)

		// // Handle the drop event
		// const droppedElementData = e.dataTransfer.getData("text")
		// if (droppedElementData === "fruit-item") {
		// 	alert("Element dropped successfully!")
		// }
	}

	onDragEnter() {
		this.classList.add("over")
	}

	onDragLeave() {
		this.classList.remove("over")
	}
}
customElements.define("drop-zone", DropZone)
