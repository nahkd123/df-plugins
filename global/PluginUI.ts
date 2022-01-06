import { Pretty } from "./Pretty";

const CSS = `
:host {
    font-family: 'Inconsolata', monospace;
    font-weight: 300;
    color: rgb(187, 187, 187);
    font-size: 16px;
}
button, input {
    font-size: 16px;
    font-family: 'Inconsolata', monospace;
    font-weight: 300;
}
button {
    padding: 6px 8px;
    user-select: none;
    display: inline-flex;
    border-radius: 3px;
    border: 1px solid rgb(95, 95, 95);
    -webkit-box-pack: center;
    justify-content: center;
    -webkit-box-align: center;
    align-items: center;
    cursor: pointer;
    background-color: rgb(37, 37, 37);
    color: rgb(187, 187, 187);
}
button:hover {
    filter: brightness(80%);
    border: 1px solid rgb(119, 119, 119);
    color: rgb(21, 21, 21);
    background-color: rgb(187, 187, 187);
}
input {
    outline: none;
    color: black;
    border: none;
    padding: 7px 10px;
}
button:active,
button.selected {
    filter: brightness(80%);
    color: rgb(21, 21, 21);
    background-color: rgb(255, 255, 255);
}

.text-red { color: #ff6472; }
.text-center { text-align: center; }

div.simple-tabbed-container {
}
div.simple-tabbed-container > div.header {
    overflow-x: scroll;
    border-bottom: 1px solid rgb(95, 95, 95);
}
div.simple-tabbed-container > div.header::-webkit-scrollbar {
    display: none;
}
div.simple-tabbed-container > div.header > button {
    margin-right: 2px;
    border-radius: 4px 4px 0 0;
    border-bottom: none;
    height: 30px;
    vertical-align: top;
}
div.simple-tabbed-container > div.tab {
    display: none;
    position: relative;
    border: 1px solid rgb(95, 95, 95);
    border-top: none;
    min-height: 5px;
    overflow: auto;
    padding: 8px;
}
div.simple-tabbed-container > div.tab.visible {
    display: block;
}
`;

export namespace PluginUI {

    export function isContainerDefined() {
        return window.customElements.get("dfplugin-container");
    }

    export class PluginContainer extends HTMLElement {

        constructor() {
            super();
            this.attachShadow({ mode: "open" });
        }

        addStylesheet(css: string) {
            let e = document.createElement("style");
            e.textContent = css;
            this.shadowRoot.appendChild(e);
        }

    }

    export function applyContainer(container: HTMLDivElement): PluginContainer {
        if (!isContainerDefined()) window.customElements.define("dfplugin-container", PluginContainer);
        let out = <PluginContainer> document.createElement("dfplugin-container");
        out.addStylesheet(CSS);
        container.append(out);
        return out;
    }

    export function quickNewElement(type: string, text = "", className = "") {
        let e = document.createElement(type);
        e.textContent = text;
        e.className = className;
        return e;
    }

    export function button(label: string, cb?: (click: MouseEvent) => any, className = "") {
        let e = <HTMLButtonElement> quickNewElement("button", label, className);
        if (cb) e.addEventListener("click", cb);
        return e;
    }

    const PERCENTAGE_COLOR = [
        [0xff, 0x64, 0x72],
        [0x70, 0xff, 0x70]
    ];

    export function percentageColor(percentage: number) {
        const colF = [
            PERCENTAGE_COLOR[0][0] * (1 - percentage) + PERCENTAGE_COLOR[1][0] * percentage,
            PERCENTAGE_COLOR[0][1] * (1 - percentage) + PERCENTAGE_COLOR[1][1] * percentage,
            PERCENTAGE_COLOR[0][2] * (1 - percentage) + PERCENTAGE_COLOR[1][2] * percentage
        ];
        return `rgb(${colF[0]}, ${colF[1]}, ${colF[2]})`;
    }

    export class SimpleCappedDisplay {

        parent: HTMLDivElement;
        name: HTMLSpanElement;
        cappedDisplay: HTMLSpanElement;
        percentage: HTMLSpanElement;

        constructor(name: string) {
            this.parent = <HTMLDivElement> quickNewElement("div", undefined, "simple-capped-display");
            this.parent.append(
                this.name = <HTMLSpanElement> quickNewElement("span", `${name}: `),
                this.cappedDisplay = <HTMLSpanElement> quickNewElement("span", `0.00/0.00 `),
                this.percentage = <HTMLSpanElement> quickNewElement("span", `(0%)`)
            );
        }

        update(value: number, cap: number) {
            this.cappedDisplay.textContent = `${Pretty.shortNumber(value)}/${Pretty.shortNumber(cap)} `;
            this.percentage.textContent = `(${((value / cap) * 100).toFixed(2)}%)`;
            this.percentage.style.color = percentageColor(value / cap);
        }

    }

    export class SimpleTabbedContainer {

        parent: HTMLDivElement;
        header: HTMLDivElement;
        openedTab: HTMLDivElement;
        tabs: HTMLDivElement[] = [];
        tabsButton = new Map<HTMLDivElement, HTMLButtonElement>();

        constructor() {
            this.parent = <HTMLDivElement> quickNewElement("div", undefined, "simple-tabbed-container");
            this.header = <HTMLDivElement> quickNewElement("div", undefined, "header");
            this.parent.append(
                this.header
            );
        }

        addHeaderButton(label: string, cb?: (event: MouseEvent) => any) {
            let btn = button(label, cb);
            this.header.append(btn);
            return btn;
        }

        addTab(title: string) {
            let body = <HTMLDivElement> quickNewElement("div", undefined, "tab");
            let btn = this.addHeaderButton(title, () => this.showTab(body));
            this.tabs.push(body);
            this.tabsButton.set(body, btn);
            this.parent.append(body);
            return body;
        }

        showTab(tab: HTMLDivElement) {
            let btn = this.tabsButton.get(tab);
            if (!btn) return;
            
            this.tabs.forEach(tab => {
                tab.classList.remove("visible");
                this.tabsButton.get(tab).classList.remove("selected");
            });
            tab.classList.add("visible");
            btn.classList.add("selected");
            this.openedTab = tab;
        }

        closeTab(tab: HTMLDivElement) {
            let btn = this.tabsButton.get(tab);
            if (!btn) return;
            tab.remove();
            btn.remove();
            this.tabsButton.delete(tab);
            if (tab == this.openedTab) this.openedTab = undefined;
        }

    }

}