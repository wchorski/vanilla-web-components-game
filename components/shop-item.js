// drag example - https://jsfiddle.net/LULbV/
// drag cred - https://stackoverflow.com/questions/11169554/how-to-style-dragged-element

import { buyItemWithPoints, initCharacterUI } from "../script.js"
import { FruitItem } from "./fruit-item.js"
import { CharacterActor } from "./character-actor.js"
/**
 * @extends HTMLElement
 * @element shop-item
 * @example
 * todo paste example
 */
class ShopItem extends HTMLElement {
	static stylesheetAdded = false

	constructor() {
		super()
		// props have 3 places `constructor()`, `this.getAttribute("prop")`, and `observedAttributes()`
		// this.type = "round"
		this.hungerValue = 0.3
		this.cost = 30
		this.onTap = this.onTap.bind(this)

		if (!ShopItem.stylesheetAdded) {
			this.loadStylesheet()
			ShopItem.stylesheetAdded = true
		}

		this.render()
	}
	async loadStylesheet() {
		const response = await fetch("../css/shop-item.css")
		const cssText = await response.text()
		const style = document.createElement("style")
		style.textContent = cssText

		this.appendChild(style)
	}

	connectedCallback() {
		//todo how to get html syntax highlighting?

		// this.type = this.getAttribute("type") || this.type
		this.hungerValue = this.getAttribute("hungerValue") || this.hungerValue
		this.cost = parseInt(this.getAttribute("cost") || this.cost)
		// this.setAttribute("draggable", "true")
		this.classList.add("shop-item")
		this.fruitItem = this.querySelector(".fruit-item")
		this.costLabel = this.querySelector(".costLabel")
		this.costLabel.innerHTML = this.cost
		this.img = this.querySelector("img")
		this.src = this.getAttribute("src")
		this.type = this.getAttribute("type") || "fruit_round"

		//? functions
		this.addEventListener("pointerdown", this.onTap)
	}

	static get observedAttributes() {
		return ["type", "cost", "src"]
	}

	get src() {
		return this.getAttribute("src")
	}
	set src(value) {
		this.setAttribute("src", value)
	}
	/**
	 * todo why does this `|string` remove the auto complete?
	 * @type {'round'|'tri'|'curved'|'egg'}
	 * @attr {string} type
	 */
	get type() {
		// @ts-ignore
		return this.getAttribute("type")
	}
	set type(value) {
		this.setAttribute("type", value)
	}

	attributeChangedCallback(name, oldValue, newValue) {
		// if (name === "icon" && oldValue !== newValue) {
		// 	console.log("attributeChangedCallback: ", newValue)
		// }
		if (name === "src" && this.img) {
			this.img.src = newValue
		}
		if (name === "type" && this.img) {
			this.fruitItem.classList.add(newValue)
		}
	}

	onTap(e) {
		const isEnoughMoney = buyItemWithPoints(this.cost)
		if (!isEnoughMoney) return
		switch (this.type) {
			case "egg":
				const char = {
					id: `char-${Math.random().toString(36).substring(2, 6)}`,
					state: "egg",
					hunger: 1.0,
					sleep: 1.0,
					energy: 1.0,
					happyness: 1.0,
				}
				if (!customElements.get("character-actor"))
					return console.log("!!! no character-actor component")

				const charEgg = new CharacterActor()

				charEgg.id = char.id
				charEgg.classList.add("character")
				charEgg.setAttribute("src", "./sprites/chao-neutral-v6.png")
				charEgg.setAttribute("state", char.state)
				charEgg.setAttribute("hunger", String(char.hunger))
				charEgg.setAttribute("sleep", String(char.sleep))
				charEgg.setAttribute("energy", String(char.energy))
				charEgg.setAttribute("happyness", String(char.happyness))
				charEgg.setAttribute("x", "0")
				charEgg.setAttribute("y", "0")
				initCharacterUI([char])

				window.playfield.appendChild(charEgg)
				break

			//default to 'fruit_*'
			default:
				const purchasedFruitItem = new FruitItem()
				purchasedFruitItem.setAttribute("type", this.type)
				//todo howto get `hungerValue` from fruit-item component. or maybe use some sort of global switch statement with this.type
				purchasedFruitItem.setAttribute("hungerValue", this.hungerValue)
				window.playfield.appendChild(purchasedFruitItem)
				break
		}
	}

	render() {
		this.innerHTML = String.raw`

      <div class="fruit-item">
        <img class="icon no-select" src="./sprites/fruits-v2.png" alt="Shop item" />
      </div>
      <span class="costLabel"> ${this.cost} </span>
    `
	}
}
customElements.define("shop-item", ShopItem)
