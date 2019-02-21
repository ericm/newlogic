import AndGate from "../gates/AND";
import GateNode from "../gates/Node";
import OrGate from "../gates/OR";
import Wire from "../gates/Wire";
import NotGate from "../gates/NOT";
import Switch from "../gates/Switch";
import LED from "../gates/LED";
import Gates from "../gates/Gates";

// set any type of gate
export type AnyGate = AndGate | OrGate | NotGate | Switch | LED;

export type Assoc = Array<Array<boolean>>

export interface State<T extends Gates<any>>  {
	coords: GateCoords,
	size: GateSize,
	nodes: Nodes<T>,
	gateIn: AnyGate | null,
	gateOut: AnyGate | null
}
export interface Nodes<T extends Gates<any>>  {
	start: GateNode<T>[],
	end: GateNode<T>[]
}
export interface WireProps {
	startNode: GateNode<any>,
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
	coords: GateCoords,
	type: string
}
export interface SelectedNode<T extends Gates<any>> {
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

export interface OutState<T extends Gates<any>>  extends State<T> {
	clicked: boolean,
	connected: boolean
}
export interface InState<T extends Gates<any>>  extends State<T> {
	input: boolean,
	connected: boolean
}