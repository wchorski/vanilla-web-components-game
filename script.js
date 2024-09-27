// import "./lib/dragAndDrop.js"
// window.globalMessage = "Hello from the global scope!"
/**
 * @typedef {import('./types/Character.js').Character} Character
 */
import { clamp } from "./lib/clamp.js"
window.g_DraggedElement = null
window.playfield = document.getElementById("playfield")
const dashboard = document.querySelector("#dashboard")
const characterActors = document.querySelectorAll(".character")
const saveBtn = document.querySelector("#savedata")

function SaveData() {
	/**@param {Character[]} characterActors */
	const charObjs = Array.from(characterActors).map((char) => ({
		id: char.id,
		hunger: char.hunger,
		sleep: char.sleep,
		energy: char.energy,
		happyness: char.happyness,
	}))

	Array.from(charObjs).map((char) => {
		localStorage.setItem(char.id, JSON.stringify(char))
	})
}

setInterval(SaveData, 5000)

/**@param {number} points */
let points = localStorage.getItem("points")
	? parseInt(localStorage.getItem("points"))
	: 0
const pointsDisplay = document.getElementById("pointsDisplay")
/**@param {float} hungerPoints */
export let hungerPoints = localStorage.getItem("hungerPoints")
	? parseFloat(localStorage.getItem("hungerPoints"))
	: 1.0
// const hungerMeter = document.getElementById("hungerMeter")
// /**@param {float} sleepPoints */
// export let sleepPoints = localStorage.getItem("sleepPoints")
// 	? parseFloat(localStorage.getItem("sleepPoints"))
// 	: 1.0
// const sleepMeter = document.getElementById("sleepMeter")
// /**@param {float} energyPoints */
// export let energyPoints = localStorage.getItem("energyPoints")
// 	? parseFloat(localStorage.getItem("energyPoints"))
// 	: 1.0
// const energyMeter = document.getElementById("energyMeter")
// /**
//  * @param {float} energyPoints
//  */
// export let happynessPoints = localStorage.getItem("happynessPoints")
// 	? parseFloat(localStorage.getItem("happynessPoints"))
// 	: 1.0
// const happynessMeter = document.getElementById("happynessMeter")

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

// export function setEnergy(inputPoints) {
// 	energyPoints += inputPoints
// 	energyPoints = clamp(energyPoints, 0, 1)
// 	if (!energyPoints) energyPoints = 0.0

// 	energyMeter.querySelector(".meter").setAttribute("value", energyPoints)
// 	localStorage.setItem("energyPoints", energyPoints)
// }

// export function setSleep(inputPoints) {
// 	sleepPoints += inputPoints
// 	sleepPoints = clamp(sleepPoints, 0, 1)
// 	if (!sleepPoints) sleepPoints = 0.0

// 	sleepMeter.querySelector(".meter").setAttribute("value", sleepPoints)
// 	localStorage.setItem("sleepPoints", sleepPoints)
// }

// export function setHappyness(inputPoints) {
// 	happynessPoints += inputPoints
// 	happynessPoints = clamp(happynessPoints, 0, 1)
// 	if (!happynessPoints) happynessPoints = 0.0

// 	happynessMeter.querySelector(".meter").setAttribute("value", happynessPoints)
// 	localStorage.setItem("happynessPoints", happynessPoints)
// }

// export function setHunger(inputPoints) {
// 	hungerPoints += inputPoints
// 	hungerPoints = clamp(hungerPoints, 0, 1)
// 	if (!hungerPoints) hungerPoints = 0

// 	hungerMeter.querySelector(".meter").setAttribute("value", hungerPoints)
// 	localStorage.setItem("hungerPoints", hungerPoints)
// }

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
	// hungerMeter.querySelector(".meter").setAttribute("value", hungerPoints)
	// happynessMeter.querySelector(".meter").setAttribute("value", happynessPoints)
	// sleepMeter.querySelector(".meter").setAttribute("value", sleepPoints)
	// energyMeter.querySelector(".meter").setAttribute("value", energyPoints)
	saveBtn.addEventListener("click", () => SaveData())
}

document.addEventListener("DOMContentLoaded", () => {
	initGame()

	const btnAddToPoints = document.getElementById("addToPoints")
	if (btnAddToPoints) btnAddToPoints.addEventListener("click", addToPoints)
})

export const triggerRandomRoutine = (routineArray) => {
	//todo make weighted routines (some happen more than others)
	const randomIndex = Math.floor(Math.random() * routineArray.length)
	const selectedFunction = routineArray[randomIndex]

	selectedFunction()
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

function initCharacterUI() {
	const getValuesStartingWithChar = () => {
		return Array.from({ length: localStorage.length }, (_, i) =>
			localStorage.key(i)
		)
			.filter((key) => key.startsWith("char-"))
			.map((key) => {
				const value = localStorage.getItem(key)
				try {
					return JSON.parse(value)
				} catch {
					return null // Handle non-JSON or invalid JSON data
				}
			})
	}

	const charValues = getValuesStartingWithChar()

	Array.from(characterActors).map((char) => {
		const charDash = document.createElement("div")
		charDash.id = char.id + "-health-ui"
		charDash.classList.add("charDash")

		const meterTitle = document.createElement("h2")
		meterTitle.innerText = char.id
		charDash.appendChild(meterTitle)

		const hungerMeter = document.createElement("health-meter")
		hungerMeter.setAttribute("class", "hungerMeter")
		hungerMeter.setAttribute(
			"value",
			charValues.find((ch) => ch.id === char.id).hunger || "0.5"
		)
		hungerMeter.setAttribute("min", "0.0")
		hungerMeter.setAttribute("max", "1.0")
		hungerMeter.setAttribute("label", "hunger")
		hungerMeter.setAttribute("hue", "17")
		charDash.appendChild(hungerMeter)

		const sleepMeter = document.createElement("health-meter")
		sleepMeter.setAttribute("class", "sleepMeter")
		sleepMeter.setAttribute(
			"value",
			charValues.find((ch) => ch.id === char.id).sleep || "0.5"
		)
		sleepMeter.setAttribute("min", "0.0")
		sleepMeter.setAttribute("max", "1.0")
		sleepMeter.setAttribute("label", "sleep")
		sleepMeter.setAttribute("hue", "172")
		charDash.appendChild(sleepMeter)

		const energyMeter = document.createElement("health-meter")
		energyMeter.setAttribute("class", "energyMeter")
		energyMeter.setAttribute(
			"value",
			charValues.find((ch) => ch.id === char.id).energy || "0.5"
		)
		energyMeter.setAttribute("min", "0.0")
		energyMeter.setAttribute("max", "1.0")
		energyMeter.setAttribute("label", "energy")
		energyMeter.setAttribute("hue", "272")
		charDash.appendChild(energyMeter)

		const happynessMeter = document.createElement("health-meter")
		happynessMeter.setAttribute("class", "happynessMeter")
		happynessMeter.setAttribute(
			"value",
			charValues.find((ch) => ch.id === char.id).happyness || "0.5"
		)
		happynessMeter.setAttribute("min", "0.0")
		happynessMeter.setAttribute("max", "1.0")
		happynessMeter.setAttribute("label", "happyness")
		happynessMeter.setAttribute("hue", "72")
		charDash.appendChild(happynessMeter)

		dashboard.appendChild(charDash)
	})
}
initCharacterUI()
