import { clamp } from "./clamp.js"

// graph visual - https://www.desmos.com/calculator
/**
 * graphs line that starts from origin and does not exced value of 1
 *
 * @param {number} x input value
 * @param {number} slope the angle of the line
 * @param {number} b y intercept or line verticle position offset
 * @returns {number} The result of the selected function execution.
 */
export function graphSlopeIntercept(x, slope, b, min, max) {
	return clamp(x * slope + b, min, max)
}

export function invertPercentage(value) {
	return 1 - value
}
