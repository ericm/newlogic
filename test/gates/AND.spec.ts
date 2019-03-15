import { GateCoords, GateSize } from './../../app/interfaces/canvas.d';
import AndGate from "../../app/gates/AND";

const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");

describe("AndGate", () => {
    it("initiates", () => {
        if (ctx !== null) {
            AndGate.LOAD(ctx).then(() => {
                const gate = new AndGate(ctx);
                const coords: GateCoords = {x: 100, y: 100};
                const size: GateSize = {width: 40, height: 40};
                const wrapper = gate.add(coords, size);
                expect(wrapper).toHaveProperty("start");
                expect(wrapper).toHaveProperty("end");

                expect(wrapper.end).toHaveLength(2);
                expect(wrapper.start).toHaveLength(1);
            });
        }
    });
});