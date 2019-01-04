// WinBar
export interface WinBarState {
	title: string,
	x: number,
	y: number,
	initX: number,
	initY: number,
	moving: boolean,
	posX: number,
	posY: number,
	width: number,
	height: number,
	max: boolean,
	winWidth: number,
	winHeight: number,
	focused: boolean,
	z: number,
	saved: boolean,
	closed: boolean
}
export interface WinBarProps {
	title: string,
	type: string,
	identity: number
}

// Workspace
export interface WorkspaceState {

}
export interface WorkspaceProps {
	width: number,
	height: number
}