// Gates imports
import { AndGate, GateNode, LED, NotGate, OrGate, Switch, Wire } from '../gates/all';
import { GateCoords, GateSize, AnyGate } from "./canvas";

// Home
export interface Child extends WinBarResize {
	initWidth: number,
	initHeight: number,
	initX: number,
	initY: number
}
export interface Component {
	width: number,
	height: number
}
export interface HomeState {
	child1: Child,
	child2: Child
}
export interface HomeProps {
	testing?: boolean
}
// Gates
export interface AllGates {
	and: AndGate[],
	or: OrGate[],
	wire: Wire[],
	not: NotGate[],
	switch: Switch[],
	led: LED[]
}
// WinBar
export interface WinBarState extends Component {
	title: string,
	focused: boolean,
	offsetX: number,
	offsetY: number,
	resize: string
}
export interface WinBarProps {
	title: string,
	type: string,
	identity: number,
	resize: string,
}
export interface WinBarResize extends Component {
	x: number,
	y: number
}

// Menu
export interface MenuState {
	mode: string,
	loading: boolean
}
export interface MenuProps extends Component {

}

export interface IContext {
	coords: GateCoords,
	size: GateSize,
	gate: AnyGate
}

// Workspace
export interface WorkspaceState {
	width: string,
	height: string,
	mode: string,
	dragInit: GateCoords,
	drag: GateCoords,
	dragging: boolean,
	canvasDrag: boolean,
	gridFactor: number,
	snapFactor: number,
	path?: string,
	context?: IContext // TODO: null
}
export interface WorkspaceProps extends Component {
	name?: string,
	testing?: boolean
}

export interface NavBarState {
	clicked: HTMLLIElement | null
}
export interface NavBarProps {
	
}
interface GateStatePlecibo {
	coords: GateCoords,
	size: GateSize,
	id: number,
	inputs: number[],
	outputs: number[],
	type: string
}
export interface WorkspaceSaveState {
	gates: { and: GateStatePlecibo[], 
		or: GateStatePlecibo[], 
		not: GateStatePlecibo[], 
		switch: GateStatePlecibo[], 
		led: GateStatePlecibo[] },
	gridFactor: number,
	snapFactor: number
}