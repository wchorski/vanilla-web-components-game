/**
 * @typedef {Object} FunctionWithChance
 * @property {Function} function The function to be executed
 * @property {number} chance The probability weight of the function
 */

/**
 * Selects and executes a function from an array of functions with their associated chances.
 *
 * @param {FunctionWithChance[]} functionsWithChances - An array of objects, each containing a function and its corresponding chance.
 * @returns {*} The result of the selected function execution.
 */
export function runRandomFunctionByChance(functionsWithChances) {
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

// // Example functions
// function sleep() {
//   console.log("Sleeping... Zzz")
// }

// function eat() {
//   console.log("Eating... Yum!")
// }

// function walk() {
//   console.log("Walking... Step by step!")
// }

// // Example usage with function and chance
// const functionsWithChances = [
//   { function: sleep, chance: 0.5 },
//   { function: eat, chance: 1 },
//   { function: walk, chance: 2 }
// ]

// runRandomFunctionByChance(functionsWithChances)

// ---------------------------------------------

// function runRandomFunctionByChance(functions, weights) {
// 	const totalWeight = weights.reduce((acc, weight) => acc + weight, 0)

// 	const randomValue = Math.random() * totalWeight
// 	let cumulativeWeight = 0

// 	for (let i = 0; i < functions.length; i++) {
// 		cumulativeWeight += weights[i]

// 		if (randomValue < cumulativeWeight) {
// 			return functions[i]() // Trigger the selected function
// 		}
// 	}
// }

// // Example functions
// const function1 = () => console.log('Function 1 triggered')
// const function2 = () => console.log('Function 2 triggered')
// const function3 = () => console.log('Function 3 triggered')

// // Array of functions and their corresponding weights
// const functions = [function1, function2, function3]
// const weights = [0.1, 0.3, 0.6]  // Function 1 has a 10% chance, Function 2 has a 30% chance, Function 3 has a 60% chance

// // Choose and trigger a function
// chooseAndTriggerFunction(functions, weights)
