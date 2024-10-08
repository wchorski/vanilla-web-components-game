/**
 * clamp number between 0.0 and 1.0
 * @param {number} value
 * @param {number} [min=0] defaults to 0
 * @param {number} [max=1] defaults to 1
 * @returns {number}
 */
export function clamp(value, min, max) {
	return Math.max(min || 0, Math.min(value, max || 1))
}

/**
 *
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
export function randomValueBetweenRange(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min
}
