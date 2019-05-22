import * as canvas from '../interfaces/canvas';
import Gates from './Gates';
import GateNode from './Node';

let img = require('../img/or.svg');
let imgNot = require('../img/orNot.svg');
export default class OrGate extends Gates<OrGate> {

    public static SVG: HTMLImageElement
    public static SVGNOT: HTMLImageElement

    public static LOAD = (ctx: CanvasRenderingContext2D): Promise<boolean> => new Promise<boolean>((resolve) => {
        const listen = (_: Event): void => resolve(true);
        OrGate.SVG = new Image();
        OrGate.SVG.src = img;
        ctx.drawImage(OrGate.SVG, 0, 0, 0, 0);
        OrGate.SVG.addEventListener("load", () => {
            OrGate.SVGNOT = new Image();
            OrGate.SVGNOT.src = imgNot;
            ctx.drawImage(OrGate.SVGNOT, 0, 0, 0, 0);
            OrGate.SVGNOT.addEventListener("load", listen);
        });
    })

    public constructor(ctx: CanvasRenderingContext2D) {
        super();
        this.ctx = ctx;
        this.svg = OrGate.SVG;

        this.nodeOffsetStart = [{ x: 40, y: 20.5 }]
        this.nodeOffsetEnd = [{ x: 0, y: 1.5 }, { x: 0, y: 39.5 }]

        this.contextMenu = ["Make NOR"].concat(this.contextMenu);
    }

    public checkCustomContext = (option: string): boolean => {
        switch (option) {
        case "Make NOR":
            this.svg = OrGate.SVGNOT;
            this.contextMenu[0] = "Make OR";
            this.state.invert = true;
            return true;
        case "Make OR":
            this.svg = OrGate.SVG;
            this.contextMenu[0] = "Make NOR";
            this.state.invert = false;
            return true;
        }
        return false;
    }

    public add = (c: canvas.GateCoords, s: canvas.GateSize, id?: number): canvas.Nodes<any> => {
        const c1: canvas.GateCoords = { x: c.x + this.nodeOffsetEnd[0].x, y: c.y + this.nodeOffsetEnd[0].y }
        const c2: canvas.GateCoords = { x: c.x + this.nodeOffsetEnd[1].x, y: c.y + this.nodeOffsetEnd[1].y }

        const c3: canvas.GateCoords = { x: c.x + this.nodeOffsetStart[0].x, y: c.y + this.nodeOffsetStart[0].y }

        this.state = {
            coords: { x: c.x, y: c.y },
            size: s,
            nodes: {
                start: [new GateNode<OrGate>(this, c3, "start")],
                end: [new GateNode<OrGate>(this, c1, "end"), new GateNode<OrGate>(this, c2, "end")]
            },
            gateIn: new Array(),
            gateOut: new Array(),
            id: !!id ? id : Gates.INCID(),
            invert: false
        }

        this.render();

        return this.state.nodes;
    }

    public evaluate = (): void => {
        this.upEval();
        
        // Bitwise OR
        let val = this.state.nodes.end[0].getVal() || this.state.nodes.end[1].getVal();
        if (this.state.invert) {
            val = !val;
        }

        this.state.nodes.start[0].setVal(val);

    }

}