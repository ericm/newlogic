import { State } from "../../interfaces/canvas";

export default class Gates {
    public ctx: CanvasRenderingContext2D
    public svg: HTMLImageElement
    public state: State

    public render = (): void => {
        this.ctx.drawImage(this.svg, this.state.coords.x, this.state.coords.y, 
            this.state.size.width, this.state.size.height);
    }
}