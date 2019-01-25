// Home
export interface Child extends WinBarResize {
	initWidth: number,
	initHeight: number,
	initX: number,
	initY: number
}
export interface HomeState {
	child1: Child,
	child2: Child
}
export interface HomeProps {

}

// WinBar
export interface WinBarState {
	title: string,
	focused: boolean,
	offsetX: number,
	offsetY: number,
	width: number,
	height: number,
	resize: string
}
export interface WinBarProps {
	title: string,
	type: string,
	identity: number,
	resize: string,
}
export interface WinBarResize {
	width: number,
	height: number,
	x: number,
	y: number
}

// Menu
export interface MenuState {

}
export interface MenuProps {

}

// Workspace
export interface WorkspaceState {
	
}
export interface WorkspaceProps {
	width: number,
	height: number
}