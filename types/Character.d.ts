export type State =
	| "face_still"
	| "face_down"
	| "face_right"
	| "face_left"
	| "face_up"
	| "angry"
	| "no"
	| "crouch"
	| "crawl"
	| "cry"
	| "sway"
	| "eat"
	| "eat_favorite"
	| "excite"
	| "sleep"
	| "excite_2"
	| "nasty"
	| "point"
	| "yawn"
	| "sit_down"
	| "think"
	| "sit_left"
	| "egg"

export type AnimState =
	| "face_still"
	| "face_down"
	| "face_right"
	| "face_left"
	| "face_up"
	| "angry"
	| "no"
	| "crouch"
	| "crawl"
	| "cry"
	| "sway"
	| "eat"
	| "eat_favorite"
	| "excite"
	| "sleep"
	| "excite_2"
	| "nasty"
	| "point"
	| "yawn"
	| "sit_down"
	| "think"
	| "sit_left"
	| "egg"

export type Character = {
	id: string
	name: string
	birth?: string
	age: string
	hunger: number
	sleep: number
	energy: number
	happyness: number
	state: State
	owner: string
	original_owner: string
} & HTMLElement
