declare interface CaptureZoneGenerator {

    new(gm: GameManager, gameStartBlock: number, changeInterval: number): unknown;
    capturablePlanets: Set<LocationId>;
    changeInterval: number;
    gameManager: GameManager;
    generated$: any;
    lastChangedBlock: number;
    nextChangeBlock: number;
    zones: Set<CaptureZone>;

    generate(blockNumber: number): Promise<Set<CaptureZone>>;
    getNextChangeBlock(): number;
    getZones(): Set<CaptureZone>;
    isInZone(locationId: LocationId): boolean;
    onNewChunk(chunk: any /* Chunk */): void;
    setNextGenerationBlock(blockNumber: number): void;
    updateCapturablePlanets(): void;

}

declare interface CaptureZone {

    coords: {x: number, y: number};
    radius: number;

}