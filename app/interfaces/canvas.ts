import Wire from "../gates/Wire";
import GateNode from "../gates/Node";
import AndGate from "../gates/AND";

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
	nodes: GateNode<AndGate>[]
}
// Node
export interface NodeState<T> {
	gate: T,
	wire: Wire | null,
	coords: GateCoords
}

export interface GateCoords {
	x: number,
	y: number
}
export interface GateSize {
	width: number,
	height: number
}