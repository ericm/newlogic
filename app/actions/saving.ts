import * as settings from 'electron-settings';
import Workspace from '../components/Workspace';
import { GateNode, Gates, Wire, AndGate, LED, NotGate, Switch, OrGate } from '../gates/all';
import { AnyGate } from '../interfaces/canvas';
import * as IComponent from '../interfaces/components';
export namespace Saving {
	function addWires(output: AnyGate[], wires: Wire[], gates: IComponent.GateStatePlecibo[]): void {
		// Connect gates
		for (let plecibo of gates) {
			plecibo.inputs.forEach(val => {
				for (let checks of output) {
					if(plecibo.id !== checks.state.id && val === checks.state.id) {
						let out = output.find(valOut => { return valOut.state.id === plecibo.id });
						if (!!out) out.connect("in", checks);
					}
				}
			});
			plecibo.outputs.forEach(val => {
				for (let checks of output) {
					if(plecibo.id !== checks.state.id && val === checks.state.id) {
						let out = output.find(valOut => { return valOut.state.id === plecibo.id });
						if (!!out) out.connect("out", checks);
					}
				}
			});
		}

		// Create wire objects
		for (let gate of output) {
			gate.state.gateIn.forEach(g => {
				for (let i in g.state.nodes.start) {
					let n = g.state.nodes.start[i];
					let endNode = gate.state.nodes.end[i];
					let wire = new Wire({startNode: n, endNode});
					endNode.state.wire.push(wire);
					n.state.wire.push(wire);
					wires.push(wire);
				}
			});
		}
	}
	function deserialize<T extends Gates<T>>(gates: IComponent.GateStatePlecibo[], 
		endNodes: GateNode<any>[], startNodes: GateNode<any>[], ctx: CanvasRenderingContext2D, type: string): T[] {
			const construct = (): AnyGate => {
				switch (type) {
					case "and":
						return new AndGate(ctx);
					case "or":
						return new OrGate(ctx);
					case "not":
						return new NotGate(ctx);
					case "switch":
						return new Switch(ctx);
					case "led":
						return new LED(ctx);
					default:
						return new AndGate(ctx);
				}
			} 
			let output: T[] = [];
			// Get gates and nodes
			for (let gate of gates) {
				let constructed: T = {} as T;
				constructed = construct() as T;
				constructed.ctx = ctx;
				let nodes = constructed.add(gate.coords, gate.size, gate.id);
				output.push(constructed);
				endNodes.push(...nodes.end);
				startNodes.push(...nodes.start);
			}
			return output;
	}
	function genGates<T extends Gates<T>>(gates: T[]): IComponent.GateStatePlecibo[] {
		let ret: IComponent.GateStatePlecibo[] = [];
		for (let g of gates) {
			if (!!g.state) {
				ret.push({
					coords: g.state.coords, 
					size: g.state.size, 
					id: g.state.id,
					inputs: ((): number[] => {
						let retg = [];
						for (let gg of g.state.gateIn) retg.push(gg.state.id)
						return retg;
					})(),
					outputs: ((): number[] => {
						let retg = [];
						for (let gg of g.state.gateOut) retg.push(gg.state.id)
						return retg;
					})(),
					type: (typeof g).toString()
				});
			}
		}
		return ret;
	}
	export function saveState(workspace: Workspace, name: string): void {
		const save: IComponent.WorkspaceSaveState = {
			gates: {
				and: genGates(workspace.gates.and),
				or: genGates(workspace.gates.or),
				not: genGates(workspace.gates.not),
				led: genGates(workspace.gates.led),
				switch: genGates(workspace.gates.switch)
			},
			gridFactor: workspace.state.gridFactor,
			snapFactor: workspace.state.snapFactor,
		}
		settings.set(`saves.${name}`, save as any);
	}
	export function loadState(workspace: Workspace, name?: string): void {
		let saveName = !!name ? name : "default";
		let save = settings.get(`saves.${saveName}`) as any as IComponent.WorkspaceSaveState;
		if (typeof save === "undefined") save = settings.get(`saves.default`) as any as IComponent.WorkspaceSaveState;

		let wires: Wire[] = [];
		let startNodes: GateNode<any>[] = [];
		let endNodes: GateNode<any>[] = [];

		workspace.gates.and = deserialize(save.gates.and, endNodes, startNodes, workspace.ctx, "and");
		workspace.gates.or = deserialize(save.gates.or, endNodes, startNodes, workspace.ctx, "or");
		workspace.gates.not = deserialize(save.gates.not, endNodes, startNodes, workspace.ctx, "not");
		workspace.gates.switch = deserialize(save.gates.switch, endNodes, startNodes, workspace.ctx, "switch");
		workspace.gates.led = deserialize(save.gates.led, endNodes, startNodes, workspace.ctx, "led");
		console.log(workspace.gates.and);
		let all: AnyGate[] = [
			...workspace.gates.and,
			...workspace.gates.or,
			...workspace.gates.not,
			...workspace.gates.switch,
			...workspace.gates.led
		];
		// Push all gate ids
		Gates.IDS = [];
		for (let gate of all) {
			Gates.IDS.push(gate.state.id);
		}
		let allPlecibo: IComponent.GateStatePlecibo[] = [
			...save.gates.and,
			...save.gates.or,
			...save.gates.not,
			...save.gates.switch,
			...save.gates.led
		]
		addWires(all, wires, allPlecibo);
		workspace.gates.wire = wires;
		
		workspace.startNodes = startNodes;
		workspace.endNodes = endNodes;

		workspace.setState({
			gridFactor: save.gridFactor,
			snapFactor: save.snapFactor,
		});
	}
}