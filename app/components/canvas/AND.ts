import { GateCoords, AndState, GateSize } from '../../interfaces/canvas';

// import img from '../../img/and.svg'
let img = require('../../img/and.svg')
export default class AndGate {
	private ctx: CanvasRenderingContext2D
	private svg: HTMLImageElement
	public state: AndState

	public constructor(ctx: CanvasRenderingContext2D) {
		this.ctx = ctx;
		this.svg = new Image();
		this.svg.src = img;
	}

	public add = (c: GateCoords, s: GateSize): void => {
		this.state = {coords: {x: c.x, y: c.y}, size: s}
		this.svg.width = s.width
		this.svg.height = s.height
		this.ctx.drawImage(this.svg, c.x, c.y);
	}

}