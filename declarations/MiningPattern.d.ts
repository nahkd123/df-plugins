declare interface MiningPattern {

    fromChunk: Rectangle;
    type: MiningPatternType;

    nextChunk(prevLoc: Rectangle): Rectangle;

}

declare enum MiningPatternType {

    Home = 0,
    Target = 1,
    Spiral = 2,
    Cone = 3,
    Grid = 4,
    ETH = 5,
    SwissCheese = 6,
    TowardsCenter = 7,
    TowardsCenterV2 = 8

}