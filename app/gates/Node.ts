import { NodeState, GateCoords } from "../interfaces/canvas";
import Wire from "./Wire";

export default class GateNode<T> {
    private state: NodeState<T>

    public constructor(gate: T, coords: GateCoords) {
        this.state = {gate, wire: null, coords};
    }

    public setWire = (wire: Wire): void => {
        this.state.wire = wire;
    }
}