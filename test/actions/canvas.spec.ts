import { Wiring } from '../../app/actions/canvas';
import AndGate from '../../app/gates/AND';
import GateNode from '../../app/gates/Node';
import { GateCoords } from '../../app/interfaces/canvas';

const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
describe("Wiring", () => {
    describe("wireSnap", () => {
        it("returns node", () => {
            if (ctx !== null) {
                const coords: GateCoords = { x: 0, y: 0 }
                const nodes = [new GateNode<AndGate>(new AndGate(ctx), coords, "end")];
                expect(Wiring.wireSnap(nodes, coords, 20)).toBe(nodes[0]);
            }
        });
        it("returns null", () => {
            if (ctx !== null) {
                const coords: GateCoords = { x: 100, y: 100 };
                const nodes = [new GateNode<AndGate>(new AndGate(ctx), { x: 0, y: 0 }, "end")];
                expect(Wiring.wireSnap(nodes, coords, 20)).toBeNull();
            }
        });
    });

    describe("isClicked", () => {
        it("returns gate", () => {
            if (ctx !== null) {
                const obj = [new AndGate(ctx), new AndGate(ctx)];
                obj[0].add({ x: 100, y: 100 }, { width: 40, height: 40 });
                const coords: GateCoords = { x: 110, y: 110 };
                expect(Wiring.isClicked(obj, coords)).toBe(obj[0]);
            }
        });
        it("returns null", () => {
            if (ctx !== null) {
                const obj = [new AndGate(ctx), new AndGate(ctx)];
                obj[0].add({ x: 100, y: 100 }, { width: 40, height: 40 });
                const coords: GateCoords = { x: 140, y: 140 };
                expect(Wiring.isClicked(obj, coords)).toBe(obj[0]);
            }
        });
    });

    describe("gridLayout", () => {
        it("returns coords", () => {
            const coords: GateCoords = { x: 101, y: 101 };
            const factor = 10;
            const ans: GateCoords = { x: 110, y: 110 }
            expect(Wiring.gridLayout(coords, factor)).toMatchObject(ans);
        });
    });
})