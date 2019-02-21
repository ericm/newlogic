import { GateCoords, NodeState } from "../interfaces/canvas";
import Wire from "./Wire";
import Gates from "./Gates";

export default class GateNode<T extends Gates<any>> {
    private state: NodeState<T>

    public constructor(gate: T, coords: GateCoords, type: string) {
        this.state = { gate, wire: null, coords, type, value: false };
    }

    public setWire = (wire: Wire, type: string): void => {
        this.state.wire = wire;
        switch (type) {
            case "start":
                this.state.gate.connect("out", wire.state.endNode.state.gate);
                break;
            case "end":
                this.state.gate.connect("in", wire.state.startNode.state.gate);
                break;
        }
    }

    public getCoords = (): GateCoords => {
        return this.state.coords;
    }

    public render = (ctx: CanvasRenderingContext2D): void => {
        ctx.beginPath();
        ctx.lineWidth = 3;
        ctx.arc(this.state.coords.x, this.state.coords.y, 1.5, 0, 2 * Math.PI);
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

    public setVal = (val: boolean): void => {
        this.state.value = val;
    }

    public getVal = (): boolean => {
        return this.state.value;
    }
}