/**
 * @typedef {import('./types/Envs').Envs} Envs
 */

import process from "./process.env.js"

const isLocalDev =
	window.location.hostname.startsWith("127.0.0.1") ||
	window.location.hostname.startsWith("localhost")

const HOSTNAME = isLocalDev
	? window.location.hostname + ":" + process.env.DEV_PORT
	: window.location.hostname

const PROTOCOL = isLocalDev ? "http://" : "https://"

const PATH = isLocalDev ? "" : process.env.PATH

/**
 * @type {Envs} envs
 */
export const envs = {
	HOSTNAME,
	PROTOCOL,
	PATH,
	ENDPOINT: isLocalDev ? `http://${HOSTNAME}` : `https://${HOSTNAME}${PATH}`,
}
