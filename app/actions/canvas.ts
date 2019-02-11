import { GateCoords, GateGeneric } from "../interfaces/canvas";
import GateNode from "../gates/Node";

export namespace Wiring {

    export function wireSnap(nodes: GateNode<any>[], coords: GateCoords, snap: number): GateNode<any> | null {
        for (let i in nodes) {
            const noWire: boolean = nodes[i].type() == "end" ? !nodes[i].hasWire() : true;
            const nodeCoords = nodes[i].getCoords();
            
            if (Math.abs(coords.x - nodeCoords.x) <= snap && Math.abs(coords.y - nodeCoords.y) <= snap && noWire) {
                return nodes[i];
            }
        }
        return null;
    }

    export function rerender<T extends GateGeneric>(obj: T[], ctx: CanvasRenderingContext2D | null): void {
        for (let i of obj) {
			if (!!i.state && ctx !== null) i.render(ctx);
			else if (!!i.state) i.render();
		}
    }

    export function isClicked<T extends GateGeneric>(obj: T[], coords: GateCoords): T | null {
        for (let gate of obj.slice(0, obj.length-1)) {
            const size = gate.state.size;
            const gatecoords = gate.state.coords;

            if (coords.x >= gatecoords.x && coords.x <= gatecoords.x + size.width &&
                coords.y >= gatecoords.y && coords.y <= gatecoords.y + size.height) {
                    return gate;
                }
        }
        return null;
    }

    export function renderNodes(nodes: GateNode<any>[], ctx: CanvasRenderingContext2D): void {
        for (let i of nodes) {
            i.render(ctx);
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
