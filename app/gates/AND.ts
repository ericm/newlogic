import * as canvas from '../interfaces/canvas';
import Gates from './Gates';
import GateNode from './Node';

// import img from '../img/and.svg'
let img = require('../img/and.svg')
export default class AndGate extends Gates<AndGate> {
    nodeOffsetStart = [{ x: 40, y: 20.5 }]
    nodeOffsetEnd = [{ x: 0, y: 1.5 }, { x: 0, y: 39.5 }]

    public static SVG: HTMLImageElement

    public static LOAD = (ctx: CanvasRenderingContext2D): Promise<boolean> => new Promise<boolean>((resolve) => {
        const listen = (_: Event): void => resolve(true);
        AndGate.SVG = new Image();
        AndGate.SVG.src = img;

        console.log(AndGate.SVG)

        ctx.drawImage(AndGate.SVG, 0, 0, 0, 0);
        AndGate.SVG.addEventListener("load", listen);
    })

    public constructor(ctx: CanvasRenderingContext2D) {
        super();
        this.ctx = ctx;
        this.svg = AndGate.SVG;
        this.contextMenu = ["Make NAND"].concat(this.contextMenu);
    }

    public add = (c: canvas.GateCoords, s: canvas.GateSize, id?: number): canvas.Nodes<any> => {
        const c1: canvas.GateCoords = { x: c.x + this.nodeOffsetEnd[0].x, y: c.y + this.nodeOffsetEnd[0].y }
        const c2: canvas.GateCoords = { x: c.x + this.nodeOffsetEnd[1].x, y: c.y + this.nodeOffsetEnd[1].y }

        const c3: canvas.GateCoords = { x: c.x + this.nodeOffsetStart[0].x, y: c.y + this.nodeOffsetStart[0].y }

        this.state = {
            coords: { x: c.x, y: c.y },
            size: s,
            nodes: {
                start: [new GateNode<AndGate>(this, c3, "start")],
                end: [new GateNode<AndGate>(this, c1, "end"), new GateNode<AndGate>(this, c2, "end")]
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
        
        // Bitwise AND
        this.state.nodes.start[0].setVal(
            this.state.nodes.end[0].getVal() && this.state.nodes.end[1].getVal()
        );
    }

}