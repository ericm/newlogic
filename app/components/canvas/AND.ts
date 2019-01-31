import { GateCoords, AndState } from '../../interfaces/canvas';

// let image = require('../../img/and.svg')

export default class AndGate {
	private ctx: CanvasRenderingContext2D
	public state: AndState

	public constructor(ctx: CanvasRenderingContext2D) {
		this.ctx = ctx;
		
	}

	public add = (c: GateCoords): void => {
		this.state = {coords: {x: c.x, y: c.y}}
		this.ctx.fillText("AND", c.x, c.y);
	}

}