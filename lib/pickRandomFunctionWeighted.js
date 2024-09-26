function pickRandomFunctionWeighted(functions, weights) {
	const totalWeight = weights.reduce((acc, weight) => acc + weight, 0)

	const randomValue = Math.random() * totalWeight
	let cumulativeWeight = 0

	for (let i = 0; i < functions.length; i++) {
		cumulativeWeight += weights[i]

		if (randomValue < cumulativeWeight) {
			return functions[i]() // Trigger the selected function
		}
	}
}

// // Example functions
// const function1 = () => console.log('Function 1 triggered')
// const function2 = () => console.log('Function 2 triggered')
// const function3 = () => console.log('Function 3 triggered')

// // Array of functions and their corresponding weights
// const functions = [function1, function2, function3]
// const weights = [0.1, 0.3, 0.6]  // Function 1 has a 10% chance, Function 2 has a 30% chance, Function 3 has a 60% chance

// // Choose and trigger a function
// chooseAndTriggerFunction(functions, weights)
