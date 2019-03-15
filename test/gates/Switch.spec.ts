import { GateCoords, GateSize } from './../../app/interfaces/canvas.d';
import Switch from "../../app/gates/Switch";

const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");

describe("Switch", () => {
    it("initiates", () => {
        if (ctx !== null) {
            Switch.LOAD(ctx).then(() => {
                const gate = new Switch(ctx);
                const coords: GateCoords = {x: 100, y: 100};
                const size: GateSize = {width: 40, height: 40};
                const wrapper = gate.add(coords, size);
                expect(wrapper).toHaveProperty("start");
                expect(wrapper).toHaveProperty("end");

                expect(wrapper.end).toHaveLength(1);
                expect(wrapper.start).toHaveLength(1);
            });
        }
    });
});