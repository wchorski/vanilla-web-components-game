// drag example - https://jsfiddle.net/LULbV/
// drag cred - https://stackoverflow.com/questions/11169554/how-to-style-dragged-element

import { hungerPoints } from "../script.js"

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

		this.isDragging = false

		this.onTouchStart = this.onTouchStart.bind(this)
		this.onTouchMove = this.onTouchMove.bind(this)
		this.onTouchEnd = this.onTouchEnd.bind(this)

		// this.onMouseDown = this.onMouseDown.bind(this)
		// this.onMouseMove = this.onMouseMove.bind(this)
		// this.onMouseUp = this.onMouseUp.bind(this)

		this.onDragStart = this.onDragStart.bind(this)
		this.onDragEnd = this.onDragEnd.bind(this)
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
          touch-action: none;

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
		this.type = this.getAttribute("type") || this.type
		this.hungerValue = this.getAttribute("hungerValue") || this.hungerValue

		this.classList.add(
			"fruit-item",
			"draggable",
			this.getAttribute("type") || this.type
		)

		this.style.left = `${this.getAttribute("x") || this.x}px`
		this.style.top = `${this.getAttribute("y") || this.y}px`
		this.setAttribute("draggable", "true")

		// Touch events
		this.addEventListener("touchstart", this.onTouchStart)
		this.addEventListener("touchmove", this.onTouchMove, { passive: false })
		this.addEventListener("touchend", this.onTouchEnd)

		// mouse Events
		this.addEventListener("dragstart", this.onDragStart)
		this.addEventListener("dragend", this.onDragEnd)

		this.innerHTML = html

		this.image = this.querySelector("img")
		this.iconImage = this.querySelector("img")
	}

	static get observedAttributes() {
		return ["type", "x", "y", "hungerValue"]
	}

	// onClick() {
	// 	this.addEventListener("click", () => {
	// 		console.log("fruit click: " + this.type)
	// 	})
	// }

	onDragStart(e) {
		this.classList.add("drag-cursor")
		// window.g_DraggedElement = e.target

		this.style.opacity = "0.2"
	}
	onDragEnd(e) {
		const offset = {
			x: 0,
			y: 0,
		}
		const { clientX, clientY } = e
		const newX = clientX - offset.x
		const newY = clientY - offset.y
		this.style.left = `${newX}px`
		this.style.top = `${newY}px`
		this.classList.remove("drag-cursor")
		this.style.opacity = "1"

		const elementsFromPoint = document.elementsFromPoint(newX, newY)
		const dropEl = elementsFromPoint[1]
		if (dropEl.tagName === "DROP-ZONE") this.onDropInZone(dropEl)
	}

	// --- Touch event handlers ---
	onTouchStart(e) {
		const touch = e.touches[0]
		this.startDrag(touch.clientX, touch.clientY)
	}

	onTouchMove(e) {
		if (!this.isDragging) return
		e.preventDefault() // Prevents scrolling or window shifting
		const touch = e.touches[0]
		this.moveElement(touch.clientX, touch.clientY)
	}

	onTouchEnd(e) {
		this.isDragging = false

		const touch = e.changedTouches[0]

		const elementsFromPoint = document.elementsFromPoint(
			touch.clientX,
			touch.clientY
		)
		const dropEl = elementsFromPoint[1]
		if (dropEl.tagName === "DROP-ZONE") this.onDropInZone(dropEl)
	}

	// --- Shared logic for both touch and mouse ---
	startDrag(x, y) {
		const rect = this.getBoundingClientRect()
		this.x = x - rect.left
		this.x = y - rect.top
		this.isDragging = true
	}

	moveElement(x, y) {
		const newLeft = x - this.x
		const newTop = y - this.x
		this.style.left = `${newLeft}px`
		this.style.top = `${newTop}px`
	}
	/**
	 * @param {HTMLElement} target
	 */
	onDropInZone(target) {
		this.classList.remove("over")
		const thisCharacter = target.parentNode.parentNode
		thisCharacter.eatRoutine(this.hungerValue)

		if (hungerPoints < 0.9) {
			this.remove()
		}

		return false
	}

	disconnectedCallback() {
		// Touch events
		this.removeEventListener("touchstart", this.onTouchStart)
		this.removeEventListener("touchmove", this.onTouchMove, { passive: false })
		this.removeEventListener("touchend", this.onTouchEnd)

		// mouse Events
		this.removeEventListener("dragstart", this.onDragStart)
		this.removeEventListener("dragend", this.onDragEnd)
	}
}
customElements.define("fruit-item", FruitItem)
