// drag example - https://jsfiddle.net/LULbV/
// drag cred - https://stackoverflow.com/questions/11169554/how-to-style-dragged-element
import { setHunger } from "../script.js"

class DropZone extends HTMLElement {
	constructor() {
		super()
		// props have 3 places `constructor()`, `this.getAttribute("prop")`, and `observedAttributes()`
		this.prop = "custom_prop"
		this.class = "drop-zone"
	}
	connectedCallback() {
		const html = String.raw`
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

		this.innerHTML = html
		this.classList.add(this.getAttribute("class"))
		this.classList.add("drop-zone")
		this.prop = this.getAttribute("prop") || this.prop

		//? functions
		this.onDrop()
	}

	static get observedAttributes() {
		return ["class"]
	}

	onDrop() {
		//when drag item is hovering over
		this.addEventListener("dragover", (e) => {
			e.preventDefault()

			e.dataTransfer.dropEffect = "copy"
			return false
		})

		this.addEventListener("dragenter", (e) => {
			this.classList.add("over")
		})

		this.addEventListener("dragleave", (e) => {
			this.classList.remove("over")
		})

		this.addEventListener("drop", (e) => {
			e.preventDefault()
			e.stopPropagation()
			// //? target is the <drop-zone> itself
			// console.log("e.target: ", e.target)
			// console.log("e.dataTransfer: ", e.dataTransfer)

			// const draggableElementId = e.dataTransfer.getData("text/html")
			// const draggableElement = document.getElementById(draggableElementId)
			// if (draggableElement) e.target.appendChild(draggableElement)
			// console.log("draggableElementId: ", draggableElementId)
			// console.log("draggableElement: ", draggableElement)

			// // Access properties of the dropped element
			// const itemType = e.target.getAttribute("type")
			// console.log("dropped in dropzone: ", itemType)

			// return false
			// if (window.g_DraggedElement) {
			// 	e.target.appendChild(window.g_DraggedElement)
			// }

			// const itemType = e.target.getAttribute("type")
			const itemType = window.g_DraggedElement.getAttribute("type")
			const hungerValue = parseFloat(
				window.g_DraggedElement.getAttribute("hungerValue")
			)
			this.classList.remove("over")

			//todo add chao feed from fruit + hungerPoints
			setHunger(hungerValue)
			//todo remove fruit from playfield
			window.g_DraggedElement.remove()
			window.g_DraggedElement = null

			return false
		})
	}
}
customElements.define("drop-zone", DropZone)
