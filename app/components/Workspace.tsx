import * as React from 'react';
import { Wiring } from '../actions/canvas';
import { Logic } from '../actions/logic';
import { Saving } from '../actions/saving';
// import items (gates etc)
import * as LogicGates from '../gates/all';
import * as ICanvas from '../interfaces/canvas';
import * as IComponent from '../interfaces/components';
import { Exit } from '../actions/system';
import { getSettings } from '../actions/settings';


let styles = require('./styles/Workspace.scss');


/**
 * This is the main component for logic. Contains the canvas and encapsulates all of its functions
 *
 * @export
 * @class Workspace
 * @extends {React.Component<IComponent.WorkspaceProps, IComponent.WorkspaceState>}
 */
export default class Workspace extends React.Component<IComponent.WorkspaceProps, IComponent.WorkspaceState> {

    // private states for non-react components

    private canvas: HTMLCanvasElement

    public ctx: CanvasRenderingContext2D
    public gates: IComponent.AllGates
    public endNodes: LogicGates.GateNode<ICanvas.AnyGate>[] = []
    public startNodes: LogicGates.GateNode<ICanvas.AnyGate>[] = []

    private nodeSelectEnd: ICanvas.SelectedNode<any>
    private nodeSelectStart: ICanvas.SelectedNode<any>

    private clicked: ICanvas.AnyGate[] = [];
    private clickedDrag: ICanvas.AnyGate[] = [];

    private stateHistory: IComponent.StateHistory[] = []

    public constructor(props: IComponent.WorkspaceProps) {
        super(props);
        this.gates = { and: [], wire: [], or: [], not: [], switch: [], led: [] }

        this.state = {
            width: (this.props.width * window.innerWidth / 100).toString(),
            height: (this.props.height * window.innerHeight / 100).toString(),
            mode: "draw",
            dragging: false,
            dragInit: { x: 0, y: 0 },
            drag: { x: 0, y: 0 },
            gridFactor: 20,
            snapFactor: 20,
            canvasDrag: false,
            context: null,
            gridType: 0,
            unsavedChanges: false,
            snapGrid: true,
            undoIndex: -1
        }

        this.nodeSelectEnd = { node: null, selected: false }
        this.nodeSelectStart = { node: null, selected: false }

        this.canvasEvent = this.canvasEvent.bind(this);
    }

    /**
     * Saves using an ipc call based on the saveAs parameter
     *
     * @memberof Workspace
     */
    public save = (saveAs: boolean, callback = () => {}): void => {
        if (!!this.props.addStatus) {
            if (saveAs) {
                Saving.saveState(this, this.props.addStatus, undefined, callback);
                this.setState({ unsavedChanges: false });
            } else {
                if (!!this.state.path) {
                    Saving.saveState(this, this.props.addStatus, this.state.path, callback);
                } else {
                    Saving.saveState(this, this.props.addStatus, undefined, callback);
                }
            }
        }
        
    }

    public checkSave = (): void => {
        if (this.state.unsavedChanges) {
            if (confirm("Save unsaved changes?")) {
                this.save(false, Exit);
            } else {
                Exit();
            }
        } else {
            Exit();
        }
    }

    /**
     * This deletes a gate and all refs to it
     *
     * @memberof Workspace
     */
    public deleteGate = (id: number): void => {
        // Find gate for history
        let gate = this.allGates().find(val => { return val.state.id === id });
        if (gate) {
            this.pushState({
                method: 'delete',
                gate: this.genPlecibo(gate)
            })
        }
        // Remove context menu
        // Delete Wires referencing gate
        let is: number[] = [];
        for (let i in this.gates.wire) {
            let wire = this.gates.wire[i].state;
            if (wire.startNode.state.gate.state.id === id || wire.endNode.state.gate.state.id === id) {
                is.push(+i);
            }
        }
        // this.gates.wire = this.gates.wire.filter((_, i)  => { console.log(i, is); return i !in is; });
        this.gates.wire = this.gates.wire.filter((_val, i: number, _arr) => { return is.findIndex(ii => { return i === ii; }) === -1; });

        // Delete nodes referencing the gate
        is = [];
        for (let index in this.startNodes) {
            if (this.startNodes[index].state.gate.state.id === id) {
                is.push(+index);
            }
        }
        this.startNodes.splice(is[0], is.length);
        is = [];
        for (let index in this.endNodes) {
            if (this.endNodes[index].state.gate.state.id === id) {
                is.push(+index);
            }
        }
        this.endNodes.splice(is[0], is.length);

        // Find refs
        for (let g of this.allGates()) {
            g.state.gateIn = g.state.gateIn.filter(v => { return v.state.id !== id; });
            g.state.gateOut = g.state.gateOut.filter(v => { return v.state.id !== id; });
        }

        // Lambda to delete gate
        const find = (check: (val: ICanvas.AnyGate) => boolean): void => {
            let i = this.gates.and.findIndex(check);
            if (i !== -1) this.gates.and.splice(i, 1);
            if (i === -1) {
                i = this.gates.or.findIndex(check);
                if (i !== -1) this.gates.or.splice(i, 1);
            }
            if (i === -1) {
                i = this.gates.not.findIndex(check);
                if (i !== -1) this.gates.not.splice(i, 1);
            }
            if (i === -1) {
                i = this.gates.led.findIndex(check);
                if (i !== -1) this.gates.led.splice(i, 1);
            }
            if (i === -1) {
                i = this.gates.switch.findIndex(check);
                if (i !== -1) this.gates.switch.splice(i, 1);
            }
        }
        find(val => { return val.state.id === id; });
        // Remove ID
        LogicGates.Gates.REMID(id);
        console.log(this.endNodes, this.startNodes, this.gates);
        Logic.evalAll(this.gates);
        this.clear();
    }

    private genPlecibo = (gate: ICanvas.AnyGate, coords?: ICanvas.GateCoords): IComponent.GateStatePlecibo => {
        const state = gate.state;
        const coordsObj = !!coords ? coords : state.coords;
        return {
            coords: Object.assign({}, coordsObj),
            size: Object.assign({}, state.size),
            id: state.id,
            inputs: state.gateIn.map(val => val.state.id),
            outputs: state.gateOut.map(val => val.state.id),
            type: (typeof gate).toString(),
            invert: state.invert
        }
    }

    /**
     * Returns an array of all the gates held in this.gates.
     * Update this with new gates as added.
     * @private
     * @memberof Workspace
     */
    private allGates = (): ICanvas.AnyGate[] => {
        return [...this.gates.and, ...this.gates.or, ...this.gates.not, ...this.gates.led, ...this.gates.switch];
    }

    public load = (): void => Saving.loadState(this);

    public changeMode = (mode: string): void => this.setState({ mode });

    public onChange = (): void => Logic.evalAll(this.gates);

    public async componentDidMount() {
        this.setCtx();
        this.setState({
            width: (this.props.width * window.innerWidth / 100).toString(),
            height: (this.props.height * window.innerHeight / 100).toString()
        });

        // Preload gates
        await LogicGates.AndGate.LOAD(this.ctx);
        await LogicGates.OrGate.LOAD(this.ctx);
        await LogicGates.NotGate.LOAD(this.ctx);
        await LogicGates.Switch.LOAD(this.ctx);
        await LogicGates.LED.LOAD(this.ctx);

        // Create graph
        this.onChange();

        // Draw grid
        this.updateCanvas();
        console.log(this.gates);
        this.setState({ unsavedChanges: false });

        console.log(this.stateHistory);

        // Get settings through IPC
        let settings = getSettings();
        this.setState({
	        gridFactor: settings.gridFactor,
	        snapGrid: settings.snapGrid,
	        snapFactor: settings.snapFactor,
	        gridType: settings.gridType
        });

    }

    private pushState = (action: IComponent.StateHistory) => {
        if (this.state.undoIndex < this.stateHistory.length - 2 && this.state.undoIndex !== -1) {
            this.stateHistory = this.stateHistory.slice(0, this.state.undoIndex);  
        }        
        this.stateHistory.push(action);
        this.setState({undoIndex: this.stateHistory.length});
        console.log(this.stateHistory.length - 1, this.state.undoIndex, this.stateHistory);
    }
        
    
    public undo = (): number => {
        let index = this.state.undoIndex - 1;
        console.log(index);
        if (index >= 0) {
            let state = this.stateHistory[index];
            
            if (!!state) {
                this.clear();
                switch (state.method) {
                case "create":
                    // Delete the gate in current state
                    this.deleteGate(state.gate.id);
                    break;
                case "delete":
                    // Create the gate again
                    break;
                case "join":
                    // Disconnect and delete wire
                    break;
                case "unjoin":
                    // Connect and create wire
                    break;
                case "move":
                    // Move to previous position
                    let gate = this.allGates().find(val => { return val.state.id === state.gate.id });
                    if (!!gate) {
                        gate.drag(state.gate.coords);
                    }
                    break;
                }
                this.clear();
                console.log(index, this.gates);
                this.setState({undoIndex: index});
            }
        }
        return index;
    }

    public componentDidUpdate() {
        this.updateCanvas();
    }

    private drawGrid = (): void => {
        if (!!this.ctx) {
            switch (this.state.gridType) {
                case 1:
                    this.ctx.fillStyle = "rgba(0,0,0,1)";
                    for (let x = 0; x < this.canvas.width; x++) {
                        if (x % this.state.gridFactor == 0) {
                            for (let y = 0; y < this.canvas.height; y++) {
                                if (y % this.state.gridFactor == 0) {
                                    this.ctx.fillRect(x, y, 1, 1);
                                }
                            }
                        }
                    }
                    break;
                case 0:
                    this.ctx.strokeStyle = "rgba(230,230,230,1)";
                    this.ctx.lineWidth = 1;
                    for (let x = 0; x < (this.canvas.width > this.canvas.height ? this.canvas.width : this.canvas.height); x++) {
                        if (x % this.state.gridFactor == 0) {
                            this.ctx.beginPath();
                            this.ctx.moveTo(x, 0);
                            this.ctx.lineTo(x, parseInt(this.state.height.split('.')[0]));
                            this.ctx.stroke();

                            this.ctx.beginPath();
                            this.ctx.moveTo(0, x);
                            this.ctx.lineTo(parseInt(this.state.width.split('.')[0]), x);
                            this.ctx.stroke();
                        }
                    }
                    break;
            }

        }
    }

    /**
     * Run on startup to get ctx from the canvas
     *
     * @private
     * @memberof Workspace
     */
    private setCtx = (): void => {
        const cont = this.canvas.getContext('2d');
        if (cont !== null) {
            this.ctx = cont;
        }
    }

    /**
     * Run manually everytime theres a rerender needed.
     *
     * @private
     * @memberof Workspace
     */
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

        if (this.state.context !== null) Wiring.renderContext(this.ctx, this.state.context);
    }

    /**
     * Get coordinates of event in relation to canvas
     *
     * @private
     * @param {*} e
     * @returns {ICanvas.GateCoords}
     * @memberof Workspace
     */
    private getCoords(e: any): ICanvas.GateCoords {
        const box = e.currentTarget.getBoundingClientRect();
        return { x: e.clientX - box.left, y: e.clientY - box.top };
    }

    /**
     * The entrypoint for all canvas events
     *
     * @private
     * @param {React.MouseEvent<HTMLCanvasElement>} e
     * @returns {Promise<void>}
     * @memberof Workspace
     */
    private async canvasEvent(e: React.MouseEvent<HTMLCanvasElement>): Promise<void> {
        let coords = this.getCoords(e);
        let coordsReal = coords;
        
         if (this.state.snapGrid) coords = Wiring.gridLayout(coords, this.state.gridFactor);

        // Context menu checks
        if (e.type === "contextmenu") {
            let check = this.isClicked(coords);
            console.log(check);
            if (check !== null && (this.state.context === null || check.state.id !== this.state.context.gate.state.id)) {
                await this.setState({ context: null });
                await this.clear();
                let context = await check.context(coords);
                await this.setState({ context });
                return;
            }
            return;
        } else if (e.type === "click" && this.state.context !== null ? !Wiring.contextClicked(coords, this.state.context) : false) {
            await this.setState({ context: null });
            this.clear();
            return;
        } else if (this.state.context !== null && Wiring.contextClicked(coords, this.state.context)) {
            switch (e.type) {
                case "mousemove":
                    this.clear();
                    Wiring.contextHover(coords.y, this.state.context, this.ctx);
                    return;
                case "click":
                    await Wiring.contextActions(this, this.state.context.gate, Wiring.contextHover(coords.y, this.state.context, this.ctx));
                    await this.setState({ context: null });
                    this.clear();
                    return;
            }

        }

        let change = false;
        switch (this.state.mode) {
        case "click":
            change = this.canvasClick(e, coords);
            break;

        case "draw":
            this.cavasDrag(e, coords);
            break;

        case "cut":
            this.canvasCut(e, coordsReal);
            break;

        // Gate cases
        case "and":
            if (e.type == "click" && !Wiring.otherGates(coords, this.allGates())) {
                this.gates.and.push(new LogicGates.AndGate(this.ctx));
                const size: ICanvas.GateSize = { width: 2 * this.state.gridFactor + 1, height: 2 * this.state.gridFactor + 1 }
                const newNodes = this.gates.and[this.gates.and.length - 1].add(coords, size);

                this.addNodes(newNodes);
                this.onChange();
                change = true;
                this.pushState({
                    method: 'create',
                    gate: this.genPlecibo(this.gates.and[this.gates.and.length - 1])
                });
            }
            break;


        case "or":
            if (e.type == "click" && !Wiring.otherGates(coords, this.allGates())) {
                this.gates.or.push(new LogicGates.OrGate(this.ctx));
                const size: ICanvas.GateSize = { width: 2 * this.state.gridFactor + 1, height: 2 * this.state.gridFactor + 1 }
                const newNodes = this.gates.or[this.gates.or.length - 1].add(coords, size);

                this.addNodes(newNodes);
                this.onChange();
                change = true;
                this.pushState({
                    method: 'create',
                    gate: this.genPlecibo(this.gates.or[this.gates.or.length - 1])
                });
            }
            break;

        case "not":
            if (e.type == "click" && !Wiring.otherGates(coords, this.allGates())) {
                this.gates.not.push(new LogicGates.NotGate(this.ctx));
                const size: ICanvas.GateSize = { width: 2 * this.state.gridFactor + 1, height: 2 * this.state.gridFactor + 1 }
                const newNodes = this.gates.not[this.gates.not.length - 1].add(coords, size);

                this.addNodes(newNodes);
                this.onChange();
                change = true;
                this.pushState({
                    method: 'create',
                    gate: this.genPlecibo(this.gates.not[this.gates.not.length - 1])
                });
            }
            break;

        case "led":
            if (e.type == "click" && !Wiring.otherGates(coords, this.allGates())) {
                this.gates.led.push(new LogicGates.LED(this.ctx));
                const size: ICanvas.GateSize = { width: 2 * this.state.gridFactor + 1, height: 2 * this.state.gridFactor + 1 }
                const newNodes = this.gates.led[this.gates.led.length - 1].add(coords, size);

                this.addNodes(newNodes);
                this.onChange();
                change = true;
                this.pushState({
                    method: 'create',
                    gate: this.genPlecibo(this.gates.led[this.gates.led.length - 1])
                });
            }
            break;

        case "switch":
            if (e.type == "click" && !Wiring.otherGates(coords, this.allGates())) {
                this.gates.switch.push(new LogicGates.Switch(this.ctx));
                const size: ICanvas.GateSize = { width: 2 * this.state.gridFactor + 1, height: 2 * this.state.gridFactor + 1 }
                const newNodes = this.gates.switch[this.gates.switch.length - 1].add(coords, size);

                this.addNodes(newNodes);
                this.onChange();
                change = true;
                this.pushState({
                    method: 'create',
                    gate: this.genPlecibo(this.gates.switch[this.gates.switch.length - 1])
                });
            }
            break;
        }

        if (change && !this.state.unsavedChanges) {
            this.setState({unsavedChanges: true});   
        }
        
    }

    /**
     * This adds the nodes from a new gate to our node states
     *
     * @private
     * @template T
     * @param {ICanvas.Nodes<T>} newNodes
     * @memberof Workspace
     */
    private addNodes<T extends LogicGates.Gates<any>>(newNodes: ICanvas.Nodes<T>): void {
        this.endNodes.push(...newNodes.end);
        this.startNodes.push(...newNodes.start);

        Wiring.renderNodes(newNodes.end, this.ctx);
        Wiring.renderNodes(newNodes.start, this.ctx);
    }

    /**
     * Updates canvas after change
     *
     * @private
     * @memberof Workspace
     */
    public clear = (): void => {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.updateCanvas();
    }

    /**
     * Checks if a gate is clicked 
     *
     * @private
     * @memberof Workspace
     */
    private isClicked = (coords: ICanvas.GateCoords): ICanvas.AnyGate | null => {
        return Wiring.isClicked(this.gates.and, coords)
            || Wiring.isClicked(this.gates.or, coords)
            || Wiring.isClicked(this.gates.not, coords)
            || Wiring.isClicked(this.gates.switch, coords)
            || Wiring.isClicked(this.gates.led, coords);
    }

    /**
     * Ran when the mode is set to click.
     * For dragging and gate modifying
     *
     * @private
     * @memberof Workspace
     */
    private canvasClick = (e: React.MouseEvent<HTMLCanvasElement>, coords: ICanvas.GateCoords): boolean => {

        // Find if a gate was clicked
        let gate = this.isClicked(coords);

        switch (e.type) {
            case "click":
                if (gate === null) {
                    this.clicked = [];
                    this.clear();
                } else {
                    this.clicked = []
                    this.clear();
                    this.clicked.push(gate);
                }

                if (gate !== null) { gate.click(); gate.clickSpecific(); }
                this.onChange();
                break;

            case "mousedown":
                if (gate !== null) {
                    if (gate == this.clicked[0]) {
                        this.setState({
                            dragging: true,
                            dragInit: coords,
                            drag: gate.state.coords
                        });
                        this.clickedDrag = [];
                        this.clickedDrag.push(gate);
                        this.clear();
                    }
                } else {
                    this.setState({ canvasDrag: true });
                }
                break;

            case "mousemove":
                if (this.state.dragging) {
                    const move: ICanvas.GateCoords = {
                        x: coords.x - (this.state.dragInit.x - this.state.drag.x),
                        y: coords.y - (this.state.dragInit.y - this.state.drag.y)
                    }
                    if (move.x > 0 && move.y > 0) {
                        for (let g of this.clickedDrag) {
                            window.requestAnimationFrame(() => g.drag(move));
                        }
                        this.clear();
                    }
                } else if (this.state.canvasDrag) {
                    console.log("dragging");
                    const move: ICanvas.GateCoords = {
                        x: coords.x - (this.state.dragInit.x - this.state.drag.x),
                        y: coords.y - (this.state.dragInit.y - this.state.drag.y)
                    }
                    Wiring.selection(this.ctx, move, { x: this.state.dragInit.x - this.state.drag.x, y: this.state.dragInit.x - this.state.drag.x });
                }
                break;

            case "mouseup":
                if (this.state.dragging) {
                    if (Wiring.otherGates(this.clickedDrag[0].state.coords, this.allGates().filter(g => { return g.state.id !== this.clickedDrag[0].state.id; }))) {
                        const move: ICanvas.GateCoords = {
                            x: this.state.dragInit.x,
                            y: this.state.dragInit.y
                        }
                        if (move.x > 0 && move.y > 0) for (let g of this.clickedDrag) g.drag(move);
                    }
                    // TODO: add multi move support for history
                    this.pushState({
                        method: 'move',
                        gate: this.genPlecibo(this.clickedDrag[0], this.state.drag)
                    });
                    this.clear();
                    this.setState({ dragging: false });
                    return true;
                } else if (this.state.canvasDrag) {
                    this.setState({ canvasDrag: false });
                }

                break;
            case "mouseleave":
                this.setState({ dragging: false });
                this.clear();
                break;

        }
        return false;
    }

    /**
     * Run when click event triggered and mode set to draw
     * For drawing wires 
     *
     * @private
     * @param {React.MouseEvent<HTMLCanvasElement>} e
     * @param {ICanvas.GateCoords} coords
     * @memberof Workspace
     */
    private async cavasDrag(e: React.MouseEvent<HTMLCanvasElement>, coords: ICanvas.GateCoords) {

        // Drawing wires

        switch (e.type) {
            case "mousedown":
                let node = Wiring.wireSnap(this.startNodes, coords, this.state.snapFactor);
                if (node === null) node = Wiring.wireSnap(this.endNodes, coords, this.state.snapFactor);

                if (node !== null) {
                    const snapCoords = node.getCoords();
                    this.setState({
                        dragInit: snapCoords,
                        drag: snapCoords,
                        dragging: true,
                        canvasDrag: false
                    });
                    this.nodeSelectStart = { node, selected: true }
                } else {
                    this.nodeSelectStart = { node: null, selected: false };
                }

                break;
            case "mousemove":
                if (this.state.dragging) {
                    let node: LogicGates.GateNode<any> | null = null;

                    if (this.nodeSelectStart.node !== null && this.nodeSelectStart.node.type() === "start") {
                        node = Wiring.wireSnap(this.endNodes, coords, this.state.snapFactor);
                    } else {
                        node = Wiring.wireSnap(this.startNodes, coords, this.state.snapFactor);
                    }


                    if (node !== null) {
                        coords = node.getCoords();
                        this.nodeSelectEnd = { node, selected: true };
                    } else {
                        this.nodeSelectEnd = { node: null, selected: false };
                    }
                    this.setState({
                        drag: coords,
                        canvasDrag: true
                    });
                    await this.clear();
                    window.requestAnimationFrame(() => Wiring.drawWire(this.ctx, this.state.dragInit, this.state.drag));
                }

                break;
            case "mouseup":
                // save wire
                if (this.nodeSelectEnd.selected && this.nodeSelectEnd.node !== null && this.nodeSelectStart.node !== null
                    && this.state.dragging && this.state.canvasDrag) {

                    let startNode = this.nodeSelectStart.node;
                    let endNode = this.nodeSelectEnd.node;
                    if (this.nodeSelectStart.node.type() === "end") {
                        startNode = this.nodeSelectEnd.node;
                        endNode = this.nodeSelectStart.node;
                    }

                    const wire = new LogicGates.Wire({
                        startNode, endNode
                    });
                    if (endNode.setWire(wire, "end") && startNode.setWire(wire, "start")) {
                        this.gates.wire.push(wire);
                        console.log(this.gates.wire);

                        this.onChange();
                        Logic.evalAll(this.gates);

                        // Appending to state history 
                        this.pushState({
                            method: 'join',
                            gate: this.genPlecibo(startNode.state.gate),
                            secondGate: this.genPlecibo(endNode.state.gate)
                        })
                    }
                    
                } else {
                    this.clear();
                }
                this.setState({ dragging: false });
                break;
            case "mouseleave":
                this.setState({ dragging: false });
                this.clear();
                break;
        }

    }

    /**
     * Used to cut wires between gates
     *
     * @private
     * @param {React.MouseEvent<HTMLCanvasElement>} e
     * @param {ICanvas.GateCoords} coords
     * @memberof Workspace
     */
    private async canvasCut(e: React.MouseEvent<HTMLCanvasElement>, coords: ICanvas.GateCoords) {
        switch (e.type) {
            case "mousedown":
                this.setState({dragInit: coords, dragging: true});
                break;
            case "mousemove":
                if (this.state.dragging) {
                    let cut = Wiring.cutIntersect(coords, this.gates.wire);
                    if (cut !== -1) {
                        let wire = this.gates.wire[cut];
                        // GIANT REREF BLOCK
                        // DONT TRY THIS AT HOME
                        let checkWire = (v: LogicGates.Wire): boolean => { return v.state.break.x !== wire.state.break.x || v.state.break.y !== wire.state.break.y; }
                        wire.state.startNode.state.wire = wire.state.startNode.state.wire.filter(checkWire);
                        wire.state.endNode.state.wire = wire.state.endNode.state.wire.filter(checkWire);
                        let gateIn = wire.state.startNode.state.gate;
                        let gateOut = wire.state.endNode.state.gate;
                        gateIn.state.gateOut = gateIn.state.gateOut.filter(v => { return v.state.id !== gateOut.state.id; });
                        gateOut.state.gateIn = gateOut.state.gateIn.filter(v => { return v.state.id !== gateIn.state.id; });
                        this.gates.wire = this.gates.wire.filter((_, i) => { return i !== cut; });

                        // Send to history
                        this.pushState({
                            method: 'unjoin',
                            gate: this.genPlecibo(gateIn),
                            secondGate: this.genPlecibo(gateOut)
                        })
                    }
                    window.requestAnimationFrame(() => {
                        this.clear();
                        Wiring.cutDraw(this.ctx, this.state.dragInit, coords);
                    });
                } else {
                    this.clear();
                }
                break;
            case "mouseup":
                this.setState({dragging: false});
                this.clear();
                break;
        }
    }

    /**
     * Opens property window
     * Set in a separate constructor.
     *
     * @memberof Workspace
     */
    public propertyWindow = (gate: ICanvas.AnyGate): void => { }

    /**
     * Run when the component is being resized
     *
     * @memberof Workspace
     */
    public resize = (n: IComponent.Component): void =>
        this.setState({
            width: (n.width * window.innerWidth / 100).toString(),
            height: (n.height * window.innerHeight / 100).toString()
        });

    public render(): JSX.Element {
        return (
            <div className={styles.main} onContextMenu={(e: React.MouseEvent<HTMLDivElement>) => { e.preventDefault(); }}>
                <canvas ref={(canvas) => { if (canvas !== null) this.canvas = canvas }} onClick={this.canvasEvent}
                    className={styles.canvas} width={this.state.width} height={this.state.height}
                    onMouseUp={this.canvasEvent} onMouseDown={this.canvasEvent} onMouseMove={this.canvasEvent}
                    onMouseLeave={this.canvasEvent} onContextMenu={this.canvasEvent} />
            </div>
        )
    }
}