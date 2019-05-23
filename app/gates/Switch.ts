import * as canvasD from './../interfaces/canvas.d';
import { GateCoords, GateSize, Nodes } from '../interfaces/canvas';
import Gates from './Gates';
import GateNode from './Node';

// import img from '../img/and.svg'
let img = require('../img/switch.svg');
let imgOn = require('../img/switchOn.svg');
export default class Switch extends Gates<Switch> {
    public static SVG: HTMLImageElement
    public static SVGON: HTMLImageElement

    public static LOAD = (ctx: CanvasRenderingContext2D): Promise<boolean> => new Promise<boolean>((resolve) => {
        const listen = (_: Event): void => resolve(true);
        Switch.SVG = new Image();
        Switch.SVG.src = img;

        ctx.drawImage(Switch.SVG, 0, 0, 0, 0);
        
        // Load imgOn
        Switch.SVGON = new Image();
        Switch.SVGON.src = imgOn;

        ctx.drawImage(Switch.SVGON, 0, 0, 0, 0);
        Switch.SVG.addEventListener("load", listen);
    })

    public state: canvasD.OutState<Switch>

    public constructor(ctx: CanvasRenderingContext2D) {
        super();
        this.ctx = ctx;
        this.svg = Switch.SVG;

        this.nodeOffsetStart = [{ x: 40, y: 20.5 }]
    }

    public add = (c: GateCoords, s: GateSize, id?: number, invert = false): Nodes<any> => {
        const c1: GateCoords = { x: c.x + this.nodeOffsetStart[0].x, y: c.y + this.nodeOffsetStart[0].y }

        this.state = {
            coords: { x: c.x, y: c.y },
            size: s,
            nodes: {
                start: [new GateNode<Switch>(this, c1, "start")],
                end: []
            },
            clicked: false,
            connected: false,
            gateIn: new Array(),
            gateOut: new Array(),
            id: !!id ? id : Gates.INCID()
        }

        this.render();

        return this.state.nodes;
    }

    public clickSpecific = (): void => {
        this.state.clicked = !this.state.clicked;
        this.setOutput();
    }

    private setOutput = (): void => {
        if (this.state.clicked) {
            this.svg = Switch.SVGON;
        } else {
            this.svg = Switch.SVG;
        }
        this.render();
    }

    public evaluate = (): void => {
        this.state.nodes.start[0].setVal(this.state.clicked);
    }

}