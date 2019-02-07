import { GateCoords, GateGeneric } from "../interfaces/canvas";
import GateNode from "../gates/Node";

export namespace Wiring {

    export function wireSnap(nodes: GateNode<any>[], coords: GateCoords, snap: number): GateNode<any> | null {
        for (let i in nodes) {
            const nodeCoords = nodes[i].getCoords();
            if (Math.abs(coords.x - nodeCoords.x) <= snap && Math.abs(coords.y - nodeCoords.y) <= snap
                && !nodes[i].hasWire()) {
                return nodes[i];
            }
        }
        return null;
    }

    export function rerender<T extends GateGeneric>(obj: T[], ctx: CanvasRenderingContext2D | null): void {
        for (let i in obj) {
			if (!!obj[i].state && ctx !== null) obj[i].render(ctx);
			else if (!!obj[i].state) obj[i].render();
		}
    }

    export function drawWire(ctx: CanvasRenderingContext2D, init: GateCoords, current: GateCoords): void {
        ctx.beginPath();
        // Normalise for horizontal/vertical drawing
        let breakpoint: GateCoords = {
            y: (current.y),
            x: (init.x)
        }

        ctx.moveTo(init.x, init.y);
        ctx.lineTo(breakpoint.x, breakpoint.y);
        ctx.lineTo(current.x, current.y);
        ctx.strokeStyle = "black";
        ctx.lineWidth = 3;
        ctx.stroke();
    }

    export function gridLayout(coords: GateCoords, factor: number): GateCoords  {
        let x: number, y: number;
        x = Math.ceil(coords.x/factor)*factor;
        y = Math.ceil(coords.y/factor)*factor;
        return {x, y}
    }
}
