/**
 * Triggers an array of functions inside an object
 * @param {{ duration: number, steps: number, onFinish: () => void, signal?: { aborted?: boolean }, funcs: Array<() => void> }} param - Object containing an array of functions
 */
export const durationInSteps = async ({
	duration,
	steps,
	onFinish,
	signal,
	funcs,
}) => {
	const timeDelay = duration / steps

	for (let i = 0; i < steps; i++) {
		if (signal.aborted) return

		await new Promise((resolve) => setTimeout(resolve, timeDelay))

		funcs.forEach((func) => {
			func ? func() : console.log("!!! no function found")
		})
	}

	if (signal.aborted) return
	onFinish()
}
