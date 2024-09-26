// import "./lib/dragAndDrop.js"
// window.globalMessage = "Hello from the global scope!"
window.g_DraggedElement = null
window.playfield = document.getElementById("playfield")
const characterActor = document.querySelector("#character")

/**
 * @param {number} points
 */
let points = localStorage.getItem("points")
	? parseInt(localStorage.getItem("points"))
	: 0
const pointsDisplay = document.getElementById("pointsDisplay")
/**
 * @param {float} hungerPoints
 */
export let hungerPoints = localStorage.getItem("hungerPoints")
	? parseFloat(localStorage.getItem("hungerPoints"))
	: 1.0
const hungerMeter = document.getElementById("hungerMeter")
/**
 * @param {float} sleepPoints
 */
export let sleepPoints = localStorage.getItem("sleepPoints")
	? parseFloat(localStorage.getItem("sleepPoints"))
	: 1.0
const sleepMeter = document.getElementById("sleepMeter")
/**
 * @param {float} energyPoints
 */
export let energyPoints = localStorage.getItem("energyPoints")
	? parseFloat(localStorage.getItem("energyPoints"))
	: 1.0
const energyMeter = document.getElementById("energyMeter")
/**
 * @param {float} energyPoints
 */
export let happynessPoints = localStorage.getItem("happynessPoints")
	? parseFloat(localStorage.getItem("happynessPoints"))
	: 1.0
const happynessMeter = document.getElementById("happynessMeter")

//? may use a global pointer handler if game gets more complicated
// document.addEventListener("pointerup", (event) => {
// 	const { clientX, clientY } = event

// 	// Get all elements at the point of the pointerup event
// 	const elements = document.elementsFromPoint(clientX, clientY)
// 	console.log({ elements })

// 	// // The current element is the first one, the one behind it is next
// 	// if (elements.length > 1) {
// 	// 	const behindElement = elements[1]
// 	// 	console.log("Element behind the current one:", behindElement)
// 	// }
// })

// function moveCharacter() {
// 	// const playfield = document.getElementById("playfield")
// 	const character = document.getElementById("character")

// 	const maxX = window.playfield.clientWidth - character.offsetWidth
// 	const maxY = window.playfield.clientHeight - character.offsetHeight

// 	const randomX = Math.random() * maxX
// 	const randomY = Math.random() * maxY

// 	character.style.transform = `translate(${randomX}px, ${randomY}px)`
// }
// moveCharacter()
// setInterval(moveCharacter, 85000)

// const directions = ["face_down", "face_up", "face_left", "face_right"]
// const directions = [
// 	"face_still",
// 	"face_down",
// 	"face_up",
// 	"face_left",
// 	"face_right",
// 	"anger",
// 	"no",
// 	"crouch",
// 	"sway",
// 	"eat",
// 	"crawl",
// 	"eat_favorite",
// 	"excite",
// 	"sleep",
// 	"nasty",
// 	"point",
// 	"yawn",
// 	"cry",
// 	"sit_down",
// 	"sit_left",
// ]
// let currentDirectionIndex = 0

// function changeDirection() {
// 	const characterSprite = document.querySelector("#character")
// 	currentDirectionIndex = (currentDirectionIndex + 1) % directions.length
// 	characterSprite.setAttribute("direction", directions[currentDirectionIndex])
// }
// changeDirection()
// setInterval(changeDirection, 3000)

//todo the routine decides the interval length
// Put the functions in an array (the pool)
//todo at the end of a routine pick another routine

// setInterval(() => {

// 	triggerRandomRoutine()
// }, 3000)

// setTimeout(() => {
// 	characterActor.setSleep()
// }, 5000)

const ring_icon = document.querySelector(".ring-icon")

function animPoints() {
	ring_icon.classList.remove("ring-anim")
	void ring_icon.offsetWidth // Trigger reflow to restart animation
	ring_icon.classList.add("ring-anim")
}

// Call this function whenever you want to restart the animation
// animPoints()

// function testRandMeterValue() {
// 	// const hungerMeter = document.getElementById("hungerMeter")
// 	// hungerMeter.querySelector(".meter").setAttribute("value", Math.random())
// 	// const sleepMeter = document.getElementById("sleepMeter")
// 	// sleepMeter.querySelector(".meter").setAttribute("value", Math.random())
// 	// const energyMeter = document.getElementById("energyMeter")
// 	// energyMeter.querySelector(".meter").setAttribute("value", Math.random())
// }
// setInterval(testRandMeterValue, 2000)

export function setEnergy(inputPoints) {
	energyPoints += inputPoints
	energyPoints = clamp(energyPoints, 0, 1)
	if (!energyPoints) energyPoints = 0.0

	energyMeter.querySelector(".meter").setAttribute("value", energyPoints)
	localStorage.setItem("energyPoints", energyPoints)
}

export function setSleep(inputPoints) {
	sleepPoints += inputPoints
	sleepPoints = clamp(sleepPoints, 0, 1)
	if (!sleepPoints) sleepPoints = 0.0

	sleepMeter.querySelector(".meter").setAttribute("value", sleepPoints)
	localStorage.setItem("sleepPoints", sleepPoints)
}

export function setHappyness(inputPoints) {
	happynessPoints += inputPoints
	happynessPoints = clamp(happynessPoints, 0, 1)
	if (!happynessPoints) happynessPoints = 0.0

	happynessMeter.querySelector(".meter").setAttribute("value", happynessPoints)
	localStorage.setItem("happynessPoints", happynessPoints)
}
// setInterval(() => {
// 	//todo stop this if currently sleeping
// 	//todo not able to feed if sleeping
// 	//move to bigger state machine that only allows one state at a time?
// 	// when other states are triggered, that is when sleep is removed?
// 	setSleep(-0.03)
// }, 2000)

export function setHunger(inputPoints) {
	hungerPoints += inputPoints
	hungerPoints = clamp(hungerPoints, 0, 1)
	if (!hungerPoints) hungerPoints = 0

	hungerMeter.querySelector(".meter").setAttribute("value", hungerPoints)
	localStorage.setItem("hungerPoints", hungerPoints)
}
// setInterval(setHunger.bind(null, -0.02), 1000)

function addToPoints() {
	let points = localStorage.getItem("points")
		? parseInt(localStorage.getItem("points"))
		: 0
	points += 1
	pointsDisplay.textContent = points
	localStorage.setItem("points", points)

	animPoints()
}
export function buyItemWithPoints(inputPoints) {
	let points = localStorage.getItem("points")
		? parseInt(localStorage.getItem("points"))
		: 0

	if (inputPoints > points) {
		console.log("!!! not enough points to buy item")
		return false
	}

	points -= inputPoints
	pointsDisplay.textContent = points
	localStorage.setItem("points", points)

	animPoints()

	return true
}

function initGame() {
	pointsDisplay.textContent = points
	hungerMeter.querySelector(".meter").setAttribute("value", hungerPoints)
	happynessMeter.querySelector(".meter").setAttribute("value", happynessPoints)
	sleepMeter.querySelector(".meter").setAttribute("value", sleepPoints)
	energyMeter.querySelector(".meter").setAttribute("value", energyPoints)
}

document.addEventListener("DOMContentLoaded", () => {
	initGame()

	const btnAddToPoints = document.getElementById("addToPoints")
	if (btnAddToPoints) btnAddToPoints.addEventListener("click", addToPoints)

	const btnSetHunger = document.getElementById("setHunger")
	if (btnSetHunger)
		btnSetHunger.addEventListener("click", setHunger.bind(null, 0.01))

	//todo didn't work
	// const { dragAndDrop } = await import("./lib/dragAndDrop")
	// dragAndDrop()

	triggerRandomRoutine([
		// () => characterActor.transformRoutine(),
		// () => characterActor.exciteRoutine(),
		// () => characterActor.sleepRoutine(),
		() => characterActor.sitRoutine(),
	])
})

export const triggerRandomRoutine = (routineArray) => {
	//todo make weighted routines (some happen more than others)
	const randomIndex = Math.floor(Math.random() * routineArray.length)
	const selectedFunction = routineArray[randomIndex]

	selectedFunction()
}

function clamp(value, min, max) {
	return Math.max(min, Math.min(value, max))
}

document.addEventListener("dragover", (event) => {
	event.preventDefault() // prevents items from springing back when dragged
})

// cred - https://x.st/javascript-coroutines/
function coroutine(f) {
	var o = f() // instantiate the coroutine
	o.next() // execute until the first yield
	return function (x) {
		o.next(x)
	}
}
