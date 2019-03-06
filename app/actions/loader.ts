import Workspace from '../components/Workspace';
import * as IComponent from '../interfaces/components';
import * as LogicGates from '../gates/all';
export namespace Loader {
    
    export function workspace(save: IComponent.WorkspaceSaveState, workspace: Workspace): void {
        // Gates
        for (let g of save.gates.led) {
            let c = new LogicGates.LED(workspace.getCtx());
            if (!!g.state) {
                c.add(g.state.coords, g.state.size);
            }
            workspace.gates.led.push(c)
        }
    }
}