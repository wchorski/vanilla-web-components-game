/**
 * @typedef {import('./types/Character.js').Character} Character
 * @typedef {import('./types/ButtonState.js').ButtonState} ButtonState
 */
const defaultCharacters = [
	{
		id: "char-1",
		state: "egg",
		hunger: 1.0,
		sleep: 1.0,
		energy: 1.0,
		happyness: 1.0,
	},
	// {
	// 	id: "char-2",
	// 	state: "egg",
	// 	hunger: 1.0,
	// 	sleep: 1.0,
	// 	energy: 1.0,
	// 	happyness: 1.0,
	// },
]
window.g_DraggedElement = null
window.playfield = document.getElementById("playfield")
const dashboard = document.querySelector("#dashboard")

/** @type {ButtonState} */
const saveBtn = document.querySelector("#savedata")

async function saveData() {
	try {
		const characterActors = document.querySelectorAll(".character")
		if (!characterActors || characterActors.length <= 0)
			return console.log("!!! no characters on playfield")

		const isError = false
		saveBtn.state = "loading"
		await new Promise((resolve) => setTimeout(resolve, 3000))

		/**@param {Character[]} characterActors */
		const charObjs = Array.from(characterActors).map((char) => ({
			id: char.id,
			state: char.state,
			birth: char.birth,
			hunger: char.hunger,
			sleep: char.sleep,
			energy: char.energy,
			happyness: char.happyness,
		}))

		Array.from(charObjs).map((char) => {
			localStorage.setItem(char.id, JSON.stringify(char))
		})

		if (isError) throw new Error("uh ohh oopsie")

		saveBtn.state = "success"
		await new Promise((resolve) => setTimeout(resolve, 2000))
		saveBtn.state = "idle"
	} catch (error) {
		saveBtn.state = "error"
		saveBtn.errorMsg = "!!! save data error: " + error
		console.log("!!! save data error: " + error)
	}
}

setInterval(saveData, 10000)

/**@param {number} points */
let points = localStorage.getItem("points")
	? parseInt(localStorage.getItem("points"))
	: 0
const pointsDisplay = document.getElementById("pointsDisplay")
/**@param {float} hungerPoints */
export let hungerPoints = localStorage.getItem("hungerPoints")
	? parseFloat(localStorage.getItem("hungerPoints"))
	: 1.0

const ring_icon = document.querySelector(".ring-icon")

function animPoints() {
	ring_icon.classList.remove("ring-anim")
	void ring_icon.offsetWidth // Trigger reflow to restart animation
	ring_icon.classList.add("ring-anim")
}

function addToPoints() {
	let points = localStorage.getItem("points")
		? parseInt(localStorage.getItem("points"))
		: 0
	points += 1
	pointsDisplay.textContent = points
	localStorage.setItem("points", points)

	animPoints()
}

setInterval(() => {
	addToPoints()
}, 5000)

export function buyItemWithPoints(inputPoints) {
	let points = localStorage.getItem("points")
		? parseInt(localStorage.getItem("points"))
		: 0

	if (inputPoints > points) {
		console.log("!!! not enough points to buy item")
		return false
	}

	points -= inputPoints
	pointsDisplay.textContent = String(points)
	localStorage.setItem("points", points)

	animPoints()

	return true
}

function initGame() {
	// initCharacterActors()
	pointsDisplay.textContent = String(points)
	saveBtn.action = () => saveData()
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

//todo use for character routines?
// // cred - https://x.st/javascript-coroutines/
// function coroutine(f) {
// 	var o = f() // instantiate the coroutine
// 	o.next() // execute until the first yield
// 	return function (x) {
// 		o.next(x)
// 	}
// }

function initCharacterActors() {
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

	const charValues_temp = getValuesStartingWithChar()

	// todo switch this out when adding egg birth
	const charValues =
		charValues_temp.length > 0 ? charValues_temp : defaultCharacters

	charValues.forEach((char) => {
		const charEl = document.createElement("character-actor")

		charEl.id = char.id
		charEl.classList.add("character")
		charEl.setAttribute("src", "./sprites/chao-neutral-v6.png")
		charEl.setAttribute("state", char.state)
		charEl.setAttribute("hunger", char.hunger)
		charEl.setAttribute("sleep", char.sleep)
		charEl.setAttribute("energy", char.energy)
		charEl.setAttribute("happyness", char.happyness)
		charEl.setAttribute("x", char.x)
		charEl.setAttribute("y", char.y)
		window.playfield.appendChild(charEl)
	})

	initCharacterUI(charValues)
}
initCharacterActors()

export function initCharacterUI(charValues) {
	if (!charValues || charValues.length <= 0)
		return console.log("!!! no chars found")

	Array.from(charValues).map((char) => {
		const charDash = document.createElement("div")
		charDash.id = char.id + "-health-ui"
		charDash.classList.add("charDash")

		const meterTitle = document.createElement("h2")
		meterTitle.innerText = char.id
		charDash.appendChild(meterTitle)

		const hungerMeter = document.createElement("health-meter")
		hungerMeter.setAttribute("class", "hungerMeter")
		hungerMeter.setAttribute("value", char.hunger || "0.5")
		hungerMeter.setAttribute("min", "0.0")
		hungerMeter.setAttribute("max", "1.0")
		hungerMeter.setAttribute("label", "hunger")
		hungerMeter.setAttribute("hue", "17")
		charDash.appendChild(hungerMeter)

		const sleepMeter = document.createElement("health-meter")
		sleepMeter.setAttribute("class", "sleepMeter")
		sleepMeter.setAttribute("value", char.sleep || "0.5")
		sleepMeter.setAttribute("min", "0.0")
		sleepMeter.setAttribute("max", "1.0")
		sleepMeter.setAttribute("label", "sleep")
		sleepMeter.setAttribute("hue", "172")
		charDash.appendChild(sleepMeter)

		const energyMeter = document.createElement("health-meter")
		energyMeter.setAttribute("class", "energyMeter")
		energyMeter.setAttribute("value", char.energy || "0.5")
		energyMeter.setAttribute("min", "0.0")
		energyMeter.setAttribute("max", "1.0")
		energyMeter.setAttribute("label", "energy")
		energyMeter.setAttribute("hue", "272")
		charDash.appendChild(energyMeter)

		const happynessMeter = document.createElement("health-meter")
		happynessMeter.setAttribute("class", "happynessMeter")
		happynessMeter.setAttribute("value", char.happyness || "0.5")
		happynessMeter.setAttribute("min", "0.0")
		happynessMeter.setAttribute("max", "1.0")
		happynessMeter.setAttribute("label", "happyness")
		happynessMeter.setAttribute("hue", "72")
		charDash.appendChild(happynessMeter)

		dashboard.appendChild(charDash)
	})
}
