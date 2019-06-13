import * as canvas from "../actions/canvas";
import { WireProps, WireState, AnyGate } from "../interfaces/canvas";

export default class Wire {
    public state: WireState
    constructor(props: WireProps) {
        this.state = {
            ...props,
            break: {x: 0, y: 0}
        };
    }

    public gateIn = (): AnyGate => {
        return this.state.startNode.state.gate;
    }

    public gateOut = (): AnyGate => {
        return this.state.endNode.state.gate;
    }

    public render = (ctx: CanvasRenderingContext2D): void => {
        this.state.break = canvas.Wiring.drawWire(ctx, this.state.startNode.getCoords(), this.state.endNode.getCoords());
    }
}