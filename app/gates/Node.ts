import * as canvas from "../interfaces/canvas";
import Wire from "./Wire";
import Gates from "./Gates";

export default class GateNode<T extends Gates<any>> {
    public state: canvas.NodeState<T>

    public constructor(gate: T, coords: canvas.GateCoords, type: string) {
        this.state = { gate, wire: [], coords, type, value: false };
    }

    public setWire = (wire: Wire, type: string): boolean => {
        
        switch (type) {
            case "start":
                this.state.wire.push(wire);
                this.state.gate.connect("out", wire.state.endNode.state.gate);
                return true;
            case "end":
                if (this.state.wire.length === 0) {
                    this.state.wire.push(wire);
                    this.state.gate.connect("in", wire.state.startNode.state.gate);
                    return true;
                }
        }
        return false;

    }

    public getCoords = (): canvas.GateCoords => {
        return this.state.coords;
    }

    public render = (ctx: CanvasRenderingContext2D): void => {
        ctx.beginPath();
        ctx.strokeStyle = "rgb(0,0,0)";
        ctx.lineWidth = 3;
        ctx.arc(this.state.coords.x, this.state.coords.y, 1.5, 0, 2 * Math.PI);
        ctx.stroke();
    }

    public removeWire = (): void => {
        // Cop Out
        this.state.wire.pop();
    }

    public type = (): string => {
        return this.state.type;
    }

    public setCoords = (coords: canvas.GateCoords): void => {
        this.state.coords = coords;
    }

    public setVal = (val: boolean): void => {
        this.state.value = val;
        if (this.state.type === "start") this.state.wire.forEach(element => element.state.endNode.setVal(val));
    }

    public getVal = (): boolean => {
        return this.state.value;
    }
}