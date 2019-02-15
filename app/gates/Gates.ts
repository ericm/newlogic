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
        this.ctx.setLineDash([6]);
        this.ctx.lineWidth = 1;
        this.ctx.rect(this.state.coords.x-6, this.state.coords.y-6, 
            this.state.size.width+12, this.state.size.height+12);
        this.ctx.stroke();

        this.ctx.lineWidth = 3;
        this.ctx.setLineDash([0]);
    }
}