import * as canvas from '../interfaces/canvas';
import Gates from './Gates';
import GateNode from './Node';

let img = require('../img/xor.svg');
let imgNot = require('../img/xorNot.svg');
export default class XOrGate extends Gates<XOrGate> {

    public static SVG: HTMLImageElement
    public static SVGNOT: HTMLImageElement

    public static LOAD = (ctx: CanvasRenderingContext2D): Promise<boolean> => new Promise<boolean>((resolve) => {
        const listen = (_: Event): void => resolve(true);
        XOrGate.SVG = new Image();
        XOrGate.SVG.src = img;
        ctx.drawImage(XOrGate.SVG, 0, 0, 0, 0);
        XOrGate.SVG.addEventListener("load", () => {
            XOrGate.SVGNOT = new Image();
            XOrGate.SVGNOT.src = imgNot;
            ctx.drawImage(XOrGate.SVGNOT, 0, 0, 0, 0);
            XOrGate.SVGNOT.addEventListener("load", listen);
        });
    })

    public constructor(ctx: CanvasRenderingContext2D) {
        super();
        this.ctx = ctx;
        this.svg = XOrGate.SVG;

        this.nodeOffsetStart = [{ x: 40, y: 20.5 }]
        this.nodeOffsetEnd = [{ x: 0, y: 1.5 }, { x: 0, y: 39.5 }]

        this.contextMenu = ["Make XNOR"].concat(this.contextMenu);
    }

    public checkCustomContext = (option: string): boolean => {
        switch (option) {
        case "Make XNOR":
            this.svg = XOrGate.SVGNOT;
            this.contextMenu[0] = "Make XOR";
            this.state.invert = true;
            return true;
        case "Make XOR":
            this.svg = XOrGate.SVG;
            this.contextMenu[0] = "Make XNOR";
            this.state.invert = false;
            return true;
        }
        return false;
    }

    public add = (c: canvas.GateCoords, s: canvas.GateSize, id?: number, invert = false): canvas.Nodes<any> => {
        const c1: canvas.GateCoords = { x: c.x + this.nodeOffsetEnd[0].x, y: c.y + this.nodeOffsetEnd[0].y }
        const c2: canvas.GateCoords = { x: c.x + this.nodeOffsetEnd[1].x, y: c.y + this.nodeOffsetEnd[1].y }

        const c3: canvas.GateCoords = { x: c.x + this.nodeOffsetStart[0].x, y: c.y + this.nodeOffsetStart[0].y }

        this.state = {
            coords: { x: c.x, y: c.y },
            size: s,
            nodes: {
                start: [new GateNode<XOrGate>(this, c3, "start")],
                end: [new GateNode<XOrGate>(this, c1, "end"), new GateNode<XOrGate>(this, c2, "end")]
            },
            gateIn: new Array(),
            gateOut: new Array(),
            id: !!id ? id : Gates.INCID(),
            invert,
            type: "xor"
        }

        if (invert) {
            this.svg = XOrGate.SVGNOT;
            this.contextMenu[0] = "Make XOR";
        }

        this.render();

        return this.state.nodes;
    }

    public evaluate = (): void => {
        this.upEval();
        
        // Bitwise XOR
        let a = this.state.nodes.end[0].getVal(),
            b = this.state.nodes.end[1].getVal();
        
        let val =  (!a && b) || (a && !b) ;
        if (this.state.invert) {
            val = !val;
        }

        this.state.nodes.start[0].setVal(val);

    }

}