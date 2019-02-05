import { GateCoords } from "../interfaces/canvas";

export function drawWire(ctx: CanvasRenderingContext2D, init: GateCoords, current: GateCoords): void {
    ctx.beginPath();
    ctx.moveTo(init.x, init.y);
    ctx.lineTo(current.x, current.y);
    ctx.strokeStyle = "black";
    ctx.lineWidth = 14;
    ctx.stroke();
}