declare interface WorldCoords {

    x: number;
    y: number;

}

declare interface WorldLocation {

    coords: WorldCoords;
    hash: LocationId;
    perlin: number;
    biomebase: number;

}

declare interface RevealedLocation extends WorldLocation {

    revealer: string;

}

declare interface Rectangle {

    bottomLeft: WorldCoords;
    sideLength: number;

}

declare interface Chunk {

    chunkFootprint: Rectangle;
    planetLocations: WorldLocation[];
    perlin: number;

}
