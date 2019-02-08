import { GateCoords, GateSize, Nodes } from '../interfaces/canvas';
import Gates from './Gates';
import GateNode from './Node';

// import img from '../img/and.svg'
let img = require('../img/and.svg')
export default class AndGate extends Gates<AndGate> {
	public constructor(ctx: CanvasRenderingContext2D) {
		super();
		this.ctx = ctx;
		this.svg = new Image();
		this.svg.src = img;
	}

	public add = (c: GateCoords, s: GateSize): Nodes<AndGate> => {
		const c1: GateCoords = {x: c.x, y: c.y+1.5}
		const c2: GateCoords = {x: c.x, y: c.y+s.height-1.5}

		const c3: GateCoords = {x: c.x+30, y: c.y+30}

		this.state = {
			coords: {x: c.x, y: c.y}, 
			size: s, 
			nodes: {
				start: [new GateNode<AndGate>(this, c1), new GateNode<AndGate>(this, c2)],
				end: [new GateNode<AndGate>(this, c3)]
			}
		}

		this.render();
		
		return this.state.nodes;
	}

}