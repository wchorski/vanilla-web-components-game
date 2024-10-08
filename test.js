function hi() {
	console.log("don't TEST ME! >:[")
}
// hi()

function clamp(value, min, max) {
	// console.log("value: ", value)
	// console.log("min: ", min)
	// console.log("max: ", max)

	// console.log("clamp output: ", Math.max(min, Math.min(value, max)))

	return Math.max(min, Math.min(value, max))
}

// x: value
// slope: angle of line
// b: y intercept. y position of line
// floor: min
// ceiling: max
function graphSlopeIntercept(x, slope, b, min, max) {
	// console.log(clamp(x * slope + b, min, max))
	return clamp(x * slope + b, min, max)
}

// graphSlopeIntercept(0.01, 2, -0.2, 0, 1)

function pickRandomFunctionByChance(functionsWithChances) {
	const totalWeight = functionsWithChances.reduce(
		(acc, item) => acc + item.chance,
		0
	)

	const randomValue = Math.random() * totalWeight
	let cumulativeWeight = 0

	for (let i = 0; i < functionsWithChances.length; i++) {
		cumulativeWeight += functionsWithChances[i].chance

		if (randomValue < cumulativeWeight) {
			return functionsWithChances[i].function() // Trigger the selected function
		}
	}
}

function invertPercentage(value) {
	return 1 - value
}

// sleep 0 === very tired
// hunger 0 === very hungery
// energy 0 === no energy

// console.log("[very tired, hungry, and no energy]")
// const sleep = 0.1
// const hunger = 0.1
// const energy = 0

// console.log("[good sleep, belly full, and lots of energy]")
// const sleep = 0.8
// const hunger = 0.9
// const energy = 0.9

// console.log("[very tired, belly full, but no energy]")
// const sleep = 0.2
// const hunger = 0.9
// const energy = 0

// console.log("[very tired, belly full, but no energy]")
// const sleep = 0.2
// const hunger = 1
// const energy = 0

// console.log("[very tired, belly half full, lots of energy]")
// const sleep = 0.2
// const hunger = 0.5
// const energy = 0.9

// console.log("[very tired, belly half full, fair amount of energy]")
// const sleep = 0.2
// const hunger = 0.5
// const energy = 0.6

console.log("[complacent sleep, hunger, energy]")
const sleep = 0.5
const hunger = 0.5
const energy = 0.3

console.log(`
  sleep=${sleep} 
  hunger=${hunger} 
  energy=${energy}
`)

console.log(
	`runRoutine() chance is:  `,
	graphSlopeIntercept(energy, 3, -1, 0, 1)
)
console.log(
	`sitRoutine() chance is:  `,
	graphSlopeIntercept(invertPercentage(energy), 1.2, 0, 0, 1)
)

console.log(
	`cryRoutine() chance is:  `,
	graphSlopeIntercept(invertPercentage(hunger), 4, -2, 0, 1)
)

// for (let index = 0; index < 15; index++) {
// 	pickRandomFunctionByChance([
// 		{
// 			function: () => sleepRoutine(),
// 			chance: invertPercentage(sleep) + invertPercentage(hunger),
// 		},
// 		{ function: () => eatRoutine(), chance: invertPercentage(hunger) },
// 		{ function: () => runRoutine(), chance: energy },
// 		{
// 			function: () => sitRoutine(),
// 			chance: invertPercentage(energy),
// 		},
// {
// 	function: () => cryRoutine(),
// 	chance: invertPercentage(hunger),
// },
// 	])
// }

function runRoutine() {
	console.log("🏃 run")
}
function sitRoutine() {
	console.log("🪑 sitting down")
}
function happyRoutine() {
	console.log("😀 + happy")
}
function sleepRoutine() {
	console.log("😴 sleep")
}
function eatRoutine() {
	console.log("🍽️ eat")
}
function cryRoutine() {
	console.log("😭 cry")
}
