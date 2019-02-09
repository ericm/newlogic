import * as React from 'react';
import { WorkspaceProps, WorkspaceState, Component, Gates } from '../interfaces/components';
import { GateCoords, GateSize, SelectedNode } from '../interfaces/canvas';

let styles = require('./styles/Workspace.scss');

//import items (gates etc)
import AndGate from '../gates/AND';
import { Wiring } from '../actions/canvas';
import Wire from '../gates/Wire';
import GateNode from '../gates/Node';

export default class Workspace extends React.Component<WorkspaceProps, WorkspaceState> {

	private canvas: HTMLCanvasElement
	private ctx: CanvasRenderingContext2D
	private gates: Gates

	private endNodes: GateNode<any>[] = []
	private startNodes: GateNode<any>[] = []
	private nodeSelect: SelectedNode<any>

	public constructor(props: WorkspaceProps) {
		super(props);
		this.state = {
			width: (this.props.width * window.innerWidth / 100).toString(), 
			height: (this.props.height * window.innerHeight / 100).toString(),
			mode: "draw",
			dragging: false,
			dragInit: {x: 0, y: 0},
			drag: {x: 0, y: 0},
			gridFactor: 20,
			snapFactor: 20
		}
		this.nodeSelect = {node: null, selected: false}
	}

	public changeMode = (mode: string): void => this.setState({mode})
	
	public componentDidMount() {
		this.setCtx();
		this.setState({
			width: (this.props.width * window.innerWidth / 100).toString(), 
			height: (this.props.height * window.innerHeight / 100).toString()
		});
		this.gates = {and: [], wire: []}
		this.gates.and.push(new AndGate(this.ctx));

		// Draw grid
		this.drawGrid();
	}
	
	public componentDidUpdate() {
		this.updateCanvas();
	}

	private drawGrid = (): void => {
		this.ctx.fillStyle = "rgba(0,0,0,1)";
		for (let x = 0; x < this.canvas.width; x++) {
			if (x % this.state.snapFactor == 0) {
				for (let y = 0; y < this.canvas.height; y++) {
					if (y % this.state.snapFactor == 0) {
						this.ctx.fillRect(x, y, 1, 1);
					}
				}
			}
		}
	}

	private setCtx = (): void => {
		const cont = this.canvas.getContext('2d');
		if (cont !== null) {
			this.ctx = cont;
		}
	}

	private updateCanvas = (): void => {
		this.drawGrid();
		Wiring.rerender(this.gates.wire, this.ctx);
		Wiring.rerender(this.gates.and, null);
		Wiring.renderNodes(this.startNodes, this.ctx);
		Wiring.renderNodes(this.endNodes, this.ctx);
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
					const newNodes = this.gates.and[this.gates.and.length - 1].add(coords, size);

					this.endNodes.push(...newNodes.end);
					
					Wiring.renderNodes(newNodes.end, this.ctx);
					Wiring.renderNodes(newNodes.start, this.ctx);

					this.gates.and.push(new AndGate(this.ctx));
				}

				break;
			}
			case "draw": {
				this.cavasDrag(e, coords);
			}
		}
		
	}

	private clear = (): void => {
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		this.updateCanvas();
	}

	private cavasDrag = (e: React.MouseEvent<HTMLCanvasElement>, coords: GateCoords): void => {

		// Drawing wires

		switch(e.type) {
			case "mousedown":
				this.startNodes.forEach((val: GateNode<any>): void => {
					const valCoords = val.getCoords();
					// check if the line is coming from a node
					if (Math.abs(coords.x - valCoords.x) < this.state.snapFactor 
						&& Math.abs(coords.y - valCoords.y) < this.state.snapFactor ) {
							this.setState({
								dragInit: coords,
								drag: coords,
								dragging: true
							});
					}
				})
				
				break;
			case "mousemove":
				const node = Wiring.wireSnap(this.endNodes, coords, this.state.snapFactor);
				
				if (node !== null) {
					coords = node.getCoords();
					this.nodeSelect = {node, selected: true};
					console.log(this.nodeSelect.node);
				} else {
					this.nodeSelect = {node: null, selected: false};
				}
				if (this.state.dragging) {
					this.setState({
						drag: coords
					});
					this.clear();
					Wiring.drawWire(this.ctx, this.state.dragInit, this.state.drag);
				}
				
				break;
			case "mouseup":
			case "mouseleave":
				this.setState({dragging: false});
				// save wire
				if (this.nodeSelect.selected && this.nodeSelect.node !== null) {
					const wire = new Wire({start:{x: this.state.dragInit.x, y: this.state.dragInit.y}, 
						end: {x: this.state.drag.x, y: this.state.drag.y}, endNode: this.nodeSelect.node});
	
					this.gates.wire.push(wire);
					this.nodeSelect.node.setWire(this.gates.wire[this.gates.wire.length - 1]);
				} else {
					this.clear();
				}
				break;
		}

	}

	public resize = (n: Component): void =>
		this.setState({
			width: (n.width * window.innerWidth / 100).toString(), 
			height: (n.height * window.innerHeight / 100).toString()
		});
	

	public render(): JSX.Element {
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