import { PluginUI } from "../../global/PluginUI";
import { ControlEntry } from "./ControlEntry";

export class FavoriteArea extends ControlEntry {

    storedCenter: WorldCoords;

    constructor() {
        super();
        let vp = ui.getViewport();
        this.storedCenter = {
            x: Math.floor(vp.centerWorldCoords.x),
            y: Math.floor(vp.centerWorldCoords.y)
        };
        this.headerTitle.textContent = `Area: (${this.storedCenter.x}, ${this.storedCenter.y})`;

        let actionsBar = this.initActionsBar();
        actionsBar.append(
            PluginUI.button("Teleport", () => vp.centerCoords(this.storedCenter))
        );
    }

    destroy() {
    }

    jsonObject() { return this.storedCenter; }
    loadJson(obj: any): void { this.storedCenter = obj; }

}
