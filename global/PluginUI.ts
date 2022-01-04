import { Pretty } from "./Pretty";

const CSS = `
:host {
    font-family: 'Inconsolata', monospace;
    font-weight: 300;
    color: rgb(187, 187, 187);
    font-size: 16px;
}
button {
    font-size: 16px;
    font-family: 'Inconsolata', monospace;
    font-weight: 300;
    user-select: none;
    display: inline-flex;
    border-radius: 3px;
    padding: 6px 8px;
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
button:active {
    background-color: rgb(255, 255, 255);
}

.text-red { color: #ff6472; }
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

}