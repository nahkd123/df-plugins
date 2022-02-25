declare interface Player {

    address: string;
    twitter?: string;
    initTimestamp: number;
    homePlanetId: LocationId;
    lastRevealTimestamp: number;
    lastClaimTimestamp: number;
    score: number;
    spaceJunk: number;
    spaceJunkLimit: number;
    claimedShips: boolean;

}