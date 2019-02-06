import { GateCoords, GateSize, AndState } from '../interfaces/canvas';
import Gates from './Gates';
import GateNode from './Node';

// import img from '../img/and.svg'
let img = require('../img/and.svg')
export default class AndGate extends Gates {
	private and: AndState
	public constructor(ctx: CanvasRenderingContext2D) {
		super();
		this.ctx = ctx;
		this.svg = new Image();
		this.svg.src = img;

	}

	public add = (c: GateCoords, s: GateSize): GateNode<AndGate>[] => {
		this.state = {coords: {x: c.x, y: c.y}, size: s}
		const c1: GateCoords = {x: c.x-10, y: c.y-10}
		const c2: GateCoords = {x: c.x+10, y: c.y+10}
		
		this.and = {nodes: [new GateNode<AndGate>(this, c1), new GateNode<AndGate>(this, c2)]}
		this.render();
		
		return this.and.nodes;
	}

}