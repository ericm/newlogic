import { GateCoords } from "../interfaces/canvas";
export namespace Wiring {
    export function drawWire(ctx: CanvasRenderingContext2D, init: GateCoords, current: GateCoords): void {
        ctx.beginPath();
        // Normalise for horizontal/vertical drawing
        const breakpoint: GateCoords = {
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
}
