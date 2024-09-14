const pointsDisplay = document.getElementById("pointsDisplay")
let points = localStorage.getItem("points")
	? parseInt(localStorage.getItem("points"))
	: 0
const hungerMeter = document.getElementById("hungerMeter")
let hungerPoints = localStorage.getItem("hungerPoints")
	? parseFloat(localStorage.getItem("hungerPoints"))
	: 1

function moveCharacter() {
	const playfield = document.getElementById("playfield")
	const character = document.getElementById("character")

	const maxX = playfield.clientWidth - character.offsetWidth
	const maxY = playfield.clientHeight - character.offsetHeight

	const randomX = Math.random() * maxX
	const randomY = Math.random() * maxY

	character.style.transform = `translate(${randomX}px, ${randomY}px)`
}
moveCharacter()
setInterval(moveCharacter, 10000)

const directions = ["face_down", "face_up", "face_left"]
// const directions = ["face_down", "face_up", "face_left", "face_right", "anger", "expressionless", "sitting"]
let currentDirectionIndex = 0

function changeDirection() {
	const characterSprite = document.querySelector("#character")
	currentDirectionIndex = (currentDirectionIndex + 1) % directions.length
	characterSprite.setAttribute("direction", directions[currentDirectionIndex])
}
changeDirection()
setInterval(changeDirection, 8000)

const ring_icon = document.querySelector(".ring-icon")

function animPoints() {
	ring_icon.classList.remove("ring-anim")
	void ring_icon.offsetWidth // Trigger reflow to restart animation
	ring_icon.classList.add("ring-anim")
}

// Call this function whenever you want to restart the animation
// animPoints()

function testRandMeterValue() {
	// const hungerMeter = document.getElementById("hungerMeter")
	// hungerMeter.querySelector(".meter").setAttribute("value", Math.random())
	const sleepMeter = document.getElementById("sleepMeter")
	sleepMeter.querySelector(".meter").setAttribute("value", Math.random())
	const energyMeter = document.getElementById("energyMeter")
	energyMeter.querySelector(".meter").setAttribute("value", Math.random())
}
setInterval(testRandMeterValue, 2000)

function setHunger(inputPoints) {
	hungerPoints += inputPoints
	hungerPoints = clamp(hungerPoints, 0, 1)
	// if (hungerPoints < 0) hungerPoints = 0
	// if (hungerPoints > 1) hungerPoints = 1

	hungerMeter.querySelector(".meter").setAttribute("value", hungerPoints)
	localStorage.setItem("hungerPoints", hungerPoints)
}
setInterval(setHunger.bind(null, -0.02), 4000)

function addToPoints() {
	let points = localStorage.getItem("points")
		? parseInt(localStorage.getItem("points"))
		: 0
	points += 1
	pointsDisplay.textContent = points
	localStorage.setItem("points", points)

	animPoints()
}

function initGame() {
	pointsDisplay.textContent = points
	hungerMeter.querySelector(".meter").setAttribute("value", hungerPoints)
}

document.addEventListener("DOMContentLoaded", () => {
	initGame()
})

function clamp(value, min, max) {
	return Math.max(min, Math.min(value, max))
}
