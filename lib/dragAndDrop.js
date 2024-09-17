//todo deal with multip.e
const draggables = document.querySelectorAll(".draggable")
let offsetX = 0
let offsetY = 0
let isDragging = false

Array.from(draggables).map((draggable) => {
	draggable.ondragstart = function () {
		return false
	}

	draggable.addEventListener("mousedown", (event) => {
		offsetX = event.clientX - draggable.offsetLeft
		offsetY = event.clientY - draggable.offsetTop
		isDragging = true
		draggable.style.cursor = "grabbing"
	})

	document.addEventListener("mousemove", (event) => {
		if (isDragging) {
			draggable.style.left = `${event.clientX - offsetX}px`
			draggable.style.top = `${event.clientY - offsetY}px`
		}
	})

	document.addEventListener("mouseup", () => {
		isDragging = false
		draggable.style.cursor = "grab"
	})
})
