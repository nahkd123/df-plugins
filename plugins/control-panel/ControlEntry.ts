import { PluginUI } from "../../global/PluginUI";
import { Pretty } from "../../global/Pretty";
import Plugin from "../control-panel";

export abstract class ControlEntry {

    parent: HTMLDivElement;
    header: HTMLDivElement;
    headerBtn: HTMLButtonElement;
    headerTitle: HTMLDivElement;
    body: HTMLDivElement;
    actionsBar: HTMLDivElement;

    _linkedPlugin: Plugin;

    constructor() {
        this.parent = document.createElement("div");
        this.parent.append(
            this.header = <HTMLDivElement> PluginUI.quickNewElement("div", undefined, "header")
        );

        this.header.append(
            this.headerBtn = PluginUI.button("-", () => { this._destroy(); }),
            this.headerTitle = <HTMLDivElement> PluginUI.quickNewElement("span", Pretty.friendlyClassName(this.constructor))
        )
    }

    _destroy() {
        this.destroy();
        this.parent.remove();
        this._linkedPlugin.currentControls.splice(this._linkedPlugin.currentControls.indexOf(this), 1);
    }

    abstract destroy(): any;

    initActionsBar() {
        this.actionsBar = <HTMLDivElement> PluginUI.quickNewElement("div", undefined, "actions");
        this.parent.append(this.actionsBar);
        return this.actionsBar;
    }

    initBody() {
        this.body = <HTMLDivElement> PluginUI.quickNewElement("div", undefined, "body");
        this.parent.append(this.body);
        return this.body;
    }

    jsonObject(): any { return {}; }
    loadJson(obj: any) {}

}
