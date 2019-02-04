import { GateCoords, GateSize } from '../../interfaces/canvas';
import Gates from './Gates';

// import img from '../../img/and.svg'
let img = require('../../img/and.svg')
export default class AndGate extends Gates {
	// private and: AndState
	public constructor(ctx: CanvasRenderingContext2D) {
		super();
		this.ctx = ctx;
		this.svg = new Image();
		this.svg.src = img;
		// this.and = {}
	}

	public add = (c: GateCoords, s: GateSize): void => {
		this.state = {coords: {x: c.x, y: c.y}, size: s}
		this.render();
	}

}