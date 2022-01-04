import { PlanetType } from "../../global/PlanetType";
import { PluginUI } from "../../global/PluginUI";
import { ControlEntry } from "./ControlEntry";

export class Observer extends ControlEntry {

    planet: Planet;
    schedulerId: number;

    refreshNeeded = false;

    constructor() {
        super();

        let body = this.initBody();
        let energyDisp = new PluginUI.SimpleCappedDisplay("Energy");
        let silversDisp = new PluginUI.SimpleCappedDisplay("Silver");

        let notOwnerMessage = PluginUI.quickNewElement("div", "You don't own this planet!", "text-red");

        let actionsBar = this.initActionsBar();
        let teleportBtn = PluginUI.button("Teleport", () => ui.getViewport().centerCoords(this.planet.location.coords));
        let withdrawSilverBtn = PluginUI.button("Withdraw All Silvers", () => df.withdrawSilver(this.planet.locationId, this.planet.silver));
        let foundryBtn = PluginUI.button("Foundry Action", () => {
            if (!this.planet.prospectedBlockNumber) df.prospectPlanet(this.planet.locationId);
            else if (!this.planet.hasTriedFindingArtifact) df.findArtifact(this.planet.locationId);
            else foundryBtn.remove();
        });
        let selectBtn: HTMLButtonElement;
        
        let updateObserver = () => {
            if (!this.planet) return;
            this.planet = df.getPlanetWithId(this.planet.locationId);

            energyDisp.update(this.planet.energy, this.planet.energyCap);
            silversDisp.update(this.planet.silver, this.planet.silverCap);

            if (this.planet.owner != df.account) {
                if (!notOwnerMessage.isConnected) body.append(notOwnerMessage);
                if (foundryBtn.isConnected) foundryBtn.remove();
                if (withdrawSilverBtn.isConnected) withdrawSilverBtn.remove();
            } else {
                if (notOwnerMessage.isConnected) notOwnerMessage.remove();
                if (this.planet.planetType == PlanetType.FOUNDRY) {
                    let foundryActionAvailable = true;
                    let energyPercentage = (this.planet.energy / this.planet.energyCap) * 100;

                    if (energyPercentage < 95.01) foundryBtn.textContent = `Not Enough Energy (${energyPercentage.toFixed(2)}/95%)`;
                    else if (!this.planet.prospectedBlockNumber) foundryBtn.textContent = "Prospect";
                    else if (!this.planet.hasTriedFindingArtifact) foundryBtn.textContent = "Find";
                    else foundryActionAvailable = false;

                    if (foundryBtn.isConnected && !foundryActionAvailable) foundryBtn.remove();
                    else if (!foundryBtn.isConnected && foundryActionAvailable) actionsBar.append(foundryBtn);
                }

                if (this.planet.planetType == PlanetType.SPACETIME_RIP && !withdrawSilverBtn.isConnected) actionsBar.appendChild(withdrawSilverBtn);
            }
        };

        let refresh = () => {
            if (!this.planet) {
                this.headerTitle.textContent = `Observer: Not Selected`;
                selectBtn.textContent = "Select";
                
                energyDisp.parent.remove();
                silversDisp.parent.remove();
                notOwnerMessage.remove();

                teleportBtn.remove();
                withdrawSilverBtn.remove();
            } else {
                this.headerTitle.textContent = `Observer: ${df.getProcgenUtils().getPlanetNameHash(this.planet.locationId)}`;
                selectBtn.textContent = "Deselect";
                body.append(energyDisp.parent, silversDisp.parent);

                actionsBar.appendChild(teleportBtn);
                if (this.planet.owner == df.account) {
                    if (this.planet.planetType == PlanetType.FOUNDRY && !this.planet.hasTriedFindingArtifact) actionsBar.appendChild(foundryBtn);
                    if (this.planet.planetType == PlanetType.SPACETIME_RIP) actionsBar.appendChild(withdrawSilverBtn);
                }

                updateObserver();
            }
        };

        let selectClick = () => {
            this.planet = this.planet? null : ui.selectedPlanet;
            refresh();
        };

        this.schedulerId = setInterval(() => {
            if (this.refreshNeeded) {
                this.refreshNeeded = false;
                refresh();
            }
            updateObserver();
        }, 1000);

        actionsBar.append(
            selectBtn = PluginUI.button("Select", selectClick)
        );
        selectClick();
    }

    destroy() {
        this.planet = null;
        clearInterval(this.schedulerId);
    }

    jsonObject() { return { locationId: this.planet.locationId }; }
    loadJson(obj: any): void {
        this.planet = df.getPlanetWithId(obj.locationId);
        this.refreshNeeded = true;
    }

}
