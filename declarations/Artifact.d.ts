declare interface Artifact {

    isInititalized: boolean;
    id: ArtifactId;
    planetDiscoveredOn: LocationId;
    rarity: ArtifactRarity;
    planetBiome: Biome;
    mintedAtTimestamp: number;
    discoverer: string;
    artifactType: ArtifactType;
    activations: number;
    lastActivated: number;
    lastDeactivated: number;
    controller: string;

    upgrade: Upgrade;
    timeDelayedUpgrade: Upgrade;
    currentOwner: string;
    wormholeTo?: LocationId;
    onPlanetId?: LocationId;
    onVoyageId?: VoyageId;

}

declare enum ArtifactType {

    Unknown = 0,
    Monolith = 1,
    Colossus = 2,
    Spaceship = 3,
    Pyramid = 4,
    Wormhole = 5,
    PlanetaryShield = 6,
    PhotoidCannon = 7,
    BloomFilter = 8,
    BlackDomain = 9,
    ShipMothership = 10,
    ShipCrescent = 10,
    ShipWhale = 10,
    ShipGear = 10,
    ShipTitan = 10

}

declare enum ArtifactRarity {

    Unknown = 0,
    Common = 1,
    Rare = 2,
    Epic = 3,
    Legendary = 4,
    Mythic = 5

}