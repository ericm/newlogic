import * as React from 'react';
import { WorkspaceProps, WorkspaceState, Component, Gates } from '../interfaces/components';
import { GateCoords, GateSize, SelectedNode, AnyGate } from '../interfaces/canvas';

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

	private nodeSelectEnd: SelectedNode<any>
	private nodeSelectStart: SelectedNode<any>

	private clicked: AnyGate[] = [];
	private clickedDrag: AnyGate[] =[];

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
		this.nodeSelectEnd = {node: null, selected: false}
		this.nodeSelectStart = {node: null, selected: false}
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
		if(!!this.ctx) {
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

	private getCoords(e: any): GateCoords {
		const box = e.currentTarget.getBoundingClientRect();
		return {x: e.clientX - box.left, y: e.clientY - box.top};
	}

	private canvasClick = (e: React.MouseEvent<HTMLCanvasElement>): void => {
		let coords = this.getCoords(e);

		coords = Wiring.gridLayout(coords, this.state.gridFactor);

		switch (this.state.mode) {
			case "click":
				const and = Wiring.isClicked(this.gates.and, coords)
				switch (e.type) {
					case "click": 
						if (and !== null) { 
							this.clicked = []
							this.clear(); 
							this.updateCanvas(); 
							and.click();
							this.clicked.push(and);
						}
						break;
					
					case "mousedown": 
						if (and !== null) {
							if (and == this.clicked[0]) {
								this.setState({
									dragging: true,
									dragInit: coords
								});
								this.clickedDrag.push(and);
								this.clear();
								this.updateCanvas();
							}
						}
						break;
					
					case "mousemove":
						if (this.state.dragging) {
							// const move: GateCoords = {x: coords.x - this.state.dragInit.x, y: coords.y - this.state.dragInit.y}
							for (let gate of this.clickedDrag) {
								gate.drag(coords);
							}
							this.clear();
							this.updateCanvas();
						}
						break;
					case "mouseup":
						if (this.state.dragging) this.setState({dragging: false});
						break;

				}
				break;
			case "and":
				if (e.type == "click") {
					const size: GateSize = {width: 2*this.state.gridFactor+1, height: 2*this.state.gridFactor+1}
					const newNodes = this.gates.and[this.gates.and.length - 1].add(coords, size);

					this.endNodes.push(...newNodes.end);
					this.startNodes.push(...newNodes.start);
					
					Wiring.renderNodes(newNodes.end, this.ctx);
					Wiring.renderNodes(newNodes.start, this.ctx);

					this.gates.and.push(new AndGate(this.ctx));
				}

				break;
			
			case "draw":
				this.cavasDrag(e, coords);
			
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
				const node = Wiring.wireSnap(this.startNodes, coords, this.state.snapFactor);
				if (node !== null) {
					const snapCoords = node.getCoords();
					this.setState({
						dragInit: snapCoords,
						drag: snapCoords,
						dragging: true
					});
					this.nodeSelectStart = {node, selected: true}
				} else {
					this.nodeSelectStart = {node: null, selected: false};
				}
					
				break;
			case "mousemove":
				if (this.state.dragging) {
					const node = Wiring.wireSnap(this.endNodes, coords, this.state.snapFactor);
				
					if (node !== null) {
						coords = node.getCoords();
						this.nodeSelectEnd = {node, selected: true};
						console.log(this.nodeSelectEnd.node);
					} else {
						this.nodeSelectEnd = {node: null, selected: false};
					}
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
				if (this.nodeSelectEnd.selected && this.nodeSelectEnd.node !== null && this.nodeSelectStart.node !== null) {
					const wire = new Wire({start:{x: this.state.dragInit.x, y: this.state.dragInit.y}, 
						end: {x: this.state.drag.x, y: this.state.drag.y},
						startNode: this.nodeSelectStart.node, endNode: this.nodeSelectEnd.node});
	
					this.gates.wire.push(wire);
					this.nodeSelectEnd.node.setWire(wire);
					this.nodeSelectStart.node.setWire(wire)
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