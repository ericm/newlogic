import { State } from "../interfaces/canvas";

export default class Gates<T> {
    public ctx: CanvasRenderingContext2D
    public svg: HTMLImageElement
    public state: State<T>

    public render = (): void => {
        this.ctx.drawImage(this.svg, this.state.coords.x, this.state.coords.y, 
            this.state.size.width, this.state.size.height);
    }

    public click = (): void => {
        this.ctx.rect(this.state.coords.x, this.state.coords.y, 
            this.state.coords.x + this.state.size.width, this.state.coords.y + this.state.size.height);
            this.ctx.stroke();
    }
}