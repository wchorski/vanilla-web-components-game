class DropZone extends HTMLElement {
	constructor() {
		super()
		this.addEventListener("touchenter", this.handleTouchEnter)
		this.addEventListener("touchleave", this.handleTouchLeave)
		this.addEventListener("touchend", this.handleTouchEnd)
	}

	handleTouchEnter = (event) => {
		this.classList.add("hover")
	}

	handleTouchLeave = (event) => {
		this.classList.remove("hover")
	}

	handleTouchEnd = (event) => {
		const draggableId = event.target.getAttribute("data-id")
		if (draggableId) {
			this.dispatchEvent(
				new CustomEvent("itemDropped", { detail: draggableId })
			)
		}
		this.classList.remove("hover")
	}
}

customElements.define("gptdrop-zone", DropZone)
