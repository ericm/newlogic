import * as React from 'react';
import { WorkspaceProps, WorkspaceState, Component, Gates } from '../interfaces/components';
import { GateCoords, GateSize } from '../interfaces/canvas';

let styles = require('./styles/Workspace.scss');

//import items (gates etc)
import AndGate from '../gates/AND';
import { Wiring } from '../actions/canvas';
import Wire from '../gates/Wire';
import GateNode from '../gates/Node';

export default class Workspace extends React.Component<WorkspaceProps, WorkspaceState> {

	private canvas: HTMLCanvasElement
	public ctx: CanvasRenderingContext2D
	private gates: Gates
	private nodes: GateNode<any>[]

	public constructor(props: WorkspaceProps) {
		super(props);
		this.state = {
			width: (this.props.width * window.innerWidth / 100).toString(), 
			height: (this.props.height * window.innerHeight / 100).toString(),
			mode: "draw",
			dragging: false,
			dragInit: {x: 0, y: 0},
			drag: {x: 0, y: 0},
			gridFactor: 20
		}
	}
	
	public componentDidMount() {
		this.setCtx();
		this.setState({
			width: (this.props.width * window.innerWidth / 100).toString(), 
			height: (this.props.height * window.innerHeight / 100).toString()
		});
		this.gates = {and: [], wire: []}
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
		for (let i in this.gates.wire) {
			if (!!this.gates.wire[i].state) this.gates.wire[i].render(this.ctx);
		}
		for (let i in this.gates.and) {
			if (!!this.gates.and[i].state) this.gates.and[i].render();
		}
	}

	private getCoords(e: React.DragEvent | React.MouseEvent): GateCoords {
		const box = e.currentTarget.getBoundingClientRect();
		return {x: e.clientX - box.left, y: e.clientY - box.top};
	}

	private canvasClick = (e: React.MouseEvent<HTMLCanvasElement>): void => {
		let coords = this.getCoords(e);

		coords = Wiring.gridLayout(coords, this.state.gridFactor);

		switch(this.state.mode) {
			case "and": {
				if (e.type == "click") {
					const size: GateSize = {width: 40, height: 40}
					this.gates.and.push(new AndGate(this.ctx));
					this.nodes.concat(this.gates.and[this.gates.and.length - 1].add(coords, size));
				}
				break;
			}
			case "draw": {
				this.cavasDrag(e, coords);
			}
		}
		
	}

	private cavasDrag = (e: React.MouseEvent<HTMLCanvasElement>, coords: GateCoords): void => {

		// Drawing wires

		switch(e.type) {
			case "mousedown":
				this.setState({
					dragInit: coords,
					drag: coords,
					dragging: true
				});
				
				break;
			case "mousemove":
				if (this.state.dragging) {
					this.setState({
						drag: coords
					});
				}
				break;
			case "mouseup":
			case "mouseleave":
				this.setState({dragging: false});
				// save wire
				const wire = new Wire({start:{x: this.state.dragInit.x, y: this.state.dragInit.y}, 
					end: {x: this.state.drag.x, y: this.state.drag.y}});

				this.gates.wire.push(wire);
				break;
		}

		if (this.state.dragging) {
			this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
			this.updateCanvas();
			Wiring.drawWire(this.ctx, this.state.dragInit, this.state.drag);
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
					onMouseUp={this.canvasClick} onMouseDown={this.canvasClick} onMouseMove={this.canvasClick} 
					onMouseLeave={this.canvasClick} />
			</div>
		)
	}
}