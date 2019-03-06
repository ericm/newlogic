import Workspace from '../components/Workspace';
import { Gates } from '../gates/all';
import * as IComponent from '../interfaces/components';
import * as settings from 'electron-settings';
export namespace Saving {
    function genGates<T extends Gates<any>>(gates: T[]): IComponent.GateStatePlecibo[] {
        let ret: IComponent.GateStatePlecibo[] = [];
        for (let g of gates) {
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
        
    }
}