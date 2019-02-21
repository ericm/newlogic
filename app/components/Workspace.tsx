import * as React from 'react';
import { Wiring } from '../actions/canvas';
//import items (gates etc)
import AndGate from '../gates/AND';
import GateNode from '../gates/Node';
import OrGate from '../gates/OR';
import Wire from '../gates/Wire';
import { AnyGate, GateCoords, GateSize, SelectedNode, Nodes, Assoc } from '../interfaces/canvas';
import { Component, AllGates, WorkspaceProps, WorkspaceState } from '../interfaces/components';
import NotGate from '../gates/NOT';
import Switch from '../gates/Switch';
import LED from '../gates/LED';
import { Logic } from '../actions/logic';
import Gates from '../gates/Gates';

let styles = require('./styles/Workspace.scss');


export default class Workspace extends React.Component<WorkspaceProps, WorkspaceState> {

	private canvas: HTMLCanvasElement
	private ctx: CanvasRenderingContext2D
	private gates: AllGates

	private endNodes: GateNode<any>[] = []
	private startNodes: GateNode<any>[] = []

	private nodeSelectEnd: SelectedNode<any>
	private nodeSelectStart: SelectedNode<any>

	private clicked: AnyGate[] = [];
	private clickedDrag: AnyGate[] = [];

	private graph: Assoc = [];

	public constructor(props: WorkspaceProps) {
		super(props);
		this.state = {
			width: (this.props.width * window.innerWidth / 100).toString(),
			height: (this.props.height * window.innerHeight / 100).toString(),
			mode: "draw",
			dragging: false,
			dragInit: { x: 0, y: 0 },
			drag: { x: 0, y: 0 },
			gridFactor: 20,
			snapFactor: 20
		}
		this.nodeSelectEnd = { node: null, selected: false }
		this.nodeSelectStart = { node: null, selected: false }
	}

	public changeMode = (mode: string): void => this.setState({ mode });

	public onChange = (): void => {
		this.graph = Logic.graphCreate(this.endNodes, this.startNodes);
		console.log(this.graph);
	}

	public componentDidMount() {
		this.setCtx();
		this.setState({
			width: (this.props.width * window.innerWidth / 100).toString(),
			height: (this.props.height * window.innerHeight / 100).toString()
		});
		this.gates = { and: [], wire: [], or: [], not: [], switch: [], led: [] }

		// Buffer Gates
		this.gates.and.push(new AndGate(this.ctx));
		this.gates.or.push(new OrGate(this.ctx));
		this.gates.not.push(new NotGate(this.ctx));
		this.gates.switch.push(new Switch(this.ctx));
		this.gates.led.push(new LED(this.ctx));

		// Create graph
		this.onChange();

		// Draw grid
		this.drawGrid();
	}

	public componentDidUpdate() {
		this.updateCanvas();
	}

	private drawGrid = (): void => {
		if (!!this.ctx) {
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
		Wiring.rerender(this.gates.or, null);
		Wiring.rerender(this.gates.not, null);
		Wiring.rerender(this.gates.switch, null);
		Wiring.rerender(this.gates.led, null);

		Wiring.renderNodes(this.startNodes, this.ctx);
		Wiring.renderNodes(this.endNodes, this.ctx);
	}

	private getCoords(e: any): GateCoords {
		const box = e.currentTarget.getBoundingClientRect();
		return { x: e.clientX - box.left, y: e.clientY - box.top };
	}

	private canvasEvent = (e: React.MouseEvent<HTMLCanvasElement>): void => {
		let coords = this.getCoords(e);

		coords = Wiring.gridLayout(coords, this.state.gridFactor);

		switch (this.state.mode) {
			case "click":
				this.canvasClick(e, coords);
				break;

			case "draw":
				this.cavasDrag(e, coords);
				break;


			// Gate cases
			case "and":
				if (e.type == "click") {
					const size: GateSize = { width: 2 * this.state.gridFactor + 1, height: 2 * this.state.gridFactor + 1 }
					const newNodes = this.gates.and[this.gates.and.length - 1].add(coords, size);

					this.addNodes(newNodes);

					this.gates.and.push(new AndGate(this.ctx));
					this.onChange();
				}

				break;


			case "or":
				if (e.type == "click") {
					const size: GateSize = { width: 2 * this.state.gridFactor + 1, height: 2 * this.state.gridFactor + 1 }
					const newNodes = this.gates.or[this.gates.or.length - 1].add(coords, size);

					this.addNodes(newNodes);

					this.gates.or.push(new OrGate(this.ctx));
					this.onChange();
				}

				break;

			case "not":
				if (e.type == "click") {
					const size: GateSize = { width: 2 * this.state.gridFactor + 1, height: 2 * this.state.gridFactor + 1 }
					const newNodes = this.gates.not[this.gates.not.length - 1].add(coords, size);

					this.addNodes(newNodes);

					this.gates.not.push(new NotGate(this.ctx));
				}

				break;
			case "led":
				if (e.type == "click") {
					const size: GateSize = { width: 2 * this.state.gridFactor + 1, height: 2 * this.state.gridFactor + 1 }
					const newNodes = this.gates.led[this.gates.led.length - 1].add(coords, size);

					this.addNodes(newNodes);

					this.gates.led.push(new LED(this.ctx));
					this.onChange();
				}

				break;
			case "switch":
				if (e.type == "click") {
					const size: GateSize = { width: 2 * this.state.gridFactor + 1, height: 2 * this.state.gridFactor + 1 }
					const newNodes = this.gates.switch[this.gates.switch.length - 1].add(coords, size);

					this.addNodes(newNodes);

					this.gates.switch.push(new Switch(this.ctx));
					this.onChange();
				}

				break;
		}

	}

	private addNodes<T extends Gates<any>>(newNodes: Nodes<T>): void {
		this.endNodes.push(...newNodes.end);
		this.startNodes.push(...newNodes.start);

		Wiring.renderNodes(newNodes.end, this.ctx);
		Wiring.renderNodes(newNodes.start, this.ctx);
	}

	private clear = (): void => {
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		this.updateCanvas();
	}

	private canvasClick = (e: React.MouseEvent<HTMLCanvasElement>, coords: GateCoords): void => {

		// Find if a gate was clicked
		let gate: AnyGate | null = null;
		if (gate === null) gate = Wiring.isClicked(this.gates.and, coords);
		if (gate === null) gate = Wiring.isClicked(this.gates.or, coords);
		if (gate === null) gate = Wiring.isClicked(this.gates.not, coords);
		if (gate === null) gate = Wiring.isClicked(this.gates.switch, coords);
		if (gate === null) gate = Wiring.isClicked(this.gates.led, coords);

		switch (e.type) {
			case "click":
				if (gate !== null) {

					this.clicked = []
					this.clear();
					this.updateCanvas();
					gate.click();
					this.clicked.push(gate);

				} else {
					this.clicked = []
					this.clear();
					this.updateCanvas();
				}
				break;

			case "mousedown":
				if (gate !== null) {
					if (gate == this.clicked[0]) {
						console.log(this.gates.and);
						this.setState({
							dragging: true,
							dragInit: coords,
							drag: gate.state.coords
						});
						this.clickedDrag = [];
						this.clickedDrag.push(gate);
						this.clear();
						this.updateCanvas();
					}
				}
				break;

			case "mousemove":
				if (this.state.dragging) {
					const move: GateCoords = {
						x: coords.x - (this.state.dragInit.x - this.state.drag.x),
						y: coords.y - (this.state.dragInit.y - this.state.drag.y)
					}
					for (let g of this.clickedDrag) {
						g.drag(move);
					}
					this.clear();
					this.updateCanvas();
				}
				break;

			case "mouseup":
				if (this.state.dragging) {
					this.setState({ dragging: false });
					this.onChange();
				}

				break;

		}
	}

	private cavasDrag = (e: React.MouseEvent<HTMLCanvasElement>, coords: GateCoords): void => {

		// Drawing wires

		switch (e.type) {
			case "mousedown":
				const node = Wiring.wireSnap(this.startNodes, coords, this.state.snapFactor);
				if (node !== null) {
					const snapCoords = node.getCoords();
					this.setState({
						dragInit: snapCoords,
						drag: snapCoords,
						dragging: true
					});
					this.nodeSelectStart = { node, selected: true }
				} else {
					this.nodeSelectStart = { node: null, selected: false };
				}

				break;
			case "mousemove":
				if (this.state.dragging) {
					const node = Wiring.wireSnap(this.endNodes, coords, this.state.snapFactor);

					if (node !== null) {
						coords = node.getCoords();
						this.nodeSelectEnd = { node, selected: true };
						console.log(this.nodeSelectEnd.node);
					} else {
						this.nodeSelectEnd = { node: null, selected: false };
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
				// save wire
				if (this.nodeSelectEnd.selected && this.nodeSelectEnd.node !== null && this.nodeSelectStart.node !== null 
					&& this.state.dragging) {
					this.setState({ dragging: false });
					const wire = new Wire({
						startNode: this.nodeSelectStart.node, endNode: this.nodeSelectEnd.node
					});

					this.gates.wire.push(wire);
					this.nodeSelectEnd.node.setWire(wire, "end");
					this.nodeSelectStart.node.setWire(wire, "start");
					this.onChange();
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
				<canvas ref={(canvas) => { if (canvas !== null) this.canvas = canvas }} onClick={this.canvasEvent}
					className={styles.canvas} width={this.state.width} height={this.state.height}
					onMouseUp={this.canvasEvent} onMouseDown={this.canvasEvent} onMouseMove={this.canvasEvent}
					onMouseLeave={this.canvasEvent} />
			</div>
		)
	}
}