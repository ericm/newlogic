import { NodeState, GateCoords } from "../interfaces/canvas";
import Wire from "./Wire";

export default class GateNode<T> {
    private state: NodeState<T>

    public constructor(gate: T, coords: GateCoords, type: string) {
        this.state = {gate, wire: null, coords, type};
    }

    public setWire = (wire: Wire): void => {
        this.state.wire = wire;
    }

    public getCoords = (): GateCoords => {
        return this.state.coords;
    }

    public render = (ctx: CanvasRenderingContext2D): void => {
        ctx.beginPath();
        ctx.lineWidth = 3;
        ctx.arc(this.state.coords.x, this.state.coords.y, 1.5, 0, 2*Math.PI);
        ctx.stroke();
    }

    public hasWire = (): boolean => {
        if (this.state.wire === null) return false;
        else return true;
    }

    public removeWire = (): void => {
        this.state.wire = null;
    }

    public type = (): string => {
        return this.state.type;
    }

    public setCoords = (coords: GateCoords): void => {
        this.state.coords = coords;
    }
}