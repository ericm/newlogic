import Wire from "../gates/Wire";
import GateNode from "../gates/Node";
import AndGate from "../gates/AND";

export interface State<T> {
	coords: GateCoords,
	size: GateSize
	nodes: Nodes<T>
	
}
export interface Nodes<T> {
	start: GateNode<T>[],
	end: GateNode<T>[]
}
export interface WireProps {
	start: GateCoords,
	end: GateCoords,
	// startNode: GateNode<any>,
	endNode: GateNode<any>
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
export interface SelectedNode<T> {
	node: GateNode<T> | null,
	selected: boolean
}

export interface GateCoords {
	x: number,
	y: number
}
export interface GateSize {
	width: number,
	height: number
}
export interface GateGeneric {
	state: any,
	render: Function
}