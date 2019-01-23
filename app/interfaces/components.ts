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
	resize: string
}

// Workspace
export interface WorkspaceState {
	
}
export interface WorkspaceProps {
	width: number,
	height: number
}