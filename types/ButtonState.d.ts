export type Icon = "hi-star" | "hi-cog" | "hi-check" | "hi-warning"
export type State = "idle" | "loading" | "success" | "error"
export type ButtonState = {
	state: State
	errorMsg?: string
	action: () => void
} & HTMLElement
