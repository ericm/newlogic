import { SettingsState } from "../interfaces/components";
import * as Esettings from "electron-settings";

export function getSettings(): SettingsState {
    return Esettings.get("settings") as any as SettingsState;
}