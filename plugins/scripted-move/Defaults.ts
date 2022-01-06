import { PlanetType } from "../../global/PlanetType";
import { Scripts } from "./Scripts";

export namespace Defaults {

    // Expressions
    export class SelectedPlanet extends Scripts.Expression {
        getValue() { return ui.selectedPlanet?.locationId || "0"; }
        constructor() { super(["Selected Planet"]); }
    }

    export class EnergyNeeded extends Scripts.Expression {
        getValue(ctx: Scripts.ExecutionContext) {
            let from = this.slots["from"].getPlanetId(ctx);
            let to = this.slots["to"].getPlanetId(ctx);
            let needed = Math.ceil(this.slots["energy"].getFloat(ctx)) + 1;
            if (from.length != 64) throw new Error(`planetFrom: Planet ID is invaild (${from})`);
            if (to.length != 64) throw new Error(`planetTo: Planet ID is invaild (${to})`);
            return df.getEnergyNeededForMove(from, to, needed);
        }
        constructor() { super([
            "Energy Needed",
            new Scripts.ExpressionSlot("from", "From"),
            new Scripts.ExpressionSlot("to", "To"),
            new Scripts.ExpressionSlot("energy", "Arriving Energy")
        ]); }
    }
    export class PlanetDistance extends Scripts.Expression {
        getValue(ctx: Scripts.ExecutionContext) {
            let from = this.slots["from"].getPlanetId(ctx);
            let to = this.slots["to"].getPlanetId(ctx);
            return df.getDist(from, to);
        }
        constructor() { super([
            "Planet Distance",
            new Scripts.ExpressionSlot("from", "From"),
            new Scripts.ExpressionSlot("to", "To"),
        ]); }
    }
    export class HasArtifact extends Scripts.Expression {
        getValue(ctx: Scripts.ExecutionContext) {
            let planet = this.slots["planet"].getPlanetId(ctx);
            return df.getPlanetWithId(planet).heldArtifactIds.length > 0;
        }
        constructor() { super([
            "Has Artifact",
            new Scripts.ExpressionSlot("planet", "Planet ID"),
        ]); }
    }
    export class FirstArtifactId extends Scripts.Expression {
        getValue(ctx: Scripts.ExecutionContext) {
            let planet = this.slots["planet"].getString(ctx);
            return df.getPlanetWithId(planet).heldArtifactIds[0] || "0";
        }
        constructor() { super([
            "First Artifact Id",
            new Scripts.ExpressionSlot("planet", "Planet ID"),
        ]); }
    }
    export class HasVoyage extends Scripts.Expression {
        getValue(ctx: Scripts.ExecutionContext) {
            let from = this.slots["from"].getPlanetId(ctx);
            let to = this.slots["to"].getPlanetId(ctx);
            return df.getAllVoyages().filter(v => v.fromPlanet == from && v.toPlanet == to).length > 0;
        }
        constructor() { super([
            "Has Voyage",
            new Scripts.ExpressionSlot("from", "From"),
            new Scripts.ExpressionSlot("to", "To"),
        ]); }
    }

    export class Energy extends Scripts.Expression {
        getValue(ctx: Scripts.ExecutionContext) { return df.getPlanetWithId(this.slots["id"].getPlanetId(ctx)).energy; }
        constructor() { super(["Energy", new Scripts.ExpressionSlot("id", "Planet ID")]); }
    }
    export class EnergyCap extends Scripts.Expression {
        getValue(ctx: Scripts.ExecutionContext) { return df.getPlanetWithId(this.slots["id"].getPlanetId(ctx)).energyCap; }
        constructor() { super(["Energy Cap", new Scripts.ExpressionSlot("id", "Planet ID")]); }
    }
    export class Silver extends Scripts.Expression {
        getValue(ctx: Scripts.ExecutionContext) { return df.getPlanetWithId(this.slots["id"].getPlanetId(ctx)).silver; }
        constructor() { super(["Silver", new Scripts.ExpressionSlot("id", "Planet ID")]); }
    }
    export class SilverCap extends Scripts.Expression {
        getValue(ctx: Scripts.ExecutionContext) { return df.getPlanetWithId(this.slots["id"].getPlanetId(ctx)).silverCap; }
        constructor() { super(["Silver Cap", new Scripts.ExpressionSlot("id", "Planet ID")]); }
    }
    export class Range extends Scripts.Expression {
        getValue(ctx: Scripts.ExecutionContext) { return df.getPlanetWithId(this.slots["id"].getPlanetId(ctx)).range; }
        constructor() { super(["Range", new Scripts.ExpressionSlot("id", "Planet ID")]); }
    }
    export class Speed extends Scripts.Expression {
        getValue(ctx: Scripts.ExecutionContext) { return df.getPlanetWithId(this.slots["id"].getPlanetId(ctx)).speed; }
        constructor() { super(["Speed", new Scripts.ExpressionSlot("id", "Planet ID")]); }
    }
    export class OwnerOf extends Scripts.Expression {
        getValue(ctx: Scripts.ExecutionContext) { return df.getPlanetWithId(this.slots["id"].getPlanetId(ctx)).owner; }
        constructor() { super(["Owner of", new Scripts.ExpressionSlot("id", "Planet ID")]); }
    }
    export class FoundryProspectedBlock extends Scripts.Expression {
        getValue(ctx: Scripts.ExecutionContext) { return (df.getPlanetWithId(this.slots["id"].getPlanetId(ctx)).prospectedBlockNumber || 0) + ""; }
        constructor() { super(["Prospected Block #", new Scripts.ExpressionSlot("id", "Planet ID")]); }
    }
    export class FoundryArtifactFound extends Scripts.Expression {
        getValue(ctx: Scripts.ExecutionContext) { return (df.getPlanetWithId(this.slots["id"].getPlanetId(ctx)).hasTriedFindingArtifact || false) + ""; }
        constructor() { super(["Artifact Found", new Scripts.ExpressionSlot("id", "Planet ID")]); }
    }

    export class Add extends Scripts.Expression {
        getValue(ctx: Scripts.ExecutionContext) { return (this.slots["a"].getFloat(ctx) + this.slots["b"].getFloat(ctx)).toString(); }
        constructor() { super([ new Scripts.ExpressionSlot("a", "A"), "+", new Scripts.ExpressionSlot("b", "B") ]); }
    }
    export class Subtract extends Scripts.Expression {
        getValue(ctx: Scripts.ExecutionContext) { return (this.slots["a"].getFloat(ctx) - this.slots["b"].getFloat(ctx)).toString(); }
        constructor() { super([ new Scripts.ExpressionSlot("a", "A"), "-", new Scripts.ExpressionSlot("b", "B") ]); }
    }
    export class Multiply extends Scripts.Expression {
        getValue(ctx: Scripts.ExecutionContext) { return (this.slots["a"].getFloat(ctx) * this.slots["b"].getFloat(ctx)).toString(); }
        constructor() { super([ new Scripts.ExpressionSlot("a", "A"), "*", new Scripts.ExpressionSlot("b", "B") ]); }
    }
    export class Divide extends Scripts.Expression {
        getValue(ctx: Scripts.ExecutionContext) { return (this.slots["a"].getFloat(ctx) / this.slots["b"].getFloat(ctx)).toString(); }
        constructor() { super([ new Scripts.ExpressionSlot("a", "A"), "/", new Scripts.ExpressionSlot("b", "B") ]); }
    }
    export class Mod extends Scripts.Expression {
        getValue(ctx: Scripts.ExecutionContext) { return (this.slots["a"].getFloat(ctx) % this.slots["b"].getFloat(ctx)).toString(); }
        constructor() { super([ new Scripts.ExpressionSlot("a", "A"), "%", new Scripts.ExpressionSlot("b", "B") ]); }
    }
    export class Min extends Scripts.Expression {
        getValue(ctx: Scripts.ExecutionContext) { return Math.min(this.slots["a"].getFloat(ctx), this.slots["b"].getFloat(ctx)).toString(); }
        constructor() { super([ "Min(", new Scripts.ExpressionSlot("a", "A"), ",", new Scripts.ExpressionSlot("b", "B"), ")" ]); }
    }
    export class Max extends Scripts.Expression {
        getValue(ctx: Scripts.ExecutionContext) { return Math.max(this.slots["a"].getFloat(ctx), this.slots["b"].getFloat(ctx)).toString(); }
        constructor() { super([ "Max(", new Scripts.ExpressionSlot("a", "A"), ",", new Scripts.ExpressionSlot("b", "B"), ")" ]); }
    }

    export class Pi extends Scripts.Expression {
        getValue() { return Math.PI.toString(); }
        constructor() { super([ "𝛑" ]); }
    }
    export class Sine extends Scripts.Expression {
        getValue(ctx: Scripts.ExecutionContext) { return Math.sin(this.slots["a"].getFloat(ctx)).toString(); }
        constructor() { super([ "sin(", new Scripts.ExpressionSlot("a", "Value"), ")" ]); }
    }
    export class Cosine extends Scripts.Expression {
        getValue(ctx: Scripts.ExecutionContext) { return Math.cos(this.slots["a"].getFloat(ctx)).toString(); }
        constructor() { super([ "cos(", new Scripts.ExpressionSlot("a", "Value"), ")" ]); }
    }
    export class Tan extends Scripts.Expression {
        getValue(ctx: Scripts.ExecutionContext) { return Math.tan(this.slots["a"].getFloat(ctx)).toString(); }
        constructor() { super([ "tan(", new Scripts.ExpressionSlot("a", "Value"), ")" ]); }
    }
    export class InvertSine extends Scripts.Expression {
        getValue(ctx: Scripts.ExecutionContext) { return Math.asin(this.slots["a"].getFloat(ctx)).toString(); }
        constructor() { super([ "sin-1(", new Scripts.ExpressionSlot("a", "Value"), ")" ]); }
    }
    export class InvertCosine extends Scripts.Expression {
        getValue(ctx: Scripts.ExecutionContext) { return Math.acos(this.slots["a"].getFloat(ctx)).toString(); }
        constructor() { super([ "cos-1(", new Scripts.ExpressionSlot("a", "Value"), ")" ]); }
    }
    export class InvertTan extends Scripts.Expression {
        getValue(ctx: Scripts.ExecutionContext) { return Math.atan(this.slots["a"].getFloat(ctx)).toString(); }
        constructor() { super([ "tan-1(", new Scripts.ExpressionSlot("a", "Value"), ")" ]); }
    }

    export class True extends Scripts.Expression {
        getValue() { return "true"; }
        constructor() { super([ "true" ]); }
    }
    export class False extends Scripts.Expression {
        getValue() { return "false"; }
        constructor() { super([ "false" ]); }
    }
    export class And extends Scripts.Expression {
        getValue(ctx: Scripts.ExecutionContext) { return (this.slots["a"].getBoolean(ctx) && this.slots["b"].getBoolean(ctx)) + ""; }
        constructor() { super([ new Scripts.ExpressionSlot("a", "A"), "&&", new Scripts.ExpressionSlot("b", "B") ]); }
    }
    export class Or extends Scripts.Expression {
        getValue(ctx: Scripts.ExecutionContext) { return (this.slots["a"].getBoolean(ctx) || this.slots["b"].getBoolean(ctx)) + ""; }
        constructor() { super([ new Scripts.ExpressionSlot("a", "A"), "||", new Scripts.ExpressionSlot("b", "B") ]); }
    }
    export class Equals extends Scripts.Expression {
        getValue(ctx: Scripts.ExecutionContext) { return (this.slots["a"].getString(ctx) == this.slots["b"].getString(ctx)) + ""; }
        constructor() { super([ new Scripts.ExpressionSlot("a", "A"), "==", new Scripts.ExpressionSlot("b", "B") ]); }
    }
    export class GreaterThan extends Scripts.Expression {
        getValue(ctx: Scripts.ExecutionContext) { return (this.slots["a"].getFloat(ctx) > this.slots["b"].getFloat(ctx)) + ""; }
        constructor() { super([ new Scripts.ExpressionSlot("a", "A"), ">", new Scripts.ExpressionSlot("b", "B") ]); }
    }
    export class GreaterOrEquals extends Scripts.Expression {
        getValue(ctx: Scripts.ExecutionContext) { return (this.slots["a"].getFloat(ctx) >= this.slots["b"].getFloat(ctx)) + ""; }
        constructor() { super([ new Scripts.ExpressionSlot("a", "A"), ">=", new Scripts.ExpressionSlot("b", "B") ]); }
    }
    export class LessThan extends Scripts.Expression {
        getValue(ctx: Scripts.ExecutionContext) { return (this.slots["a"].getFloat(ctx) < this.slots["b"].getFloat(ctx)) + ""; }
        constructor() { super([ new Scripts.ExpressionSlot("a", "A"), "<", new Scripts.ExpressionSlot("b", "B") ]); }
    }
    export class LessOrEquals extends Scripts.Expression {
        getValue(ctx: Scripts.ExecutionContext) { return (this.slots["a"].getFloat(ctx) <= this.slots["b"].getFloat(ctx)) + ""; }
        constructor() { super([ new Scripts.ExpressionSlot("a", "A"), "<=", new Scripts.ExpressionSlot("b", "B") ]); }
    }

    export class JoinText extends Scripts.Expression {
        getValue(ctx: Scripts.ExecutionContext) { return this.slots["a"].getString(ctx) + this.slots["b"].getString(ctx); }
        constructor() { super([ "Join", new Scripts.ExpressionSlot("a", "A"), new Scripts.ExpressionSlot("b", "B") ]); }
    }
    export class Uppercase extends Scripts.Expression {
        getValue(ctx: Scripts.ExecutionContext) {  this.slots["a"].getString(ctx).toUpperCase(); }
        constructor() { super([ "Uppercase", new Scripts.ExpressionSlot("a", "A") ]); }
    }
    export class Lowercase extends Scripts.Expression {
        getValue(ctx: Scripts.ExecutionContext) { return this.slots["a"].getString(ctx).toLowerCase(); }
        constructor() { super([ "Lowercase", new Scripts.ExpressionSlot("a", "A") ]); }
    }

    export class CurrentAccount extends Scripts.Expression {
        getValue() { return df.getAccount(); }
        constructor() { super([ "Current Account" ]); }
    }
    export class Balance extends Scripts.Expression {
        getValue() { return df.getMyBalanceEth() + ""; }
        constructor() { super([ "Balance" ]); }
    }
    export class GasPriceSlow extends Scripts.Expression {
        getValue() { return df.ethConnection.gasPrices.slow + ""; }
        constructor() { super([ "Gas Price Slow" ]); }
    }
    export class GasPriceAvg extends Scripts.Expression {
        getValue() { return df.ethConnection.gasPrices.average + ""; }
        constructor() { super([ "Gas Price Avg" ]); }
    }
    export class GasPriceFast extends Scripts.Expression {
        getValue() { return df.ethConnection.gasPrices.fast + ""; }
        constructor() { super([ "Gas Price Fast" ]); }
    }

    // Statements
    export class Move extends Scripts.Statement {

        nestedBlock: boolean = false;
        constructor() {
            super([
                "Move from",
                new Scripts.ExpressionSlot("planetFrom"),
                "to",
                new Scripts.ExpressionSlot("planetTo"),
                new Scripts.ExpressionSlot("energy", "Energy"),
                new Scripts.ExpressionSlot("silver", "Silver"),
                new Scripts.ExpressionSlot("artifact", "Artifact ID")
            ]);
        }

        async execute(prev: any, ctx: Scripts.ExecutionContext): Promise<any> {
            let from = this.slots["planetFrom"].getPlanetId(ctx);
            let to = this.slots["planetTo"].getPlanetId(ctx);
            let artifact = this.slots["artifact"].getString(ctx) || undefined;

            let energy = Math.floor(parseFloat(this.slots["energy"].getString(ctx) || "0"));
            let silver = Math.floor(parseFloat(this.slots["silver"].getString(ctx) || "0"));

            let energyRequired = df.getEnergyNeededForMove(from, to, 1);
            if (energy < energyRequired) throw new Error(`energy: The given value is less than required (${energy} < ${energyRequired})`);
            
            let planetFrom = df.getPlanetWithId(from);
            if (planetFrom.energy < energy) throw new Error(`energy: Not enough energy (${planetFrom.energy}/${energy})`);
            if (planetFrom.silver < silver) throw new Error(`silver: Not enough silver (${planetFrom.silver}/${silver})`);
            if (artifact && !planetFrom.heldArtifactIds.includes(artifact)) throw new Error(`artifactId: Planet ${from} doesn't have artifact x${artifact}`);
            df.move(from, to, energy, silver, artifact);
        }

    }

    export class WithdrawSilver extends Scripts.Statement {

        nestedBlock: boolean = false;
        constructor() {
            super([
                "Withdraw Silver",
                new Scripts.ExpressionSlot("planetId", "Rip ID"),
                new Scripts.ExpressionSlot("silver", "Silver")
            ]);
        }

        async execute(prev: any, ctx: Scripts.ExecutionContext): Promise<any> {
            let planetId = this.slots["planetId"].getPlanetId(ctx);
            let planet = df.getPlanetWithId(planetId);
            let silver = Math.floor(parseFloat(this.slots["silver"].getString(ctx) || "0"));
            if (planet.silver < silver) throw new Error(`silver: Not enough silver (${planet.silver}/${silver})`);
            df.withdrawSilver(planetId, silver);
        }

    }

    export class WithdrawArtifact extends Scripts.Statement {

        nestedBlock: boolean = false;
        constructor() {
            super([
                "Withdraw Artifact",
                new Scripts.ExpressionSlot("planetId", "Rip ID"),
                new Scripts.ExpressionSlot("artifactId", "Artifact ID")
            ]);
        }

        async execute(prev: any, ctx: Scripts.ExecutionContext): Promise<any> {
            let planetId = this.slots["planetId"].getPlanetId(ctx);
            let artifactId = this.slots["artifactId"].getString(ctx) || "0";
            let planet = df.getPlanetWithId(planetId);
            if (!planet.heldArtifactIds.includes(artifactId)) throw new Error(`artifactId: Planet ${planetId} doesn't have artifact x${artifactId}`);
            df.withdrawArtifact(planetId, artifactId);
        }
        
    }

    export class DepositArtifact extends Scripts.Statement {

        nestedBlock: boolean = false;
        constructor() {
            super([
                "Deposit Artifact",
                new Scripts.ExpressionSlot("planetId", "Rip ID"),
                new Scripts.ExpressionSlot("artifactId", "Artifact ID")
            ]);
        }

        async execute(prev: any, ctx: Scripts.ExecutionContext): Promise<any> {
            let planetId = this.slots["planetId"].getPlanetId(ctx);
            let artifactId = this.slots["artifactId"].getString(ctx) || "0";
            df.depositArtifact(planetId, artifactId);
        }
        
    }

    export class FoundryProspect extends Scripts.Statement {

        nestedBlock: boolean = false;
        constructor() {
            super([
                "Foundry Prospect",
                new Scripts.ExpressionSlot("planetId", "Foundry ID")
            ]);
        }

        async execute(prev: any, ctx: Scripts.ExecutionContext): Promise<any> {
            let planetId = this.slots["planetId"].getPlanetId(ctx);
            let planet = df.getPlanetWithId(planetId);
            if (planet.planetType != PlanetType.FOUNDRY) throw new Error(`planetId: Not a foundry (planetType: ${planet.planetType} != ${PlanetType.FOUNDRY})`);
            if ((planet.energy / planet.energyCap) < 0.951) throw new Error(`Foundry needs 95% of energy to prospect`);
            if (planet.prospectedBlockNumber) throw new Error(`Foundry is already prospected (block no. #${planet.prospectedBlockNumber})`);
            df.prospectPlanet(planetId);
        }

    }

    export class FoundryFind extends Scripts.Statement {

        nestedBlock: boolean = false;
        constructor() {
            super([
                "Foundry Find",
                new Scripts.ExpressionSlot("planetId", "Foundry ID")
            ]);
        }

        async execute(prev: any, ctx: Scripts.ExecutionContext): Promise<any> {
            let planetId = this.slots["planetId"].getPlanetId(ctx);
            let planet = df.getPlanetWithId(planetId);
            if (planet.planetType != PlanetType.FOUNDRY) throw new Error(`planetId: Not a foundry (planetType: ${planet.planetType} != ${PlanetType.FOUNDRY})`);
            if (planet.hasTriedFindingArtifact) throw new Error(`Artifact already found`);
            df.findArtifact(planetId);
        }

    }

    export class TransferOwnership extends Scripts.Statement {

        nestedBlock: boolean = false;
        constructor() {
            super([
                "Transfer Ownership",
                new Scripts.ExpressionSlot("planetId", "Planet ID"),
                new Scripts.ExpressionSlot("wallet", "0x Address")
            ]);
        }

        async execute(prev: any, ctx: Scripts.ExecutionContext): Promise<any> {
            let planetId = this.slots["planetId"].getPlanetId(ctx);
            let transferTo = this.slots["wallet"].getWallet(ctx);
            df.transferOwnership(planetId, transferTo);
        }

    }

    export class If extends Scripts.Statement {

        nestedBlock: boolean = true;
        constructor() {
            super([ "If", new Scripts.ExpressionSlot("condition", "Condition") ]);
        }

        async execute(prev: any, ctx: Scripts.ExecutionContext): Promise<any> {
            let condition = this.slots["condition"].getBoolean(ctx);
            if (condition) await this.executeChild(ctx);
            return condition;
        }

    }

    export class ElseIf extends Scripts.Statement {

        nestedBlock: boolean = true;
        constructor() {
            super([ "Else If", new Scripts.ExpressionSlot("condition", "Condition") ]);
        }

        async execute(prevResult: any, ctx: Scripts.ExecutionContext): Promise<any> {
            if (prevResult) return true;
            let condition = this.slots["condition"].getBoolean(ctx);
            if (condition) await this.executeChild(ctx);
            return condition;
        }

    }

    export class Else extends Scripts.Statement {

        nestedBlock: boolean = true;
        constructor() {
            super([ "Else" ]);
        }

        async execute(prevResult: any, ctx: Scripts.ExecutionContext): Promise<any> {
            if (prevResult) return true;
            await this.executeChild(ctx);
        }

    }

    export class While extends Scripts.Statement {

        nestedBlock: boolean = true;
        constructor() {
            super([ "While", new Scripts.ExpressionSlot("condition", "Condition") ]);
        }

        async execute(prev: any, ctx: Scripts.ExecutionContext): Promise<any> {
            let condition: boolean;
            while (condition = this.slots["condition"].getBoolean(ctx)) await this.executeChild(ctx);
        }

    }

    export class Wait extends Scripts.Statement {

        nestedBlock: boolean = false;
        constructor() {
            super([ "Wait", new Scripts.ExpressionSlot("ms", "millis") ]);
        }

        execute(prev: any, ctx: Scripts.ExecutionContext): Promise<any> {
            return new Promise<void>(resolve => setTimeout(resolve, this.slots["ms"].getFloat(ctx)));
        }

    }

    export class PrintToTerminal extends Scripts.Statement {

        nestedBlock: boolean = false;
        constructor() {
            super([ "Terminal:", new Scripts.ExpressionSlot("text", "Text") ]);
        }

        async execute(prev: any, ctx: Scripts.ExecutionContext): Promise<any> { df.terminal.current?.println(this.slots["text"].getString(ctx)); }

    }

    export class Pause extends Scripts.Statement {

        nestedBlock: boolean = false;
        continueBtn: Scripts.BlockButton;
        exitBtn: Scripts.BlockButton;

        constructor() {
            let continueBtn: Scripts.BlockButton, exitBtn: Scripts.BlockButton;
            super([
                "Pause",
                continueBtn = new Scripts.BlockButton("Resume"),
                exitBtn = new Scripts.BlockButton("Break")
            ]);
            this.continueBtn = continueBtn;
            this.exitBtn = exitBtn;
        }

        promise: Promise<void>;

        execute(): Promise<any> {
            return new Promise<void>((resolve, reject) => {
                let resumeCb: () => void, exitCb: () => void;
                let unregister = () => {
                    this.exitBtn.parent.removeEventListener("click", exitCb);
                    this.continueBtn.parent.removeEventListener("click", resumeCb);
                };
                this.continueBtn.parent.addEventListener("click", resumeCb = () => {
                    unregister();
                    resolve();
                });
                this.exitBtn.parent.addEventListener("click", exitCb = () => {
                    unregister();
                    reject(new Error("Broke by user"));
                });
            });
        }

    }

    export class Break extends Scripts.Statement {

        nestedBlock: boolean = false;
        constructor() {
            super([ "Break" ]);
        }

        async execute(): Promise<any> { throw new Error("Broke by user"); }

    }

    // Variables
    export class VariableDefine extends Scripts.Statement {

        nestedBlock: boolean = false;
        variableButton: Scripts.BlockButton;

        constructor() {
            let variableButton: Scripts.BlockButton;
            super([
                "Define Variable",
                new Scripts.ExpressionSlot("name", "Variable Name"),
                variableButton = new Scripts.BlockButton(""),
                "=",
                new Scripts.ExpressionSlot("value", "Value")
            ]);

            this.variableButton = variableButton;
            variableButton.parent.style.cursor = "move";

            this.slots["name"].parent.addEventListener("keyup", () => {
                variableButton.label = this.slots["name"].getString(null);
            });
            variableButton.parent.draggable = true;
            variableButton.parent.addEventListener("dragstart", event => {
                event.cancelBubble = true;
                let exp = new Variable();
                exp.variableLabel.label = this.slots["name"].getString(null);
                Scripts.lastDraggingBlock = exp;
            });
            variableButton.parent.addEventListener("drag", event => {
                event.preventDefault();
                event.cancelBubble = true;
            });
            variableButton.parent.addEventListener("dragend", event => {
                event.cancelBubble = true;
            });
        }

        async execute(prevResult: any, ctx: Scripts.ExecutionContext): Promise<any> {
            ctx.define(this.slots["name"].getString(ctx), this.slots["value"].getString(ctx));
        }

        loadCustomJsonData(): void { this.variableButton.label = this.slots["name"].getString(null); }

    }

    export class VariableAssign extends Scripts.Statement {

        nestedBlock: boolean = false;
        constructor() {
            super([
                new Scripts.ExpressionSlot("variable", "Variable"),
                ":=",
                new Scripts.ExpressionSlot("value", "Value")
            ]);
        }

        async execute(prevResult: any, ctx: Scripts.ExecutionContext): Promise<any> {
            let variableExp = this.slots["variable"].expression as Variable;
            if (!variableExp) return;
            ctx.set(variableExp.variableLabel.label, this.slots["value"].getString(ctx));
        }

    }

    export class Variable extends Scripts.Expression {

        variableLabel: Scripts.DisplayLabel;

        constructor() {
            let variableLabel: Scripts.DisplayLabel;
            super([ variableLabel = new Scripts.DisplayLabel("") ]);
            this.variableLabel = variableLabel;
        }

        getValue(ctx: Scripts.ExecutionContext) { return ctx.get(this.variableLabel.label); }

        saveCustomJsonData(data: any): void { data["variable"] = this.variableLabel.label; }
        loadCustomJsonData(data: any): void { this.variableLabel.label = data["variable"]; }

    }

    // Libraries
    export const VariableLibrary = new Scripts.BlocksLibrary("nahkd.variable", "Variable", [
        VariableDefine, VariableAssign, Variable,
    ]);

    export const BasicActionsLibrary = new Scripts.BlocksLibrary("nahkd.basicActions", "Basic Actions", [
        Move,
        WithdrawSilver,
        WithdrawArtifact,
        DepositArtifact,
        FoundryProspect,
        FoundryFind,
        TransferOwnership,
    ]);

    export const SelectorsLibrary = new Scripts.BlocksLibrary("nahkd.selectors", "Selectors", [
        SelectedPlanet,
    ]);

    export const QueryLibrary = new Scripts.BlocksLibrary("nahkd.query", "Query", [
        EnergyNeeded, PlanetDistance, HasArtifact, FirstArtifactId, HasVoyage,
    ]);

    export const AttributesLibrary = new Scripts.BlocksLibrary("nahkd.attributes", "Attributes", [
        Energy, EnergyCap,
        Silver, SilverCap,
        Range, Speed,
        OwnerOf,
        FoundryProspectedBlock, FoundryArtifactFound,
    ]);

    export const ArithmeticLibrary = new Scripts.BlocksLibrary("nahkd.arithmetic", "Arithmetic", [
        Add, Subtract, Multiply, Divide, Mod, Min, Max,
    ]);

    export const TrigonometricLibrary = new Scripts.BlocksLibrary("nahkd.trigonometric", "Trigonometric", [
        Pi,
        Sine, Cosine, Tan,
        InvertSine, InvertCosine, InvertTan,
    ]);

    export const LogicLibrary = new Scripts.BlocksLibrary("nahkd.logic", "Logic", [
        True, False, And, Or,
        Equals, GreaterThan, GreaterOrEquals, LessThan, LessOrEquals,
        If, ElseIf, Else, While,
    ]);

    export const TextLibrary = new Scripts.BlocksLibrary("nahkd.text", "Text", [
        JoinText,
        Uppercase, Lowercase,
    ]);

    export const UtilityLibrary = new Scripts.BlocksLibrary("nahkd.utility", "Utility", [
        Wait, PrintToTerminal, Pause, Break,
        CurrentAccount, Balance, GasPriceSlow, GasPriceAvg, GasPriceFast,
    ]);

}