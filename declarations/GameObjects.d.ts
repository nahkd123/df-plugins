declare interface GameObjects {

    address: string;
    arrivals: Map<VoyageId, ArrivalWithTimer>;
    artifactUpdated$: Monomitter<ArtifactId>;
    artifacts: Map<ArtifactId, Artifact>;
    claimedLocations: Map<LocationId, WorldLocation>;
    contractConstants: GameManager["contractConstants"];
    coordsToLocation: Map<CoordsString, WorldLocation>;
    layeredMap: any /** TODO: LayeredMap */;
    myArtifacts: Map<ArtifactId, Artifact>;
    myArtifactsUpdated$: Monomitter<Map<ArtifactId, Artifact>>;
    myPlanets: Map<LocationId, Planet>;
    myPlanetUpdated$: Monomitter<Map<LocationId, Planet>>;
    planetArrivalIds: Map<LocationId, VoyageId[]>;
    planetLocationMap: Map<LocationId, WorldLocation>;
    planetUpdated$: Monomitter<LocationId>;

    addPlanetLocation(loc: WorldLocation): void;
    clearOldArrivals(planet: Planet): void;
    clearUnconfirmedTxIntent(tx: Transaction<TxIntent>): void;
    defaultPlanetFromLocation(location: WorldLocation): LocatablePlanet;
    forceTick(locationId: LocationId): void;
    getAllOwnedPlanets(): Planet[];
    getAllPlanets(): Iterable<Planet>;
    getAllPlanetsMap(): Map<LocationId, Planet>;
    getAllVoyages(): QueuedArrival[];
    getArrivalIdsForLocation(location: LocationId): VoyageId;
    getArtifactById(artifactId: ArtifactId): Artifact;
    getArtifactController(artifactId: ArtifactId): string;
    getArtifactMap(): Map<ArtifactId, Artifact>;
    getArtifactsOnPlanetsOwnedBy(player: string): Artifact[];
    getArtifactsOwnedBy(player: string): Artifact[];
    getEnergyCurveAtPercent(planet: Planet, percent: number): number;
    getLocationOfPlanet(planetId: LocationId): WorldLocation;
    getMyArtifactMap(): Map<ArtifactId, Artifact>;
    getMyPlanetMap(): Map<LocationId, Planet>;
    getPlanetArtifacts(planetId: LocationId): Artifact[];
    getPlanetDetailLevel(planetId: LocationId): number;
    getPlanetLevel(planetId: LocationId): number;
    getPlanetMap(): Map<LocationId, Planet>;
    getPlanetWithCoords(coords: WorldCoords): LocatablePlanet;
    getPlanetWithId(planetId: LocationId, updateIfStale?: boolean): Planet;
    getPlanetWithLocation(location: WorldLocation): Planet;
    getPlanetsInWorldCircle(coords: WorldCoords, radius: number): LocatablePlanet[];
    getPlanetsInWorldRectangle(worldX: number, worldY: number, worldWidth: number, worldHeight: number, levels?: number[], planetLevelToRadii?: Map<number, any>, updateIfStale?: boolean): LocatablePlanet[];
    getPlanetsWithIds(locationIds: LocationId[]): Planet[];
    getRevealedLocations(): Map<LocationId, RevealedLocation>;
    getSilverCurveAtPercent(planet: Planet, percent: number): number;
    getWormholes(): Iterable<Wormhole>;
    isGettingSpaceships(): boolean;
    isPlanetInContract(planetId: LocationId): boolean;
    markLocationRevealed(revealedLocation: RevealedLocation): void;
    onTxIntent(tx: Transaction<TxIntent>): void;
    planetLevelFromHexPerlin(hex: LocationId, perlin: number): number;
    planetLevelFromHexPerlin(hex: LocationId, perlin: number): PlanetType;
    processArrivalsForPlanet(planetId: LocationId, arrivals: QueuedArrival[]): ArrivalWithTimer[];
    removeArrival(planetId: LocationId, arrivalId: VoyageId): void;
    replaceArtifactFromContractData(artifact: Artifact): void;
    replaceArtifactsFromContractData(artifacts: Iterable<Artifact>): void;
    replacePlanetFromContractData(planet: Planet, updatedArrivals?: QueuedArrival[], updatedArtifactsOnPlanet?: ArtifactId[], revealedLocation?: RevealedLocation, claimerEthAddress?: string): void;
    setArtifact(artifact: Artifact): void;
    setClaimedLocation(claimedLocation: WorldLocation): void;
    setPlanet(planet: Planet): void;
    spaceTypeFromPerlin(perlin: number): SpaceType;
    updateArtifact(id: ArtifactId, updateFn: (p: Artifact) => void): void;
    updatePlanet(id: LocationId, updateFn: (p: Planet) => void): void;
    updatePlanetIfStale(planet: Planet): void;
    getSilverNeeded(planet: Planet): number;
    planetCanUpgrade(planet: Planet): boolean;

}

declare interface Wormhole {

    from: string;
    to: string;

}
