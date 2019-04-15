import * as canvas from '../interfaces/canvas';
import Gates from './Gates';
import GateNode from './Node';

// import img from '../img/and.svg'
let img = require('../img/not.svg');
export default class NotGate extends Gates<NotGate> {
    public static SVG: HTMLImageElement

    public static LOAD = (ctx: CanvasRenderingContext2D): Promise<boolean> => new Promise<boolean>((resolve) => {
        const listen = (_: Event): void => resolve(true);
        NotGate.SVG = new Image();
        NotGate.SVG.src = img;

        ctx.drawImage(NotGate.SVG, 0, 0, 0, 0);
        NotGate.SVG.addEventListener("load", listen);
    })

    public constructor(ctx: CanvasRenderingContext2D) {
        super();
        this.ctx = ctx;
        this.svg = NotGate.SVG;
        
        this.nodeOffsetStart = [{ x: 40, y: 20.5 }];
        this.nodeOffsetEnd =  [{ x: 0, y: 20.5 }];
    }

    public add = (c: canvas.GateCoords, s: canvas.GateSize, id?: number): canvas.Nodes<any> => {
        const c1: canvas.GateCoords = { x: c.x + this.nodeOffsetEnd[0].x, y: c.y + this.nodeOffsetEnd[0].y }

        const c3: canvas.GateCoords = { x: c.x + this.nodeOffsetStart[0].x, y: c.y + this.nodeOffsetStart[0].y }

        this.state = {
            coords: { x: c.x, y: c.y },
            size: s,
            nodes: {
                start: [new GateNode<NotGate>(this, c3, "start")],
                end: [new GateNode<NotGate>(this, c1, "end")]
            },
            gateIn: new Array(),
            gateOut: new Array(),
            id: !!id ? id : Gates.INCID()
        }

        this.render();

        return this.state.nodes;
    }

    public evaluate = (): void => {
        this.upEval();
        
        // Bitwise NOT
        this.state.nodes.start[0].setVal(
            !this.state.nodes.end[0].getVal()
        );
    }

}