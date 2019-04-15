import * as canvas from "../actions/canvas";
import { WireProps } from "../interfaces/canvas";

export default class Wire {
    public state: WireProps
    constructor(props: WireProps) {
        this.state = props;
    }
    public render = (ctx: CanvasRenderingContext2D): void =>
        canvas.Wiring.drawWire(ctx, this.state.startNode.getCoords(), this.state.endNode.getCoords());

}