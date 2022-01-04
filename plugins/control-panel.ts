import { PluginUI } from "../global/PluginUI.js";
import { PluginUtils } from "../global/PluginUtils.js";
import { Pretty } from "../global/Pretty.js";
import { ControlEntry } from "./control-panel/ControlEntry.js";
import { FavoriteArea } from "./control-panel/FavoriteArea.js";
import { Observer } from "./control-panel/Observer.js";

const CSS = `
:host > div.header {
    overflow-x: scroll;
    white-space: nowrap;
    border: 1px solid rgb(35, 35, 35);
    padding: 8px;
    border-radius: 4px;
    padding-bottom: 4px;
}

div.header > button {
    margin-right: 8px;
}

div.listing {
    margin-top: 8px;
    padding: 8px;
    padding-right: 2px;
    padding-left: 12px;
    border-radius: 4px;
    border: 1px solid rgb(35, 35, 35);
    min-height: 150px;
    max-height: 350px;
    overflow-y: scroll;
}

div.listing > div {
    margin-bottom: 8px;
    padding: 8px;
    border-radius: 4px;
    border: 1px solid rgb(55, 55, 55);
    background-color: #1f1f1f;
}
div.listing > div > div.body,
div.listing > div > div.actions {
    margin-top: 8px;
}
div.listing > div > div.actions {
    overflow-x: auto;
    white-space: nowrap;
}
div.listing > div > div.actions > button {
    margin-right: 8px;
}

div.header::-webkit-scrollbar,
div.listing::-webkit-scrollbar,
div.listing > div > div.actions::-webkit-scrollbar {
    width: 12px; height: 12px;
}
div.header::-webkit-scrollbar-thumb,
div.listing::-webkit-scrollbar-thumb,
div.listing > div > div.actions::-webkit-scrollbar-thumb {
    background: rgb(75, 75, 75);
    border-radius: 1e8px;
    border: 4px solid rgb(21, 21, 21);
}
div.listing > div > div.actions::-webkit-scrollbar-thumb {
    border: 4px solid #1f1f1f;
}
div.header::-webkit-scrollbar-thumb:hover,
div.listing::-webkit-scrollbar-thumb:hover,
div.listing > div > div.actions::-webkit-scrollbar-thumb:hover {
    background: rgb(100, 100, 100);
}
`;

class Plugin {

    container: PluginUI.PluginContainer;
    header: HTMLDivElement;
    controlsListing: HTMLDivElement;

    controlEntries: { new(...args: any[]): ControlEntry }[] = [];
    currentControls: ControlEntry[] = [];

    constructor() {
        this.controlEntries.push(
            FavoriteArea,
            Observer
        );
    }
    
    async render(c: HTMLDivElement) {
        let container = this.container = PluginUI.applyContainer(c);
        container.addStylesheet(CSS);

        container.shadowRoot.append(
            this.header = <HTMLDivElement> PluginUI.quickNewElement("div", undefined, "header"),
            this.controlsListing = <HTMLDivElement> PluginUI.quickNewElement("div", undefined, "listing")
        );

        this.renderHeader();
    }

    renderHeader() {
        let header = this.header;
        header.append(
            PluginUI.button("Import", async () => {
                let files = await PluginUtils.requestFileUpload("application/json");
                for (let i = 0; i < files.length; i++) {
                    let data: PluginJSON = JSON.parse(await files.item(i).text());
                    this.importJson(data);
                }
            }),
            PluginUI.button("Export", () => PluginUtils.downloadJSON("control_panel.json", this.jsonObject()))
        );
        this.controlEntries.forEach(e => {
            let addBtn = PluginUI.button("+ " + Pretty.friendlyClassName(e), () => {
                let control = new e();
                control._linkedPlugin = this;
                this.controlsListing.append(control.parent);
                this.currentControls.push(control);
            });
            header.appendChild(addBtn);
        });
    }

    destroy() {
        [...this.currentControls].forEach(e => e.destroy());
    }

    jsonObject() {
        let json: PluginJSON = [];
        this.currentControls.forEach(c => {
            let entry: PluginJSON[number] = {
                _controlClassName: c.constructor.name,
                ...c.jsonObject()
            };
            json.push(entry);
        });
        return json;
    }
    importJson(json: PluginJSON) {
        json.forEach(e => {
            let clazz = this.controlEntries.find(v => v.name == e._controlClassName);
            if (!clazz) return;

            let control = new clazz();
            control._linkedPlugin = this;
            this.controlsListing.append(control.parent);
            this.currentControls.push(control);
            control.loadJson(e);
        });
    }

}

type PluginJSON = {
    _controlClassName: string;
    [x: string]: any;
}[];

export default Plugin;
