declare namespace df {

    export interface Player {
        address: string,
        homePlanetId: string,
        initTimestamp: number,
        lastClaimTimestamp: number,
        lastRevealTimestamp: number,
        score: number,
        twitter?: string
    }

    export const account: string;

    /**
     * The aforementioned hash function. In debug mode where DISABLE_ZK_CHECKS is on,
     * we use a faster hash function. Othewise, in production mode, use MiMC hash
     * (https://byt3bit.github.io/primesym/)
     * @param inputs
     */
    export function planetHashMimc(...inputs: number[]): DFBigInteger;

    /**
     * Map from ethereum addresses to player objects. This isn't stored in GameObjects,
     * because it's not techincally an entity that exists in the world. A player just
     * controls planets and artifacts that do exist in the world
     */
    export const players: Map<string, Player>;

    export interface Terminal {
        clear(): void;
        focus(): void;
        getInput(): Promise<string>;
        newline(): void;
        print(str: string, style?: number): void;
        printElement(e: any): void;
        printLink(str: string, onClick: () => void, style?: number): void;
        printLoadingBar(prettyEntityName: string, ref: any): void;
        printLoadingSpinner(): void;
        printShellLn(str: string): void;
        println(str: string, style?: number): void;
        removeLast(n: number): void;
        setInput(input: string): void;
        setUserInputEnabled(enabled: boolean): void;
    }
    export const terminal: MutableRefObject<Terminal>;

    export const useMockHash: boolean;
    
    /**
     * Sometimes the universe gets bigger... Sometimes it doesn't
     */
    export const worldRadius: number;

    export const planetRarity: number;

    export function activateArtifact(
        locationId: LocationId,
        artifactId: ArtifactId,
        wormholeTo?: LocationId,
        bypassCheck?: boolean
    ): typeof df;

    export function buyHat(
        locationId: LocationId,
        bypassCheck?: boolean
    ): typeof df;

    export function checkGameHasEnded(): boolean;

    export function clearEmoij(locationId: LocationId): Promise<void>;

    export function deactivateArtifact(
        locationId: LocationId,
        artifactId: ArtifactId,
        bypassCheck?: boolean
    ): typeof df;

    export function depositArtifact(
        locationId: LocationId,
        artifactId: ArtifactId,
        bypassCheck?: boolean
    ): typeof df;

    export function findArtifact(
        locationId: LocationId,
        bypassCheck?: boolean
    ): typeof df;

    export function getAccount(): string;

    /**
     * Gets the active artifact on this planet, if one exists
     * @param planet 
     */
    export function getActiveArtifact(planet: Planet): Artifact;

    /**
     * Gets a list of planets that have an owner
     */
    export function getAllOwnedPlanets(): Planet[];

    /**
     * Gets all planets. This means all planets that are in the contract, and also all
     * planets that have been mined locally. Does not update planets if they are stale.
     * NOT PERFORMANT - for scripting only
     */
    export function getAllPlanets(): Iterable<Planet>;

    /**
     * Gets all voyages that have not completed
     */
    export function getAllVoyages(): QueuedArrival[];

    export function getArtifactMap(): Map<ArtifactId, Artifact>;
    export function getArtifactWithId(artifactId: ArtifactId): Artifact;
    export function getArtifactsWithIds(artifactIds: ArtifactId[]): Artifact[];

    /**
     * Gets the distance between two planets. Throws an exception if you don't know the
     * location of either planet. Takes into account wormholes
     * @param fromId 
     * @param toId 
     */
    export function getDist(
        fromId: LocationId,
        toId: LocationId
    ): number;

    /**
     * Gets the distance between two coordinates in space
     * @param fromCoords 
     * @param toCoords 
     */
    export function getDistCoords(
        fromCoords: WorldCoords,
        toCoords: WorldCoords
    ): number;

    export function getEnergyNeededForMove(
        fromId: LocationId,
        toId: LocationId,
        arrivingEnergy: number
    ): number;

    export function getEnergyArrivingForMove(
        fromId: LocationId,
        toId: LocationId,
        distance: number,
        sentEnergy: number
    ): number;

    export function getEnergyCurveAtPercent(
        planet: Planet,
        percent: number
    ): number;

    export function getTimeForMove(
        fromId: LocationId,
        toId: LocationId
    ): number;

    export function move(
        from: LocationId,
        to: LocationId,
        forces: number,
        silver: number,
        artifactMoved?: ArtifactId,
        bypassCheck?: boolean
    ): typeof df;

    export function prospectPlanet(
        locationId: LocationId,
        bypassCheck?: boolean
    ): typeof df;

    export function findArtifact(
        locationId: LocationId,
        bypassCheck?: boolean
    ): typeof df;

    export function transferOwnership(
        locationId: LocationId,
        newOwner: string,
        bypassCheck?: boolean
    ): typeof df;

    export function upgrade(
        locationId: LocationId,
        branch: number,
        bypassCheck?: boolean
    ): typeof df;

    export function withdrawArtifact(
        locationId: LocationId,
        artifactId: ArtifactId,
        bypassCheck?: boolean
    ): typeof df;

    export function withdrawSilver(
        locationId: LocationId,
        amount: number,
        bypassCheck?: boolean
    ): typeof df;

    export function waitForPlanet<T>(
        locationId: LocationId,
        predicate: (diff: Diff<Planet>) => T
    ): Promise<T>;
    
    export function getHomeCoords(): WorldCoords;
    export function getHomeHash(): LocationId;
    export function getWorldRadius(): number;

    export function getMyBalanceEth(): number;
    export function getMyPlanets(): Planet[];
    export function getMyPlanetMap(): Map<LocationId, Planet>;
    export function getMyArtifacts(): Artifact[];
    export function getMyArtifactMap(): Map<ArtifactId, Artifact>;

    export function getPerlinThresholds(): [number, number, number];

    export function getPlanetMap(): Map<LocationId, Planet>;
    export function getPlanetRarity(): number;
    export function getPlanetWithId(locationId: LocationId): Planet;
    export function getPlanetWithIds(locationId: LocationId[]): Planet[];
    
    /**
     * Gets all the planets that you can reach with at least 1 energy from the given
     * planet. Does not take into account wormholes
     * @param locationId 
     * @param sendingPercent 
     */
    export function getPlanetsInRange(
        locationId: LocationId,
        sendingPercent: number
    ): Planet[];
    
    export function getPlayer(): Player;
    export function getPlayer(address: string): Player;
    export function getPlayerScore(address: string): number;
    
    export function getSilverCurveAtPercent(
        planet: Planet,
        percent: number
    ): number;

    export function getProcgenUtils(): ProcgenUtils;

}

declare interface ProcgenUtils {
    getPlanetNameHash(hash: string): string;
}

declare type Planet = {
    biome: number;
    bonus: boolean[];
    coordsRevealed: boolean;
    defense: number;
    destroyed: boolean;
    energy: number;
    energyCap: number;
    energyGrowth: number;
    hasTriedFindingArtifact: boolean;
    hatLevel: number;
    heldArtifactIds: ArtifactId[];
    isHomePlanet: boolean;
    isInContract: boolean;
    lastUpdated: number;
    loadingServerState: boolean;
    location: DFLocation;
    locationId: LocationId;
    needsServerRefresh: boolean;
    owner: string;
    perlin: number;
    planetLevel: number;
    planetType: number;
    prospectedBlockNumber?: number;
    range: number;
    revealer: string;
    silver: number;
    silverCap: number;
    silverGrowth: number;
    silverSpent: number;
    spaceType: number;
    speed: number;
    syncedWithContract: boolean;
    upgradeState: number[];
}

declare type ArtifactId = string;
declare type Artifact = {
    artifactType: number;
    currentOwner: string;
    discoverer: string;
    id: ArtifactId;
    isInititalized: boolean;
    lastActivated: number;
    lastDeactivated: number;
    mintedAtTimestamp: number;
    onPlanetId: LocationId;
    onVoyageId: VoyageId;
    planetBiome: number;
    planetDiscoveredOn: LocationId;
    rarity: number;
    upgrade: ArtifactUpgrade;
    wormholeTo?: LocationId;
}
declare type ArtifactUpgrade = {
    defMultiplier: number;
    energyCapMultiplier: number;
    energyGroMultiplier: number;
    rangeMultiplier: number;
    speedMultiplier: number;
}

declare type MutableRefObject<T> = {
    current: T;
}
declare type Diff<T> = {
    current: T;
    previous: T;
}

declare type LocationId = string;
declare type WorldCoords = {
    hash?: LocationId;
    revealer?: string;
    x: number;
    y: number;
}
declare type DFLocation = {
    biomebase: number;
    coords: WorldCoords;
    hash: LocationId;
    perlin: number;
    revealer: string;
}

declare type VoyageId = string;
declare type QueuedArrival = {
    eventId: `${number}`;
    arrivalTime: number;
    departureTime: number;
    
    player: string;
    fromPlanet: LocationId;
    toPlanet: LocationId;
    
    energyArriving: number;
    artifactId: ArtifactId;
    silverMoved: number;
}
