// drag example - https://jsfiddle.net/LULbV/
// drag cred - https://stackoverflow.com/questions/11169554/how-to-style-dragged-element

class FruitItem extends HTMLElement {
	constructor() {
		super()
		this.type = "round"
		const maxX = window.playfield.clientWidth - character.offsetWidth
		const maxY = window.playfield.clientHeight - character.offsetHeight
		const randomX = Math.random() * maxX
		const randomY = Math.random() * maxY
		this.x = randomX
		this.y = randomY
		this.image = this.querySelector("img")
		this.hungerValue = 0.3
	}
	connectedCallback() {
		const html = String.raw`
      <style>
        fruit-item {

          position: absolute;
          width: 16px;
          height: 16px;
          overflow: hidden;
          z-index: 9;

          img {
            // animation-name: animFruitSprite;
            animation-duration: 10s;
            animation-timing-function: steps(7);
            animation-iteration-count: infinite;
            width: auto;
            pointer-events: none;
          }
        }

        @keyframes animFruitSprite {
          from {
            transform: translate3d(0, 0px, 0);
          }
          to {
            transform: translate3d(0, calc(16px * -7), 0);
          }
        }

        fruit-item.round {
          img{
            transform: translate3d(0, 0, 0);
          }
        }
        fruit-item.curved {
          img{
            transform: translate3d(0, calc(16px * -1), 0);
          }
        }
        fruit-item.heart {
          img{
            transform: translate3d(0, calc(16px * -2), 0);
          }
        }
        fruit-item.hex {
          img{
            transform: translate3d(0, calc(16px * -3), 0);
          }
        }
        fruit-item.tri {
          img{
            transform: translate3d(0, calc(16px * -4), 0);
          }
        }
        fruit-item.drop {
          img{
            transform: translate3d(0, calc(16px * -5), 0);
          }
        }
        fruit-item.square {
          img{
            transform: translate3d(0, calc(16px * -6), 0);
          }
        }
      </style>
     
      <img class="icon no-select" src="./sprites/fruits-v2.png" alt="Fruit item" />
    `
		this.innerHTML = html
		this.type = this.getAttribute("type") || this.type
		this.hungerValue = this.getAttribute("hungerValue") || this.hungerValue

		this.classList.add(
			"fruit-item",
			"draggable",
			this.getAttribute("type") || this.type
		)

		this.image = this.querySelector("img")

		this.style.left = `${this.getAttribute("x") || this.x}px`
		this.style.top = `${this.getAttribute("y") || this.y}px`

		this.iconImage = this.querySelector("img")
		this.setAttribute("draggable", "true")
		this.onDrag()
		// this.onClick()
	}

	static get observedAttributes() {
		return ["type", "x", "y", "hungerValue"]
	}

	// onClick() {
	// 	this.addEventListener("click", () => {
	// 		console.log("fruit click: " + this.type)
	// 	})
	// }

	onDrag() {
		let offsetX = 0
		let offsetY = 0

		this.addEventListener(
			"dragstart",
			(event) => {
				this.classList.add("drag-cursor")
				// event.dataTransfer.setData("text/html", event.target.outerHTML)
				//? do i need this line?
				event.dataTransfer.effectAllowed = "copy"

				window.g_DraggedElement = event.target

				//todo old stuff
				// const previewImg = new Image()

				// const previewSrc = (() => {
				// 	switch (this.type) {
				// 		case "round":
				// 			return "./sprites/fruit-round.png"
				// 		case "curved":
				// 			return "./sprites/fruit-round.png"
				// 		case "tri":
				// 			return "./sprites/fruit-round.png"
				// 		// is a 1x1 pixel transparent image.
				// 		default:
				// 			return "data:image/gif;base64,R0lGODlhAQABAIAAAAAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=="
				// 	}
				// })()
				// previewImg.src = previewSrc
				// // event.dataTransfer.setDragImage(previewImg, 0, 0)
				// // event.dataTransfer.setDragImage(new Image(), 0, 0)

				// event.dataTransfer.dropEffect = "copy"
				// offsetX = event.clientX - this.getBoundingClientRect().left
				// offsetY = event.clientY - this.getBoundingClientRect().top
				// // event.dataTransfer.setData("text/plain", "") // Required for drag to work
			},
			false
		)

		this.addEventListener("drag", (event) => {
			// here I want to style the ghost element, not the source...
		})
		this.addEventListener("dragover", (event) => {
			event.preventDefault()

			event.dataTransfer.dropEffect = "copy"
			return false
		})
		//? prob don't need them but keeping them around for ref
		// this.addEventListener("dragenter", function (e) {
		// 	this.classList.add("dragging")``
		// })

		// this.addEventListener("dragleave", function (e) {
		// 	this.classList.remove("dragging")``
		// })

		this.addEventListener("dragend", (event) => {
			const newX = event.clientX - offsetX
			const newY = event.clientY - offsetY
			this.style.left = `${newX}px`
			this.style.top = `${newY}px`
			this.classList.remove("drag-cursor")
			// console.log("dragend: drop it like its hot")
		})
	}
}
customElements.define("fruit-item", FruitItem)
