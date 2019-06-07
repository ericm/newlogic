import * as canvas from "../actions/canvas";
import { WireProps, WireState } from "../interfaces/canvas";
import { Gates } from "./all";

export default class Wire {
    public state: WireState
    constructor(props: WireProps) {
        this.state = {
            ...props,
            break: {x: 0, y: 0}
        };
    }

    public gateIn = (): Gates<any> => {
        return this.state.startNode.state.gate;
    }

    public gateOut = (): Gates<any> => {
        return this.state.endNode.state.gate;
    }

    public render = (ctx: CanvasRenderingContext2D): void => {
        this.state.break = canvas.Wiring.drawWire(ctx, this.state.startNode.getCoords(), this.state.endNode.getCoords());
    }
}