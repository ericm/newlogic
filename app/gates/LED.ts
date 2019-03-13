import { GateCoords, GateSize, Nodes, InState } from '../interfaces/canvas';
import Gates from './Gates';
import GateNode from './Node';

// import img from '../img/and.svg'
let img = require('../img/switch.svg')
export default class LED extends Gates<LED> {

	public state: InState<LED>

	public static LOAD = (ctx: CanvasRenderingContext2D): Promise<boolean> => new Promise<boolean>((resolve, _) => {
		const listen = (_: Event): void => resolve(true);
		const svg = new Image();
		svg.src = img;

		ctx.drawImage(svg, 0, 0, 0, 0);
		svg.addEventListener("load", listen);
	})

	public constructor(ctx: CanvasRenderingContext2D) {
		super();
		this.ctx = ctx;
		this.svg = new Image();
		this.svg.src = img;

		this.nodeOffsetEnd = [{ x: 0, y: 20.5 }]
	}

	public add = (c: GateCoords, s: GateSize, id?: number): Nodes<any> => {
		const c1: GateCoords = { x: c.x + this.nodeOffsetEnd[0].x, y: c.y + this.nodeOffsetEnd[0].y }

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

	public evaluate = (): void => {
		this.upEval();
		
		// Set Val
		this.state.input = this.state.nodes.end[0].getVal();
		console.log(this.state.input);
	}

}