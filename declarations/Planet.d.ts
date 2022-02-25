declare enum PlanetType {

    PLANET = 0,
    SILVER_MINE = 1,
    RUINS = 2,
    TRADING_POST = 3,
    SILVER_BANK = 4

}

declare type PlanetBonus = [boolean, boolean, boolean, boolean, boolean, boolean];

// https://github.com/darkforest-eth/packages/blob/master/types/src/planet.ts
declare interface Planet {

    locationId: LocationId;
    perlin: number;
    spaceType: SpaceType;
    owner: string;
    hatLevel: number;

    planetLevel: number;
    planetType: PlanetType;
    isHomePlanet: boolean;

    energyCap: number;
    energyGrowth: number;

    silverCap: number;
    silverGrowth: number;

    range: number;
    defense: number;
    speed: number;
    energy: number;
    silver: number;
    spaceJunk: number; // Introduced in 0.6r5

    lastUpdated: number;
    upgradeState: UpgradeState;
    hasTriedFindingArtifact: boolean;
    heldArtifactIds: ArtifactId[];
    destroyed: boolean;
    prospectedBlockNumber?: number;
    localPhotoidUpgrade?: Upgrade;

    silverSpent: number;
    isInContract: boolean;
    syncedWithContract: boolean;
    coordsRevealed: boolean;
    revealer?: string;
    claimer?: string;
    
    bonus: PlanetBonus;
    pausers: number;
    invader?: string;
    capturer?: string;
    invadeStartBlock?: number;

}

declare interface LocatablePlanet extends Planet {

    location: WorldLocation;
    biome: Biome;

}
