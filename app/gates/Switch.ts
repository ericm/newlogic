import { GateCoords, GateSize, Nodes } from '../interfaces/canvas';
import Gates from './Gates';
import GateNode from './Node';

// import img from '../img/and.svg'
let img = require('../img/switch.svg')
export default class Switch extends Gates<Switch> {

	public constructor(ctx: CanvasRenderingContext2D) {
		super();
		this.ctx = ctx;
		this.svg = new Image();
		this.svg.src = img;

		this.nodeOffsetStart = [{ x: 40, y: 20.5 }]
	}

	public add = (c: GateCoords, s: GateSize): Nodes<Switch> => {
		const c1: GateCoords = { x: c.x + this.nodeOffsetStart[0].x, y: c.y + this.nodeOffsetStart[0].y }

		this.state = {
			coords: { x: c.x, y: c.y },
			size: s,
			nodes: {
				start: [new GateNode<Switch>(this, c1, "start")],
				end: []
			}
		}

		this.render();

		return this.state.nodes;
	}

	public clickSpecific = (): void => {
		
	}

}