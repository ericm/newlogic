import { GateCoords } from './../../app/interfaces/canvas.d';
import GateNode from '../../app/gates/Node';
import AndGate from '../../app/gates/AND';

const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");

describe("Node", () => {
    it("returns type", () => {
        if (ctx !== null) {
            const coords: GateCoords = {x: 100, y: 100};

            const gate = new AndGate(ctx);

            const wrapper = new GateNode(gate, coords, "start");
            expect(wrapper.type()).toBe("start");
        }
    });

    it("returns coords", () => {
        if (ctx !== null) {
            const coords: GateCoords = {x: 100, y: 100};

            const gate = new AndGate(ctx);

            const wrapper = new GateNode(gate, coords, "start");
            expect(wrapper.getCoords()).toBe(coords);
        }
    });

    it("returns value", () => {
        if (ctx !== null) {
            const coords: GateCoords = {x: 100, y: 100};

            const gate = new AndGate(ctx);

            const wrapper = new GateNode(gate, coords, "start");
            wrapper.setVal(true);
            expect(wrapper.getVal()).toBe(true);
        }
    });
});