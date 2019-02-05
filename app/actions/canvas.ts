import { GateCoords } from "../interfaces/canvas";
export namespace Wiring {
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
