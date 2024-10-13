/**
 * @typedef {import('./types/Envs').Envs} Envs
 */

import process from "./process.env.js"

const isLocalDev =
	process.env.DEV_HOST.startsWith("127.0.0.1") ||
	process.env.DEV_HOST.startsWith("localhost")

const HOSTNAME =
	window.location.hostname === process.env.DEV_HOST
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
	ENDPOINT:
		HOSTNAME === `${process.env.DEV_HOST}:${process.env.DEV_PORT}`
			? `http://${HOSTNAME}`
			: `https://${HOSTNAME}${PATH}`,
}
