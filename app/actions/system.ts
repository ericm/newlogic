import { ipcRenderer } from 'electron';

export function Exit() {
    ipcRenderer.send("exit");
}

export function Reload() {
    window.location.reload();
}