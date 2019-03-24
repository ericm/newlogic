import GateNode from "../gates/Node";
import { GateCoords, GateGeneric } from "../interfaces/canvas";
import { IContext } from "../interfaces/components";

export namespace Wiring {

    export function wireSnap(nodes: GateNode<any>[], coords: GateCoords, snap: number): GateNode<any> | null {
        for (let node of nodes) {
            const nodeCoords = node.getCoords();

            if (Math.abs(coords.x - nodeCoords.x) <= snap && Math.abs(coords.y - nodeCoords.y) <= snap) {
                return node;
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
        for (let gate of obj) {
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

    export function selection(ctx: CanvasRenderingContext2D, init: GateCoords, curent: GateCoords): void {
        // ctx.beginPath();
    }

    export function gridLayout(coords: GateCoords, factor: number): GateCoords {
        let x: number, y: number;
        x = Math.ceil(coords.x / factor) * factor;
        y = Math.ceil(coords.y / factor) * factor;
        return { x, y }
    }
    
    export function renderContext(ctx: CanvasRenderingContext2D, obj: IContext): void {
        ctx.fillStyle = 'rgba(20,20,20,.7)';
        ctx.strokeStyle = "rgba(20,20,20,.1)";
        ctx.lineWidth = 1;
        ctx.fillRect(obj.coords.x, obj.coords.y, obj.size.width, obj.size.height);
        ctx.strokeRect(obj.coords.x, obj.coords.y, obj.size.width, obj.size.height);
        ctx.strokeStyle = "black";
        ctx.lineWidth = 3;
    }

    export function contextClicked(coords: GateCoords, obj: IContext): boolean {
        let gatecoords = obj.coords;
        let size = obj.size;
        if (coords.x >= gatecoords.x && coords.x <= gatecoords.x + size.width &&
            coords.y >= gatecoords.y && coords.y <= gatecoords.y + size.height) {
            return true;
        }
        return false;
    }
}
