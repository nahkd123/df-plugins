import { PluginUI } from "../../global/PluginUI";
import { PluginUtils } from "../../global/PluginUtils";
import { Pretty } from "../../global/Pretty";
import { ScriptsJson } from "./ScriptsJson";

const CSS = `
div.block {
    position: relative;
    margin-bottom: 2px;
    width: fit-content;
}
div.block > div.header {
    border-radius: 3px;
    border: 1px solid rgb(55, 55, 55);
    background-color: #1f1f1f;
    white-space: nowrap;
    padding: 8px;
    width: max-content;
    min-width: 10px;
}
div.block > div.header > * {
    display: inline-block;
    vertical-align: middle;
}
div.block > div.header > div.label {
    user-select: none;
    padding: 0 8px;
    cursor: move;
}
div.block > div.header > div.expression-slot {
    border: 1px solid rgb(95, 95, 95);
}
div.block > div.header > div.expression-slot > div.block {
    margin: 0;
}
div.block > div.header > div.expression-slot > div.block > div.header {
    border: none;
}
div.block > div.header > div.expression-slot,
div.block > div.header > div.button {
    min-height: 30px;
    border-radius: 3px;
    min-width: 25px;
    margin: 0 4px;
}
div.block > div.header > div.expression-slot.editable,
div.block > div.header > div.button {
    border: 1px solid rgb(95, 95, 95);
    min-height: 22px;
    padding: 3px 7px;
}
div.block > div.header > div.expression-slot.editable {
    -webkit-user-modify: read-write;
    outline: none;
}
div.block > div.header > div.expression-slot.editable:empty::before {
    content: attr(placeholder) " ";
    color: rgb(95, 95, 95);
    display: inline;
}
div.block > div.header > div.button {
    cursor: pointer;
    user-select: none;
}
div.block > div.header > div.button:hover {
    filter: brightness(80%);
    border: 1px solid rgb(119, 119, 119);
    color: rgb(21, 21, 21);
    background-color: rgb(187, 187, 187);
}
div.block > div.header > div.button:active {
    background-color: rgb(255, 255, 255);
}

div.block > div.children {
    position: relative;
    padding: 8px 0 16px 24px;
    width: 0;
    border: 1px solid rgb(45, 45, 45);
    border-top: none;
    background-color: #0f0f0f;
}
div.block > div.children::before {
    content: '';
    position: absolute;
    width: 45px; height: 8px;
    border: 1px solid rgb(45, 45, 45);
    border-left: none;
    left: 24px;
    background-color: #0f0f0f;
}
div.block > div.children::before {
    bottom: -1px;
}
div.block > div.children::after {
    content: '+ Drop Statement Block Here';
    display: block;
    width: fit-content;
    white-space: nowrap;
    padding: 8px 16px;
    border: 1px dashed rgb(45, 45, 45);
    margin-left: 8px;
    border-radius: 4px;
}
div.block > div.children > div.block {
    margin-left: 8px;
}

div.block.dragover {
    border-top: 1px solid white;
    margin-top: -1px;
}
div.block.dragstart {
    opacity: 0.5;
}
div.block > div.header > div.expression-slot.highlight {
    border: 1px solid white;
    background: #ffffff1e;
}
div.block > div.children.highlight::after {
    background: #ffffff1e;
    border: 1px solid white;
}

div.block.running > div.header {
    background-color: #303030;
    border: 1px solid rgb(70, 70, 70);
}
div.block.error > div.header {
    background-color: #501f1f;
    border: 1px solid rgb(127, 55, 55);
}
`;

export namespace Scripts {

    export function addStylesheet(container: PluginUI.PluginContainer) {
        container.addStylesheet(CSS);
    }

    export let lastDraggingBlock: BaseBlock;
    let detachLastBlock = true;

    export class ScriptView {

        readonly tabBody: HTMLDivElement;
        readonly scriptNameInput: HTMLInputElement;
        get tabButton() { return this.tabContainer.tabsButton.get(this.tabBody); }

        script: Script;

        constructor(
            public readonly tabContainer: PluginUI.SimpleTabbedContainer,
            tabBody?: HTMLDivElement
        ) {
            this.script = new Script();
            this.script.postConstructor();

            this.tabBody = tabBody ?? tabContainer.addTab("No Name");
            while (this.tabBody.firstElementChild) this.tabBody.firstChild.remove();
            this.scriptNameInput = <HTMLInputElement> PluginUI.quickNewElement("input", undefined, "script-name");
            this.scriptNameInput.placeholder = "Script Name...";
            this.scriptNameInput.value = "No Name";
            this.scriptNameInput.addEventListener("keydown", event => { event.cancelBubble = true; });
            this.scriptNameInput.addEventListener("keyup", event => {
                event.cancelBubble = true;
                this.tabButton.textContent = this.script.name = this.scriptNameInput.value;
            });
            
            this.tabBody.append(
                this.scriptNameInput,
                this.script.parent
            );
            this.tabButton.addEventListener("dragover", () => {
                this.tabContainer.showTab(this.tabBody);
            });
        }

    }

    export class BlocksLibrary {

        parent = document.createElement("div");
        title: HTMLDivElement;
        content = <HTMLDivElement> PluginUI.quickNewElement("div", undefined, "content");

        constructor(
            public readonly libraryId: string,
            public readonly libraryName: string,
            public readonly blocks: (new() => BaseBlock)[]
        ) {
            this.title = <HTMLDivElement> PluginUI.quickNewElement("div", `${this.libraryName}`, "title");
            this.parent.append(this.title, this.content);
        }

        query(msg: string) { return this.blocks.filter(v => v.name.toLowerCase().includes(msg.replaceAll(" ", "").toLowerCase())); }
        performQuery(msg: string) {
            while (this.content.firstChild) this.content.firstChild.remove();
            let queryResult = this.query(msg);
            if (queryResult.length == 0) {
                let label = <HTMLDivElement> PluginUI.quickNewElement("div", `(no result)`, "text-center");
                this.content.appendChild(label);
                return;
            }
            queryResult.forEach(block => {
                let blockElement = PluginUI.button(Pretty.friendlyClassName(block));
                blockElement.draggable = true;
                this.content.appendChild(blockElement);
                blockElement.addEventListener("dragstart", event => {
                    event.cancelBubble = true;
                    event.dataTransfer.setDragImage(document.createElement("div"), 0, 0);
                    lastDraggingBlock = new block();
                    lastDraggingBlock.postConstructor();
                });
                blockElement.addEventListener("drag", event => {
                    event.preventDefault();
                });
            });
        }

        static assignBlockIdentifier(json: ScriptsJson.Block, lib: BlocksLibrary[], clazz: new() => BaseBlock) {
            let library = lib.find(v => v.blocks.includes(clazz));
            json.libraryId = library.libraryId;
            json.type = clazz.name;
        }

        static searchClass(json: ScriptsJson.Block, lib: BlocksLibrary[]) {
            let library = lib.find(v => v.libraryId == json.libraryId);
            return library?.blocks.find(v => v.name == json.type);
        }

    }

    export class ExecutionContext {

        localVariables = new Map<string, string>();

        constructor(
            public readonly parent: ExecutionContext
        ) {}

        define(varname: string, value: string) {
            if (this.localVariables.has(varname)) throw new Error("Variable already declared");
            this.localVariables.set(varname, value);
        }

        get(varname: string) {
            if (this.localVariables.has(varname)) return this.localVariables.get(varname);
            if (this.parent) return this.parent.get(varname);
            throw new Error(`Variable ${varname} is not declared`);
        }

        set(varname: string, value: string) {
            if (this.localVariables.has(varname)) this.localVariables.set(varname, value);
            else if (this.parent) this.parent.set(varname, value);
            else throw new Error(`Variable ${varname} is not declared`);
        }

    }

    export abstract class BaseBlock {

        slots: Record<string, ExpressionSlot> = {};

        parent = document.createElement("div");
        header = document.createElement("div");

        constructor(
            public readonly display: BlockDisplayComponent[]
        ) {
            this.parent.className = "block";
            this.header.className = "header";
            this.parent.appendChild(this.header);

            display.forEach(disp => {
                let dispComp = typeof disp == "string"? new DisplayLabel(disp) : disp;
                this.header.appendChild(dispComp.parent);

                if (dispComp instanceof ExpressionSlot) this.slots[dispComp.id] = dispComp;
            });

            this.header.draggable = true;

            this.header.addEventListener("dragstart", event => {
                event.cancelBubble = true;
                event.dataTransfer.setDragImage(document.createElement("div"), 0, 0);
                lastDraggingBlock = this;
                this.parent.classList.add("dragstart");
                detachLastBlock = true;
            });
            this.header.addEventListener("drag", event => {
                event.preventDefault();
            });
            this.header.addEventListener("dragend", event => {
                event.cancelBubble = true;
                this.parent.classList.remove("dragstart");
                if (detachLastBlock) this.detach();
            });
        }

        get displayString() {
            let str = "";
            for (let i = 0; i < this.display.length; i++) {
                const element = this.display[i];
                if (str.length != 0) str += " ";
                str +=
                    typeof element == "string"? element :
                    element instanceof DisplayLabel? element.label :
                    element instanceof ExpressionSlot? `<${element.placeholder || "#"}>` : "[?]";
            }
            return str;
        }

        postConstructor() {}

        setSlotExpression(id: string, exp: Expression) {
            if (!this.slots[id]) return;
            this.slots[id].expression = exp;
            exp.parentSlot = this.slots[id];
            if (this instanceof Expression) exp.parentExp = this;
        }

        setSlotString(id: string, value: string) {
            if (!this.slots[id]) return;
            this.slots[id].set(value);
        }

        abstract detach(): void;

        convertToJson(libraries: BlocksLibrary[]): ScriptsJson.Block {
            let json = <ScriptsJson.Block> {
                inputs: {},
                blockData: {}
            };
            BlocksLibrary.assignBlockIdentifier(json, libraries, <new() => BaseBlock> this.constructor);
            Object.keys(this.slots).forEach(key => {
                const expSlot = this.slots[key];
                json.inputs[key] = expSlot.expression? expSlot.expression.convertToJson(libraries) : expSlot.getString(null);
            });
            if (this instanceof Statement && this.children.length > 0) {
                json.children = this.children.map(v => v.convertToJson(libraries));
            }
            this.saveCustomJsonData(json.blockData);
            return json;
        }

        loadFromJson(json: ScriptsJson.Block, libraries: BlocksLibrary[]) {
            Object.keys(json.inputs).forEach(key => {
                const data = json.inputs[key];
                if (typeof data == "string") this.setSlotString(key, data);
                else {
                    let clazz = BlocksLibrary.searchClass(data, libraries);
                    let child = new clazz();
                    child.postConstructor();
                    if (!(child instanceof Expression)) return;
                    child.loadFromJson(data, libraries);
                    this.setSlotExpression(key, child);
                }
            });
            if (this instanceof Statement && json.children) {
                [...this.children].forEach(c => c.detach());
                for (let i = 0; i < json.children.length; i++) {
                    const childJson = json.children[i];
                    let clazz = BlocksLibrary.searchClass(childJson, libraries);
                    let child = new clazz() as Statement;
                    child.postConstructor();
                    child.loadFromJson(childJson, libraries);
                    this.addChild(child);
                }
            }
            this.loadCustomJsonData(json.blockData);
        }

        saveCustomJsonData(data: any) {}
        loadCustomJsonData(data: any) {}

    }

    export abstract class Expression extends BaseBlock {

        parentSlot: ExpressionSlot;
        parentExp?: Expression;

        constructor(
            display: BlockDisplayComponent[]
        ) {
            super(display);
            this.parent.classList.add("expression");
        }

        detach(): void {
            this.parent.remove();
            if (this.parentSlot) this.parentSlot.set("");
            this.parentSlot = this.parentExp = undefined;
        }

        abstract getValue(ctx: ExecutionContext): any;
        getString(ctx: ExecutionContext) { return this.getValue(ctx) + ""; }

    }

    export abstract class Statement extends BaseBlock {

        abstract nestedBlock: boolean;
        parentStatement: Statement;
        children: Statement[] = [];

        nestedElement: HTMLDivElement;

        constructor(
            display: BlockDisplayComponent[]
        ) {
            super(display);
            this.parent.classList.add("statement");

            this.header.addEventListener("dragleave", event => {
                this.parent.classList.remove("dragover");
            });
            this.header.addEventListener("dragover", event => {
                event.preventDefault();
                event.cancelBubble = true;
                if (lastDraggingBlock instanceof Statement) this.parent.classList.add("dragover");
            });
            this.header.addEventListener("drop", event => {
                event.cancelBubble = true;
                this.parent.classList.remove("dragover");
                if (lastDraggingBlock == this) {
                    detachLastBlock = false;
                    return;
                }
                if (lastDraggingBlock instanceof Statement) {
                    this.parentStatement.insertBefore(this, lastDraggingBlock);
                }
            });
        }

        postConstructor(): void {
            if (this.nestedBlock) {
                this.nestedElement = <HTMLDivElement> PluginUI.quickNewElement("div", undefined, "children");
                this.parent.appendChild(this.nestedElement);

                this.nestedElement.addEventListener("dragover", event => {
                    event.preventDefault();
                    event.cancelBubble = true;
                    if (lastDraggingBlock instanceof Statement) this.nestedElement.classList.add("highlight");
                });
                this.nestedElement.addEventListener("dragleave", event => {
                    event.cancelBubble = true;
                    this.nestedElement.classList.remove("highlight");
                });
                this.nestedElement.addEventListener("drop", event => {
                    event.cancelBubble = true;
                    this.nestedElement.classList.remove("highlight");
                    if (lastDraggingBlock == this) {
                        detachLastBlock = false;
                        return;
                    }
                    if (lastDraggingBlock instanceof Statement) {
                        detachLastBlock = false;
                        lastDraggingBlock.detach();
                        this.addChild(lastDraggingBlock);
                    }
                });
            }
        }

        async execute(prevResult: any, ctx: ExecutionContext): Promise<any> {}

        async executeChild(parent: ExecutionContext): Promise<any> {
            let prev: any = undefined;
            let ctx = new ExecutionContext(parent);

            for (let i = 0; i < this.children.length; i++) {
                let child = this.children[i];
                try {
                    child.parent.classList.add("running");
                    child.parent.classList.remove("error");
                    prev = await child.execute(prev, ctx);
                } catch (e) {
                    child.parent.classList.add("error");
                    throw e;
                } finally {
                    child.parent.classList.remove("running");
                }
            }

            delete ctx.localVariables;
        }

        addChild(child: Statement) {
            this.nestedElement.appendChild(child.parent);
            this.children.push(child);
            child.parentStatement = this;
        }

        detach() {
            if (!this.parentStatement) return;
            this.parentStatement.children.splice(this.parentStatement.children.indexOf(this), 1);
            this.parentStatement = undefined;
            this.parent.remove();
        }

        insertBefore(before: Statement, child: Statement) {
            if (before.parentStatement != this) return;
            detachLastBlock = false;
            child.detach();
            child.parentStatement = this;
            this.nestedElement.insertBefore(child.parent, before.parent);
            this.children.splice(this.children.indexOf(before), 0, child);
        }

    }

    export class Script extends Statement {
        
        name: string = "No Name";
        nestedBlock: boolean = true;
        internalLibraries: BlocksLibrary[];

        constructor() {
            let runBtn: BlockButton;
            let exportBtn: BlockButton;
            super(["Script", runBtn = new BlockButton("Run"), exportBtn = new BlockButton("Export") ]);

            this.header.draggable = false;
            runBtn.parent.addEventListener("click", () => {
                this.executeChild(new ExecutionContext(null));
            });
            exportBtn.parent.addEventListener("click", () => {
                PluginUtils.downloadJSON(this.name.replace(" ", "_") + ".json", this.exportJson(this.internalLibraries));
            });
        }

        exportJson(libraries: BlocksLibrary[]) {
            let scriptJson: ScriptsJson.Script = {
                name: this.name,
                statements: this.children.map(v => v.convertToJson(libraries))
            };
            return scriptJson;
        }

        importJson(scriptJson: ScriptsJson.Script) {
            this.name = scriptJson.name;
            [...this.children].forEach(c => c.detach());
            scriptJson.statements.forEach(statement => {
                let clazz = BlocksLibrary.searchClass(statement, this.internalLibraries);
                let child = new clazz() as Statement;
                child.postConstructor();
                child.loadFromJson(statement, this.internalLibraries);
                this.addChild(child);
            });
        }

    }

    export abstract class BaseDisplayComponent {

        parent = document.createElement("div");
        
    }

    export class ExpressionSlot extends BaseDisplayComponent {
        
        constructor(
            public readonly id: string,
            public readonly placeholder?: string
        ) {
            super();
            this.parent.className = "expression-slot editable";
            this.parent.setAttribute("placeholder", placeholder || "");

            this.parent.addEventListener("keydown", event => { event.cancelBubble = true; });
            this.parent.addEventListener("keyup", event => { event.cancelBubble = true; });
            this.parent.addEventListener("dragover", event => {
                event.preventDefault();
                event.cancelBubble = true;
                if (lastDraggingBlock instanceof Expression) this.parent.classList.add("highlight");
            });
            this.parent.addEventListener("dragleave", event => {
                this.parent.classList.remove("highlight");
            });
            this.parent.addEventListener("drop", event => {
                this.parent.classList.remove("highlight");
                event.cancelBubble = true;
                if (lastDraggingBlock instanceof Expression) {
                    detachLastBlock = false;
                    lastDraggingBlock.detach();
                    this.expression = lastDraggingBlock;
                }
            });
        }

        #exp: Expression;
        get expression() { return this.#exp; }
        set expression(v: Expression) {
            this.#exp = v;
            if (!v) {
                this.parent.classList.add("editable");
            } else {
                while (this.parent.firstChild) this.parent.firstChild.remove();
                this.parent.classList.remove("editable");
                this.parent.appendChild(v.parent);
                v.parentSlot = this;
            }
        }

        getValue(ctx: ExecutionContext) { return this.#exp?.getValue(ctx) ?? this.parent.textContent; }
        getString(ctx: ExecutionContext) { return this.#exp?.getString(ctx) ?? this.parent.textContent; }
        set(val: any) {
            this.#exp = undefined;
            this.parent.textContent = val + "";
            this.parent.classList.add("editable");
        }

        getInt(ctx: ExecutionContext) { return parseInt(this.getString(ctx) || "0"); }
        getFloat(ctx: ExecutionContext) { return parseFloat(this.getString(ctx) || "0"); }
        getPlanetId(ctx: ExecutionContext): LocationId {
            let id = this.getString(ctx);
            if (id.length < 64) throw new Error(`Invaild Location Id: ${id}`);
            return id;
        }
        getWallet(ctx: ExecutionContext) {
            let pubk = this.getString(ctx);
            if (!pubk.startsWith("0x")) throw new Error(`Wallet must starts with 0x`);
            if (pubk.length != 42) throw new Error(`Invaild Wallet: ${pubk}`);
            return pubk;
        }
        getBoolean(ctx: ExecutionContext) { return ["true", "yes", "1"].includes(this.getString(ctx)); }

    }
    export class DisplayLabel extends BaseDisplayComponent {

        constructor(label: string) {
            super();
            this.parent.className = "label";
            this.parent.textContent = label;
        }

        get label() { return this.parent.textContent; }
        set label(v: string) { this.parent.textContent = v; }

    }
    export class BlockButton extends DisplayLabel {

        constructor(label: string) {
            super(label);
            this.parent.className = "button";
        }

    }

    export type BlockDisplayComponent = string | BaseDisplayComponent;

}
