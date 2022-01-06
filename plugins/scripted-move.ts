import { PluginUI } from "../global/PluginUI";
import { PluginUtils } from "../global/PluginUtils";
import { Defaults } from "./scripted-move/Defaults";
import { Scripts } from "./scripted-move/Scripts";
import { ScriptsJson } from "./scripted-move/ScriptsJson";

const CSS = `
:host {
    display: block;
}
div.simple-tabbed-container > div.tab {
    max-height: 500px;
    height: 500px;
}
div.tab.library-explorer > input.search-bar,
div.tab > input.script-name {
    display: block;
    width: calc(100% - 20px);
}
div.tab > input.script-name {
    margin-bottom: 8px;
}
div.tab.library-explorer > div.result {
    margin-top: 8px;
    height: calc(100% - 40px);
    overflow-y: auto;
}
div.tab.library-explorer > div.result > div {
    margin-bottom: 8px;
    padding: 8px;
    border-radius: 4px;
    border: 1px solid rgb(55, 55, 55);
    background-color: #1f1f1f;
}
div.tab.library-explorer > div.result > div > div.content > button {
    display: inline-block;
    margin-right: 2px;
    margin-bottom: 2px;
    cursor: move;
}
`;

export class Plugin {

    container: PluginUI.PluginContainer;
    tabsContainer: PluginUI.SimpleTabbedContainer;
    libraries: Scripts.BlocksLibrary[] = [
        Defaults.VariableLibrary,
        Defaults.BasicActionsLibrary,
        Defaults.SelectorsLibrary,
        Defaults.QueryLibrary,
        Defaults.AttributesLibrary,
        Defaults.ArithmeticLibrary,
        Defaults.TrigonometricLibrary,
        Defaults.LogicLibrary,
        Defaults.TextLibrary,
        Defaults.UtilityLibrary,
    ];

    constructor() {
    }

    async render(c: HTMLDivElement) {
        c.style.minWidth = "600px";

        let container = this.container = PluginUI.applyContainer(c);
        Scripts.addStylesheet(container);
        container.addStylesheet(CSS);

        let tabsContainer = this.tabsContainer = new PluginUI.SimpleTabbedContainer();
        container.shadowRoot.appendChild(tabsContainer.parent);

        let homeTab = tabsContainer.addTab("# Home");
        tabsContainer.showTab(homeTab);
        homeTab.append(
            PluginUI.quickNewElement("div", `Welcome!`),
            PluginUI.button("+ New Script", () => {
                let script = new Scripts.ScriptView(tabsContainer);
                script.script.internalLibraries = this.libraries;
                tabsContainer.showTab(script.tabBody);
            }),
            PluginUI.button("+ Import Script", async () => {
                let files = await PluginUtils.requestFileUpload("application/json");
                for (let i = 0; i < files.length; i++) {
                    const file = await files[i].text();
                    const json: ScriptsJson.Script = JSON.parse(file);
                    let script = new Scripts.ScriptView(tabsContainer);
                    script.script.internalLibraries = this.libraries;
                    script.script.importJson(json);
                    script.tabButton.textContent = script.scriptNameInput.value = script.script.name;
                    tabsContainer.showTab(script.tabBody);
                }
            })
        );

        this.renderLibraryExplorer();
    }

    renderLibraryExplorer() {
        let libraryExplorer = this.tabsContainer.addTab("# Library");
        libraryExplorer.classList.add("library-explorer");

        let searchBar = <HTMLInputElement> PluginUI.quickNewElement("input", undefined, "search-bar");
        searchBar.placeholder = "Search...";

        let result = <HTMLDivElement> PluginUI.quickNewElement("div", undefined, "result");
        let searchFor = (kwd: string) => {
            this.libraries.forEach(lib => {
                if (!lib.parent.isConnected) result.append(lib.parent);
                lib.performQuery(kwd);
            });
        };
        searchFor("");

        searchBar.addEventListener("keydown", event => { event.cancelBubble = true; });
        searchBar.addEventListener("keyup", event => {
            event.cancelBubble = true;
            searchFor(searchBar.value);
        });

        libraryExplorer.append(
            searchBar,
            result
        );
    }

    destroy() {
        Scripts.killRunning();
    }

}
export default Plugin;
