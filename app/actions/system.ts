import { ipcRenderer } from 'electron';
export function Exit() {
    ipcRenderer.send("exit");
}