import { GateCoords, GateSize, WireProps } from './../../app/interfaces/canvas.d';
import Wire from '../../app/gates/Wire';
import GateNode from '../../app/gates/Node';
import AndGate from '../../app/gates/AND';

const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");

describe("Wire", () => {
    it("initiates", () => {
        if (ctx !== null) {
            const coords: GateCoords = {x: 100, y: 100};

            const gate = new AndGate(ctx);

            const startNode = new GateNode(gate, coords, "start");
            const endNode = new GateNode(gate, coords, "end");

            const props: WireProps = {startNode, endNode}
            const wrapper = new Wire(props);

            expect(wrapper.state).toBeDefined();
            expect(wrapper.state.endNode).toBe(endNode);
            expect(wrapper.state.startNode).toBe(startNode);
        }
    });
});