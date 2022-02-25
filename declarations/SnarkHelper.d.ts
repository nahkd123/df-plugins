declare interface SnarkHelper {

    biomebasePerlinOpts: PerlinConfig;
    hashConfig: HashConfig;
    moveSnarkCache: MapCache<string, MoveSnarkContractCallArgs>;
    planetHashMimc: (...inputs: number[]) => TBigInteger;
    spaceTypePerlinOpts: PerlinConfig;
    useMockHash: boolean;
    readonly DEFAULT_SNARK_CACHE_SIZE: number;

    getFindArtifactArgs(x: number, y: number): Promise<(string | string[])[]>;
    getInitArgs(x: number, y: number, r: number): Promise<(string | string[])[]>;
    getMoveArgs(x1: number, y1: number, x2: number, y2: number, r: number, distMax: number): Promise<(string | string[])[]>;
    getRevealArgs(x: number, y: number): Promise<(string | string[])[]>;
    setSnarkCacheSize(size: number): void;

}

declare type MoveSnarkContractCallArgs = [
    [string, string],
    [
        [string, string],
        [string, string]
    ],
    [string, string],
    [string, string, string, string, string, string, string, string, string, string]
];
