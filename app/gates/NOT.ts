import { GateCoords, GateSize, Nodes } from '../interfaces/canvas';
import Gates from './Gates';
import GateNode from './Node';

// import img from '../img/and.svg'
let img = require('../img/not.svg');
export default class NotGate extends Gates<NotGate> {
	private nodeOffsetStart: GateCoords[] = [{ x: 40, y: 20.5 }]
	private nodeOffsetEnd: GateCoords[] = [{ x: 0, y: 20.5 }]

	public constructor(ctx: CanvasRenderingContext2D) {
		super();
		this.ctx = ctx;
		this.svg = new Image();
		this.svg.src = img;
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
			}
		}

		this.render();

		return this.state.nodes;
	}

	public dragNodes = (c: GateCoords): void => {
		for (let i in this.state.nodes.start) {
			const move: GateCoords = { x: c.x + this.nodeOffsetStart[i].x, y: c.y + this.nodeOffsetStart[i].y }
			this.state.nodes.start[i].setCoords(move);
		}
		for (let i in this.state.nodes.end) {
			const move: GateCoords = { x: c.x + this.nodeOffsetEnd[i].x, y: c.y + this.nodeOffsetEnd[i].y }
			this.state.nodes.end[i].setCoords(move);
		}
	}

}