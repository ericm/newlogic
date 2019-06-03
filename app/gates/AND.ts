import * as canvas from '../interfaces/canvas';
import Gates from './Gates';
import GateNode from './Node';

// import img from '../img/and.svg'
let img = require('../img/and.svg');
let imgNot = require('../img/andNot.svg');
export default class AndGate extends Gates<AndGate> {
    nodeOffsetStart = [{ x: 40, y: 20.5 }]
    nodeOffsetEnd = [
        { x: 0, y: 1.5 }, { x: 0, y: 39.5 }, 
        {x: 0, y: 19},
    ];

    public static SVG: HTMLImageElement
    public static SVGNOT: HTMLImageElement

    public static LOAD = (ctx: CanvasRenderingContext2D): Promise<boolean> => new Promise<boolean>((resolve) => {
        const listen = (_: Event): void => resolve(true);
        AndGate.SVG = new Image();
        AndGate.SVG.src = img;
        ctx.drawImage(AndGate.SVG, 0, 0, 0, 0);
        AndGate.SVG.addEventListener("load", () => {
            AndGate.SVGNOT = new Image();
            AndGate.SVGNOT.src = imgNot;
            ctx.drawImage(AndGate.SVGNOT, 0, 0, 0, 0);
            AndGate.SVGNOT.addEventListener("load", listen);
        });
    })

    public constructor(ctx: CanvasRenderingContext2D) {
        super();
        this.ctx = ctx;
        this.svg = AndGate.SVG;
        this.contextMenu = ["Make NAND"].concat(this.contextMenu);
        this.props = new Map<string, Array<any>>([["Node count", ["number", 2, 4, 2]]]);
    }

    public checkCustomContext = (option: string): boolean => {
        switch (option) {
        case "Make NAND":
            this.svg = AndGate.SVGNOT;
            this.contextMenu[0] = "Make AND";
            this.state.invert = true;
            return true;
        case "Make AND":
            this.svg = AndGate.SVG;
            this.contextMenu[0] = "Make NAND";
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
                start: [new GateNode<AndGate>(this, c3, "start")],
                end: [new GateNode<AndGate>(this, c1, "end"), new GateNode<AndGate>(this, c2, "end")]
            },
            gateIn: new Array(),
            gateOut: new Array(),
            id: !!id ? id : Gates.INCID(),
            invert,
            type: "and"
        }

        if (invert) {
            this.svg = AndGate.SVGNOT;
            this.contextMenu[0] = "Make AND";
        }

        this.render();

        return this.state.nodes;
    }

    public checkProps = () => {
        // Node count
        if (this.props.get("Node count")![3] !== this.state.nodes.end.length) {
            let count = this.props.get("Node count")![3];
            if (count > this.state.nodes.end.length) {
                console.log(count);
                switch (count) {
                    case "3":
                        const c: canvas.GateCoords = { x: this.state.coords.x + this.nodeOffsetEnd[2].x, y: this.state.coords.y + this.nodeOffsetEnd[2].y };
                        this.state.nodes.end.push(new GateNode<AndGate>(this, c, "end"));
                        this.render();
                        console.log(this.state.nodes);
                        break;
                }
            } else {
                this.state.nodes.end.splice(0, count-1);
            }
            
        }
    }

    public evaluate = (): void => {
        this.upEval();
        
        // Bitwise AND
        // TODO: expand
        let val = this.state.nodes.end[0].getVal() && this.state.nodes.end[1].getVal();
        if (this.state.invert) {
            val = !val;
        }
        this.state.nodes.start[0].setVal(val);
    }

}