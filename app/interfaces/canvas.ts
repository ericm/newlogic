import Wire from "../gates/Wire";

export interface State {
	coords: GateCoords,
	size: GateSize
}
export interface WireProps {
	start: GateCoords,
	end: GateCoords
}
// AND GATE
export interface AndState {
	
}
// Node
export interface NodeState {
	gate: Object,
	wire: Wire
}

export interface GateCoords {
	x: number,
	y: number
}
export interface GateSize {
	width: number,
	height: number
}