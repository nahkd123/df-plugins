declare interface ChunkStore {

    hasMinedChunk(chunkFootprint: Rectangle): boolean;

}

declare interface PersistentChunkStore extends ChunkStore {

    account: string;
    chunkMap: Map<ChunkId, Chunk>;
    confirmedTxHashes: Set<string>;
    contractAddress: string;
    db: IDBPDatabase<unknown>;
    nUpdatesLastTwoMins: number;
    queuedChunkWrites: any[];

    addChunk(chunk: Chunk, presistChunk?: boolean): void;
    addHomeLocation(location: WorldLocation): Promise<void>;
    allChunks(): Iterable<Chunk>;
    bulkSetKeyInCollection(updateChunkTxs: any[], collection: any): Promise<void>;
    confirmHomeLocation(location: WorldLocation): Promise<void>;
    destroy(): void;
    getChunkByFootprint(chunkLoc: Rectangle): Chunk;
    getChunkById(chunkId: ChunkId): Chunk;
    getHomeLocations(): Promise<WorldLocation[]>;
    getMinedSubChunks(chunk: Chunk): Chunk[];
    getSavedClaimedCoords(): Promise<WorldCoords[]>;
    getSavedRevealedCoords(): Promise<WorldCoords[]>;
    getSavedTouchedPlanetIds(): Promise<LocationId[]>;
    hasMinedChunk(chunkLoc: Rectangle): boolean;
    loadChunks(): Promise<void>;
    persistQueuedChunks(): Promise<void>;
    recomputeSaveThrottleAfterUpdate(): void;
    saveClaimedCoords(coords: WorldCoords[]): Promise<void>;
    saveRevealedCoords(coords: WorldCoords[]): Promise<void>;
    saveTouchedPlanetIds(ids: LocationId[]): Promise<void>;

}

type IDBPDatabase<T> = T; // idb package
