import GateNode from "../gates/Node";
import { GateCoords, GateGeneric, AnyGate } from "../interfaces/canvas";
import { IContext } from "../interfaces/components";
import Workspace from "../components/Workspace";

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
        console.log("ctx");
        // Render background
        ctx.fillStyle = 'rgba(20,20,20,.8)';
        ctx.strokeStyle = "rgba(20,20,20,.1)";
        ctx.lineWidth = 1;
        ctx.fillRect(obj.coords.x, obj.coords.y, obj.size.width, obj.size.height);
        ctx.strokeRect(obj.coords.x, obj.coords.y, obj.size.width, obj.size.height);

        // Render text
        ctx.strokeStyle = "white";
        ctx.font = "Arial";
        ctx.lineWidth = .7;
        let x = obj.coords.x + 5;
        let y = obj.coords.y + 15;
        for (let text of obj.options) {
            ctx.strokeText(text, x, y, obj.size.width - 5);
            y += 15;
        }

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

    export function contextHover(y: number, obj: IContext, ctx: CanvasRenderingContext2D): string {
        if (y > obj.coords.y + 15 && y < obj.coords.y + obj.size.height) {
            let i = Math.ceil((y - obj.coords.y + 10) / (obj.size.height - 10));
            let renderY = obj.coords.y + 5 + 15*(i-1);
            ctx.fillStyle = "rgba(0, 0, 0, .5)";
            ctx.fillRect(obj.coords.x, renderY, obj.size.width, 15);

            // Render text
            ctx.strokeStyle = "white";
            ctx.lineWidth = .7;
            ctx.strokeText(obj.options[i-1], obj.coords.x + 5, obj.coords.y + 15*(i), obj.size.width - 5);
            ctx.strokeStyle = "black";
            ctx.lineWidth = 3;

            // Return str
            return obj.options[i-1];
        }
        return "";
    }

    export function contextActions(workspace: Workspace, gate: AnyGate, option: string): void {
        switch (option) {
            case "Properties":
                workspace.propertyWindow(gate);
                break;
        }
    }
}
