/**
 * @typedef {import('./types/Character.js').Character} Character
 * @typedef {import('./types/ButtonState.js').ButtonState} ButtonState
 * @typedef {import('./types/PlayItem.js').PlayItem} PlayItem
 */

import { CharacterActor } from "./components/character-actor.js"
import { HealthMeter } from "./components/health-meter.js"
import { PlayfieldWeed } from "./components/playfield-weed.js"

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

async function saveCharactersData() {
	try {
		const characterActors = document.querySelectorAll(".character")
		if (!characterActors || characterActors.length <= 0)
			return console.log("!!! no characters on playfield")

		/**@param {Character[]} characterActors */
		const charObjs = Array.from(characterActors).map((char) => ({
			id: char.id,
			state: char.state,
			birth: char.birth,
			hunger: char.hunger || 0,
			sleep: char.sleep || 0,
			energy: char.energy || 0,
			happyness: char.happyness || 0,
		}))

		Array.from(charObjs).map((char) => {
			localStorage.setItem(char.id, JSON.stringify(char))
		})

		return true
	} catch (error) {
		console.log("!!! saveCharactersData: ", error)
		return false
	}
}

async function savePlayItemsData() {
	try {
		const playItems = document.querySelectorAll(".playfield-item")
		if (!playItems || playItems.length <= 0)
			return console.log("!!! no playItems on playfield")

		/**@const {PlayItem[]} playItemsObjs */
		const playItemsObjs = Array.from(playItems).map((item) => ({
			x: item.x,
			y: item.y,
			nodeName: item.nodeName,
			type: item.type,
			hungerValue: item.hungerValue,
		}))
		// console.log("playItemsObjs: ", playItemsObjs)

		localStorage.setItem("playItems", JSON.stringify(playItemsObjs))

		return true
	} catch (error) {
		console.log("!!! savePlayItemsData: ", error)
		return false
	}
}

async function saveData() {
	try {
		saveBtn.state = "loading"

		const isCharSaveSuccessful = saveCharactersData()
		const isPlayItemsSaveSuccessful = savePlayItemsData()

		//todo test error, useful when actually making a db save
		if (!isCharSaveSuccessful || !isPlayItemsSaveSuccessful)
			throw new Error("uh ohh oopsie")

		//? add fake loading time to give better ui feedback
		await new Promise((resolve) => setTimeout(resolve, 3000))
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

export function addToPoints() {
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

function initPlayItems() {
	const playItemString = localStorage.getItem("playItems")
	if (!playItemString) return console.log("no playItems yet...")
	/** @type {PlayItem} playItemObjs */
	const playItemObjs = JSON.parse(playItemString)

	playItemObjs.forEach((item) => {
		const itemEl = document.createElement(item.nodeName)
		// itemEl.id = item.id
		// itemEl.classList.add("character")
		// itemEl.setAttribute("src", "./sprites/chao-neutral-v6.png")
		itemEl.setAttribute("hungerValue", String(item.hungerValue))
		itemEl.setAttribute("type", String(item.type))
		itemEl.setAttribute("x", item.x)
		itemEl.setAttribute("y", item.y)

		// console.log(itemEl)
		window.playfield.appendChild(itemEl)
	})
}

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
	/** @type {Character[]} charValues_temp */
	const charValues_temp = getValuesStartingWithChar()

	// todo switch this out when adding egg birth
	const charValues =
		charValues_temp.length > 0 ? charValues_temp : defaultCharacters

	charValues.forEach((char) => {
		// const charEl = document.createElement("character-actor")
		const charEl = new CharacterActor()

		charEl.id = char.id
		charEl.classList.add("character")
		charEl.setAttribute("src", "./sprites/chao-neutral-v6.png")
		charEl.setAttribute("state", char.state)
		charEl.setAttribute("hunger", String(char.hunger))
		charEl.setAttribute("sleep", String(char.sleep))
		charEl.setAttribute("energy", String(char.energy))
		charEl.setAttribute("happyness", String(char.happyness))
		charEl.setAttribute("x", char.x)
		charEl.setAttribute("y", char.y)

		window.playfield.appendChild(charEl)
	})

	initCharacterUI(charValues)
}
initCharacterActors()
initPlayItems()

/**
 *
 * @param {Character[]} charValues
 * @returns
 */
export function initCharacterUI(charValues) {
	if (!charValues || charValues.length <= 0)
		return console.log("!!! no chars found")

	charValues.forEach((char) => {
		const charDash = document.createElement("div")
		charDash.id = char.id + "-health-ui"
		charDash.classList.add("charDash")
		if (!dashboard) console.log('add <div id="dashboard">')
		dashboard.appendChild(charDash)

		const meterTitle = document.createElement("h2")
		meterTitle.innerText = char.id
		charDash.appendChild(meterTitle)

		// const hungerMeter = document.createElement("health-meter")
		const hungerMeter = new HealthMeter()
		charDash.appendChild(hungerMeter)
		hungerMeter.setAttribute("class", "hungerMeter")
		hungerMeter.value = char.hunger
		hungerMeter.label = "hunger"
		hungerMeter.hue = "17"
		hungerMeter.setAttribute("min", "0.0")
		hungerMeter.setAttribute("max", "1.0")

		const sleepMeter = new HealthMeter()
		charDash.appendChild(sleepMeter)
		sleepMeter.setAttribute("class", "sleepMeter")
		sleepMeter.value = char.sleep
		sleepMeter.label = "sleep"
		sleepMeter.hue = "172"
		sleepMeter.setAttribute("min", "0.0")
		sleepMeter.setAttribute("max", "1.0")

		const energyMeter = new HealthMeter()
		charDash.appendChild(energyMeter)
		energyMeter.setAttribute("class", "energyMeter")
		energyMeter.value = char.energy
		energyMeter.label = "energy"
		energyMeter.hue = "272"
		energyMeter.setAttribute("min", "0.0")
		energyMeter.setAttribute("max", "1.0")

		const happynessMeter = new HealthMeter()
		charDash.appendChild(happynessMeter)
		happynessMeter.setAttribute("class", "happynessMeter")
		happynessMeter.value = char.happyness
		happynessMeter.label = "happyness"
		happynessMeter.hue = "72"
		happynessMeter.setAttribute("min", "0.0")
		happynessMeter.setAttribute("max", "1.0")
	})
}

function spawnWeed() {
	const newWeed = new PlayfieldWeed()
	window.playfield.appendChild(newWeed)
}

setInterval(() => {
	spawnWeed()
	//todo randomize this number between certain range
}, 40000)
