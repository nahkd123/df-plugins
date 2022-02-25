declare interface TxIntent {

    contract: any;
    methodName: string;
    args: Promise<unknown[]>;

}

declare interface Transaction<T extends TxIntent> {

    intent: T;
    id: string;
    lastUpdatedAt: number;
    hash?: string;
    state: any;

    submittedPromise: Promise<any>;
    confirmedPromise: Promise<any>;

}

declare interface UnconfirmedMove extends TxIntent {

    methodName: "move";
    from: LocationId;
    to: LocationId;
    forces: number;
    silver: number;
    abandoning: boolean;
    artifact?: ArtifactId;

}

declare interface UnconfirmedFindArtifact extends TxIntent {

    methodName: "findArtifact";
    planetId: LocationId;

}

declare interface UnconfirmedProspectPlanet extends TxIntent {

    methodName: "prospectPlanet";
    planetId: LocationId;

}

declare interface UnconfirmedPlanetTransfer extends TxIntent {

    methodName: "transferPlanet";
    planetId: LocationId;
    newOwner: string;

}

declare interface UnconfirmedUpgrade extends TxIntent {

    methodName: "upgradePlanet";
    locationId: LocationId;
    upgradeBranch: 0 | 1 | 2;

}

declare interface UnconfirmedDepositArtifact extends TxIntent {

    methodName: "depositArtifact";
    locationId: LocationId;
    artifactId: ArtifactId;

}

declare interface UnconfirmedWithdrawArtifact extends TxIntent {

    methodName: "withdrawArtifact";
    locationId: LocationId;
    artifactId: ArtifactId;

}

declare interface UnconfirmedActivateArtifact extends TxIntent {

    methodName: "activateArtifact";
    locationId: LocationId;
    artifactId: ArtifactId;
    wormholeTo?: LocationId;

}

declare interface UnconfirmedDeactivateArtifact extends TxIntent {

    methodName: "deactivateArtifact";
    locationId: LocationId;
    artifactId: ArtifactId;

}

declare interface UnconfirmedWithdrawSilver extends TxIntent {

    methodName: "withdrawSilver";
    locationId: LocationId;
    amount: number;

}

declare interface UnconfirmedReveal extends TxIntent {

    methodName: "revealLocation";
    locationId: LocationId;
    location: WorldLocation;

}

declare interface UnconfirmedBuyHat extends TxIntent {

    methodName: "buyHat";
    locationId: LocationId;

}

declare interface UnconfirmedInvadePlanet extends TxIntent {

    methodName: "invadePlanet";
    locationId: LocationId;

}

declare interface UnconfirmedCapturePlanet extends TxIntent {

    methodName: "capturePlanet";
    locationId: LocationId;

}
