import { GateCoords, GateSize, Nodes } from '../interfaces/canvas';
import Gates from './Gates';
import GateNode from './Node';

// import img from '../img/and.svg'
let img = require('../img/not.svg');
export default class NotGate extends Gates<NotGate> {

	public constructor(ctx: CanvasRenderingContext2D) {
		super();
		this.ctx = ctx;
		this.svg = new Image();
        this.svg.src = img;
        
        this.nodeOffsetStart = [{ x: 40, y: 20.5 }];
        this.nodeOffsetEnd =  [{ x: 0, y: 20.5 }];
	}

	public add = (c: GateCoords, s: GateSize): Nodes<NotGate> => {
		const c1: GateCoords = { x: c.x + this.nodeOffsetEnd[0].x, y: c.y + this.nodeOffsetEnd[0].y }

		const c3: GateCoords = { x: c.x + this.nodeOffsetStart[0].x, y: c.y + this.nodeOffsetStart[0].y }

		this.state = {
			coords: { x: c.x, y: c.y },
			size: s,
			nodes: {
				start: [new GateNode<NotGate>(this, c3, "start")],
				end: [new GateNode<NotGate>(this, c1, "end")]
			},
			gateIn: new Array(),
			gateOut: new Array(),
			id: Gates.INCID()
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