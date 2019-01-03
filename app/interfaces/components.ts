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
    focused: boolean
}
export interface WinBarProps {
    title: string
}