import Workspace from "../components/Workspace";
import GateNode from "../gates/Node";
import { AnyGate, GateCoords, GateGeneric, GateSize } from "../interfaces/canvas";
import { IContext } from "../interfaces/components";

export namespace Wiring {

    export function cutDraw(ctx: CanvasRenderingContext2D, init: GateCoords, coords: GateCoords): void {
        ctx.moveTo(init.x, init.y);
        ctx.lineTo(coords.x, coords.y);
        ctx.strokeStyle = "black";
        ctx.lineWidth = 3;
        ctx.stroke();
    }

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

    export function otherGates(coords: GateCoords, gates: AnyGate[], size: GateSize = {width: 40, height: 40}): boolean {
        for (let gate of gates) {
            if ((coords.x >= gate.state.coords.x && coords.x <= gate.state.coords.x + gate.state.size.width &&
                coords.y >= gate.state.coords.y && coords.y <= gate.state.coords.y + gate.state.size.height) ||
                (coords.x >= gate.state.coords.x - size.width && coords.x <= gate.state.coords.x + gate.state.size.width - size.width &&
                coords.y >= gate.state.coords.y - size.height && coords.y <= gate.state.coords.y + gate.state.size.height - size.height)) {
                    return true;
                }
        }
        return false;
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
        // Render background
        ctx.fillStyle = '#222222';
        ctx.strokeStyle = "rgba(20,20,20,.1)";
        ctx.lineWidth = 1;
        ctx.fillRect(obj.coords.x, obj.coords.y, obj.size.width, obj.size.height);
        ctx.strokeRect(obj.coords.x, obj.coords.y, obj.size.width, obj.size.height);

        // Render text
        ctx.fillStyle = "white";
        ctx.font = "15px PT_Sans";
        ctx.lineWidth = .7;
        let x = obj.coords.x + 5;
        let y = obj.coords.y + 15;
        for (let text of obj.options) {
            ctx.fillText(text, x, y+2, obj.size.width - 5);
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
        if (y > obj.coords.y + 15 && y < obj.coords.y + obj.size.height+ 15) {
            let i = Math.ceil(((y - obj.coords.y) / (obj.size.height) * obj.options.length));
            console.log(i-1);
            let renderY = obj.coords.y + 5 + 15*(i-1);
            ctx.fillStyle = "#000000";
            ctx.fillRect(obj.coords.x, renderY, obj.size.width, 15);

            // Render text
            ctx.fillStyle = "white";
            ctx.lineWidth = .7;
            ctx.fillText(obj.options[i-1], obj.coords.x + 5, obj.coords.y + 15*(i) + 2, obj.size.width - 5);
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
            case "Delete":
                workspace.deleteGate(gate.state.id);
                break;
        }
    }
}
