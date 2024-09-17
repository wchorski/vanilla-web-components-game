// drag example - https://jsfiddle.net/LULbV/
// drag cred - https://stackoverflow.com/questions/11169554/how-to-style-dragged-element

import { buyItemWithPoints } from "../script.js"

class ShopItem extends HTMLElement {
	constructor() {
		super()
		// props have 3 places `constructor()`, `this.getAttribute("prop")`, and `observedAttributes()`
		this.type = "round"
		this.cost = 30
	}
	connectedCallback() {
		//todo how to get html syntax highlighting?
		const html = String.raw`
      <style>
        shop-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          z-index: 11;
        }

        .fruit-item {

   
          width: 16px;
          height: 16px;
          overflow: hidden;
          z-index: 9;

          img {
            /* animation-name: animFruitSprite; */
            animation-duration: 1s;
            animation-timing-function: steps(7);
            animation-iteration-count: infinite;
            width: auto;
            pointer-events: none;
          }
        }

        .fruit-item.round {
          img{
            transform: translate3d(0, 0, 0);
          }
        }
        .fruit-item.curved {
          img{
            transform: translate3d(0, calc(16px * -1), 0);
          }
        }
        .fruit-item.heart {
          img{
            transform: translate3d(0, calc(16px * -2), 0);
          }
        }
        .fruit-item.hex {
          img{
            transform: translate3d(0, calc(16px * -3), 0);
          }
        }
        .fruit-item.tri {
          img{
            transform: translate3d(0, calc(16px * -4), 0);
          }
        }
        .fruit-item.drop {
          img{
            transform: translate3d(0, calc(16px * -5), 0);
          }
        }
        .fruit-item.square {
          img{
            transform: translate3d(0, calc(16px * -6), 0);
          }
        }

      </style>

      <div class="fruit-item">
        <img class="icon no-select" src="./sprites/fruits-v2.png" alt="Shop item" />
      </div>
      <span class="costLabel"> ${this.cost} </span>
    `

		this.innerHTML = html
		this.type = this.getAttribute("type") || this.type
		this.cost = parseInt(this.getAttribute("cost") || this.cost)
		// this.setAttribute("draggable", "true")
		this.classList.add("shop-item")
		this.fruitItem = this.querySelector(".fruit-item")
		this.fruitItem.classList.add(this.getAttribute("type") || this.type)
		this.costLabel = this.querySelector(".costLabel")
		this.costLabel.innerHTML = this.cost

		//? functions
		// this.onDrag()
		this.onClick()
	}

	static get observedAttributes() {
		return ["type", "cost"]
	}

	onClick() {
		this.addEventListener("mousedown", (e) => {
			console.log("shop: ", this.type)
			const isEnoughMoney = buyItemWithPoints(this.cost)
			if (!isEnoughMoney) return
			const purchasedFruitItem = document.createElement("fruit-item")
			purchasedFruitItem.setAttribute("type", this.type)
			//todo howto get `hungerValue` from fruit-item component. or maybe use some sort of global switch statement with this.type
			purchasedFruitItem.setAttribute("hungerValue", parseFloat(0.3))
			window.playfield.appendChild(purchasedFruitItem)
			//todo
			// 1. remove from ringPoints
			// 2. randomly place the fruit
			// 3. try to spawn while dragging fruit (onmousdown?)
		})
	}

	// onDrag() {
	// 	this.addEventListener(
	// 		"dragstart",
	// 		(e) => {
	// 			console.log("shop-item draggy")
	// 		},
	// 		false
	// 	)
	// }
}
customElements.define("shop-item", ShopItem)
