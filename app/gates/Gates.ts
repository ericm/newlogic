import { State, AllGates } from "../interfaces/canvas";
import AndGate from "./AND";

export default class Gates {
    public ctx: CanvasRenderingContext2D
    public svg: HTMLImageElement
    public state: State

    public render = (): void => {
        this.ctx.drawImage(this.svg, this.state.coords.x, this.state.coords.y, 
            this.state.size.width, this.state.size.height);
    }
}
export const GateClass: AllGates = {
    and: AndGate
}