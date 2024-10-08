/**
 * @typedef {import('./types/Envs').Envs} Envs
 */
const HOSTNAME =
	window.location.hostname === "127.0.0.1"
		? window.location.hostname + ":5500"
		: window.location.hostname

const PROTOCOL = HOSTNAME === "127.0.0.1:5500" ? "http://" : "https://"

const PATH = "/tawtaw/vanilla-web-components-game"

/**
 * @type {Envs} envs
 */
export const envs = {
	HOSTNAME,
	PROTOCOL,
	PATH,
	ENDPOINT:
		HOSTNAME === "127.0.0.1:5500"
			? `http://${HOSTNAME}`
			: `https://${HOSTNAME}${PATH}`,
}
