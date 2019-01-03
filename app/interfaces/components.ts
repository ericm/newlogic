export interface WinBarState {
    title: string, 
    x: number, 
    y: number, 
    initX: number, 
    initY: number, 
    moving: boolean, 
    posX: number, 
    posY: number
}
export interface WinBarProps {
    title: string
}