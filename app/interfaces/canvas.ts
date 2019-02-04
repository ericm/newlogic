interface State {
	coords: GateCoords,
	size: GateSize
}
// AND GATE
export interface AndState extends State {
	
}

export interface GateCoords {
	x: number,
	y: number
}
export interface GateSize {
	width: number,
	height: number
}