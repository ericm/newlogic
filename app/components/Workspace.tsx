import * as React from 'react';
import { WorkspaceProps, WorkspaceState, Component, Gates } from '../interfaces/components';
import { GateCoords, GateSize } from '../interfaces/canvas';

let styles = require('./styles/Workspace.scss');

//import items (gates etc)
import AndGate from '../gates/AND';
import { drawWire } from '../actions/canvas';

export default class Workspace extends React.Component<WorkspaceProps, WorkspaceState> {

	private canvas: HTMLCanvasElement
	public ctx: CanvasRenderingContext2D
	public gates: Gates

	public constructor(props: WorkspaceProps) {
		super(props);
		this.state = {
			width: (this.props.width * window.innerWidth / 100).toString(), 
			height: (this.props.height * window.innerHeight / 100).toString(),
			mode: "draw",
			dragging: false,
			dragInit: {x: 0, y: 0},
			drag: {x: 0, y: 0}
		}
	}
	
	public componentDidMount() {
		this.setCtx();
		this.setState({
			width: (this.props.width * window.innerWidth / 100).toString(), 
			height: (this.props.height * window.innerHeight / 100).toString()
		});
		this.gates = {and: []}
		new AndGate(this.ctx);
	}
	
	public componentDidUpdate() {
		this.updateCanvas();
	}

	private setCtx = (): void => {
		const cont = this.canvas.getContext('2d');
		if (cont !== null) {
			this.ctx = cont;
		}
	}

	private updateCanvas = (): void => {
		for (let i in this.gates.and) {
			if (typeof this.gates.and[i].state !== "undefined") this.gates.and[i].render();
		}
	}

	private getCoords(e: React.DragEvent | React.MouseEvent): GateCoords {
		const box = e.currentTarget.getBoundingClientRect();
		return {x: e.clientX - box.left, y: e.clientY - box.top};
	}

	private canvasClick = (e: React.MouseEvent<HTMLCanvasElement>): void => {
		const coords = this.getCoords(e);

		switch(this.state.mode) {
			case "and": {
				const size: GateSize = {width: 40, height: 40}
				this.gates.and.push(new AndGate(this.ctx));
				this.gates.and[this.gates.and.length - 1].add(coords, size);
				break;
			}
			case "draw": {
				this.cavasDrag(e, coords);
			}
		}
		
	}

	private cavasDrag = (e: React.MouseEvent<HTMLCanvasElement>, coords: GateCoords): void => {

		console.log(e.type);

		switch(e.type) {
			case "mousedown":
				this.setState({
					dragInit: coords,
					drag: coords,
					dragging: true
				});
				this.ctx.save();
				break;
			case "mousemove":
				if (this.state.dragging) {
					this.setState({
						drag: coords
					});
				}
				break;
			case "mouseup":
				this.setState({dragging: false});
				break;
		}

		if (this.state.dragging) {
			this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
			this.updateCanvas();
			drawWire(this.ctx, this.state.dragInit, this.state.drag);
		}
	}

	public resize = (n: Component): void => {
		this.setState({
			width: (n.width * window.innerWidth / 100).toString(), 
			height: (n.height * window.innerHeight / 100).toString()
		});
	}

	public render() {
		return (
			<div className={styles.main}>
				<canvas ref={(canvas) => {if (canvas !== null) this.canvas = canvas}} onClick={this.canvasClick}
					className={styles.canvas} width={this.state.width} height={this.state.height} 
					onMouseUp={this.canvasClick}  onMouseDown={this.canvasClick} onMouseMove={this.canvasClick} />
			</div>
		)
	}
}