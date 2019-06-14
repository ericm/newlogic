import { AndGate, GateNode, Gates, LED, NotGate, OrGate, Switch, Wire, XOrGate } from '../gates';

// set any type of gate
export type AnyGate = AndGate | OrGate | NotGate | Switch | LED | XOrGate;

export type Assoc = Array<Array<boolean>>

export interface State<T extends Gates<any>>  {
	coords: GateCoords,
	size: GateSize,
	id: number,
	nodes: Nodes<T>,
	gateIn: Array<AnyGate>,
	gateOut: Array<AnyGate>,
	invert?: boolean,
	type: string
}
export interface Nodes<T extends Gates<any>>  {
	start: GateNode<T>[],
	end: GateNode<T>[]
}
export interface WireProps {
	startNode: GateNode<AnyGate>,
	endNode: GateNode<AnyGate>
}
export interface WireState extends WireProps {
	break: GateCoords
}
// Node
export interface NodeState<T> {
	gate: T,
	wire: Wire[],
	coords: GateCoords,
	type: string,
	value: boolean
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
