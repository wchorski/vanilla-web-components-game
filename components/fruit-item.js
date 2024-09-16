class FruitItem extends HTMLElement {
	constructor() {
		super()
		this.type = "round"
		this.x = 30
		this.y = 30
		this.image = this.querySelector("img")
	}
	connectedCallback() {
		//todo how to get html syntax highlighting?
		const html = String.raw`
      <style>
        fruit-item {

          position: absolute;
          width: 76px;
          height: 76px;
          overflow: hidden;

          img {
            /* animation-name: animFruitSprite; */
            animation-duration: 1s;
            animation-timing-function: steps(7);
            animation-iteration-count: infinite;
            width: 76px;
            pointer-events: none;
          }
        }

        @keyframes animFruitSprite {
          from {
            transform: translate3d(0, 0px, 0);
          }
          to {
            transform: translate3d(0, -502px, 0);
          }
        }

        fruit-item.round {
          img{
            transform: translate3d(0, 0, 0);
          }
        }
        fruit-item.curved {
          img{
            transform: translate3d(0, -76px, 0);
          }
        }
        fruit-item.heart {
          img{
            transform: translate3d(0, -152px, 0);
          }
        }
        fruit-item.hex {
          img{
            transform: translate3d(0, -228px, 0);
          }
        }
        fruit-item.tri {
          img{
            transform: translate3d(0, -290px, 0);
          }
        }
        fruit-item.drop {
          img{
            transform: translate3d(0, -366px, 0);
          }
        }
        fruit-item.square {
          img{
            transform: translate3d(0, -432px, 0);
          }
        }
      </style>

      <img class="icon no-select" src="./sprites/fruits.png" alt="Fruit item" />
    `
		this.classList.add(
			"fruit-item",
			"draggable",
			this.getAttribute("type") || this.type
		)

		this.innerHTML = html

		this.style.left = `${this.getAttribute("x") || this.x}px`
		this.style.top = `${this.getAttribute("y") || this.y}px`

		this.iconImage = this.querySelector("img")
		this.setAttribute("draggable", "true")
		this.initDrag()

		this.addEventListener("click", () => {
			console.log("clicky")
		})
	}

	static get observedAttributes() {
		return ["type", "x", "y"]
	}

	initDrag() {
		let offsetX = 0
		let offsetY = 0

		this.addEventListener(
			"dragstart",
			(event) => {
				console.log(event)
				this.classList.add("drag-cursor")

				const previewImg = new Image()

				const previewSrc = (() => {
					switch (this.type) {
						case "round":
							return "./sprites/fruit-round.png"
						case "curved":
							return "./sprites/fruit-round.png"
						case "tri":
							return "./sprites/fruit-round.png"
						// is a 1x1 pixel transparent image.
						default:
							return "data:image/gif;base64,R0lGODlhAQABAIAAAAAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=="
					}
				})()
				previewImg.src = previewSrc
				event.dataTransfer.setDragImage(previewImg, 0, 0)

				event.dataTransfer.dropEffect = "none"
				offsetX = event.clientX - this.getBoundingClientRect().left
				offsetY = event.clientY - this.getBoundingClientRect().top
				event.dataTransfer.setData("text/plain", "") // Required for drag to work
			},
			false
		)

		this.addEventListener("dragend", (event) => {
			const newX = event.clientX - offsetX
			const newY = event.clientY - offsetY
			this.style.left = `${newX}px`
			this.style.top = `${newY}px`
			this.classList.remove("drag-cursor")
		})

		document.addEventListener("dragover", (event) => {
			event.preventDefault() // Necessary to allow dropping
		})
	}
}
customElements.define("fruit-item", FruitItem)
