import * as canvas from '../interfaces/canvas';
import Gates from './Gates';
import GateNode from './Node';

let img = require('../img/led.svg')
let imgOn = require('../img/ledOn.svg')
export default class LED extends Gates<LED> {
    public state: canvas.InState<LED>

    public static SVG: HTMLImageElement
    public static SVGON: HTMLImageElement

    public static LOAD = (ctx: CanvasRenderingContext2D): Promise<boolean> => new Promise<boolean>((resolve) => {
        const listen = (_: Event): void => resolve(true);
        LED.SVG = new Image();
        LED.SVG.src = img;

        ctx.drawImage(LED.SVG, 0, 0, 0, 0);

        // Load SVGON
        LED.SVGON = new Image();
        LED.SVGON.src = imgOn;

        ctx.drawImage(LED.SVG, 0, 0, 0, 0);
        LED.SVG.addEventListener("load", listen);
    })

    public constructor(ctx: CanvasRenderingContext2D) {
        super();
        this.ctx = ctx;
        this.svg = LED.SVG;

        this.nodeOffsetEnd = [{ x: 0, y: 20.5 }]
    }

    public add = (c: canvas.GateCoords, s: canvas.GateSize, id?: number, invert = false): canvas.Nodes<any> => {
        const c1: canvas.GateCoords = { x: c.x + this.nodeOffsetEnd[0].x, y: c.y + this.nodeOffsetEnd[0].y }

        this.state = {
            coords: { x: c.x, y: c.y },
            size: s,
            nodes: {
                start: [],
                end: [new GateNode<LED>(this, c1, "end")]
            },
            connected: false,
            input: false,
            gateIn: new Array(),
            gateOut: new Array(),
            id: !!id ? id : Gates.INCID()
        }

        this.render();

        return this.state.nodes;
    }

    private setInput = (): void => {
        this.state.input = this.state.nodes.end[0].getVal();
        if (this.state.input) {
            this.svg = LED.SVGON;
        } else {
            this.svg = LED.SVG;
        }
        this.render();
    }

    public evaluate = (): void => {
        this.upEval();
        
        // Set Val
        this.setInput();
        console.log(this.state.input);
    }

}