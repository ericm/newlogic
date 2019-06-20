// Gates imports
import { AndGate, GateNode, LED, NotGate, OrGate, Switch, Wire, XOrGate } from '../gates';
import { GateCoords, GateSize, AnyGate, SelectedNode } from "./canvas";
import Home from '../components/Home';
import { notDeepEqual } from 'assert';

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
	child2: Child,
	popup?: JSX.Element,
	status?: JSX.Element[],
	statusOffset: number[]
}
export interface HomeProps {
	testing?: boolean
}
export interface StateHistory {
	method: 'create' | 'move' | 'join' | 'delete' | 'unjoin',
	gate: GateStatePlecibo,
	secondGate?: GateStatePlecibo
	inGate?: GateHistory,
	outGate?: GateHistory
}
export interface GateHistory {
	id: number, 
	index: number,
	nodeIndex: number
}
export interface PropertiesState {

}
export interface PropertiesProps {
	gate: AnyGate,
	home: Home
}
// Gates
export interface AllGates {
	and: AndGate[],
	or: OrGate[],
	wire: Wire[],
	not: NotGate[],
	switch: Switch[],
	led: LED[],
	xor: XOrGate[]
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
	loading: boolean,
	clicked: {
		"click": string,
		"draw": string,
		"cut": string
		"and": string,
		"or": string,
		"xor": string,
		"not": string,
		"switch": string,
		"led": string
	}
}
export interface MenuProps extends Component {

}

export interface IContext {
	coords: GateCoords,
	size: GateSize,
	gate: AnyGate,
	options: string[]
}

// Workspace
export interface WorkspaceState {
	width: string,
	height: string,
	mode: string,
	dragInit: GateCoords,
	drag: GateCoords,
	gateDragInit: GateCoords,
	dragging: boolean,
	canvasDrag: boolean,
	gridFactor: number,
	snapFactor: number,
	snapGrid: boolean,
	context: IContext | null,
	path?: string,
	gridType: number,
	unsavedChanges: boolean,
	undoIndex: number,
	undoing: boolean
}
export interface WorkspaceProps extends Component {
	name?: string,
	testing?: boolean,
	addStatus?: (message: string, reload: boolean) => void
}

export interface NavBarState {
	clicked: HTMLLIElement | null
}
export interface NavBarProps {
	
}
export interface SettingsState {
	theme: number,
	gridFactor: number,
	snapGrid: boolean,
	snapFactor: number,
	gridType: number
}
export interface SettingsProps {
	home: Home
}

export interface StatusState {
	offset: number,
	class: string
}
export interface StatusProps {
	message: string,
	reload: boolean,
	unmount: () => void,
	offset: number
}
export interface GateStatePlecibo {
	coords: GateCoords,
	size: GateSize,
	id: number,
	inputs: number[],
	outputs: number[],
	type: string,
	invert?: boolean
}
export interface WorkspaceSaveState {
	gates: { and: GateStatePlecibo[], 
		or: GateStatePlecibo[], 
		not: GateStatePlecibo[], 
		switch: GateStatePlecibo[], 
		led: GateStatePlecibo[],
		xor: GateStatePlecibo[] },
	gridFactor: number,
	snapFactor: number
}