// https://github.com/darkforest-eth/packages/blob/master/types/src/arrival.ts
declare interface QueuedArrival {

    eventId: VoyageId;
    player: string;
    fromPlanet: LocationId;
    toPlanet: LocationId;
    energyArriving: number;
    silverMoved: number;
    artifactId?: ArtifactId;
    departureTime: number;
    distance: number;
    arrivalTime: number;

}

declare interface ArrivalWithTimer {

    arrivalData: QueuedArrival;
    timer: ReturnType<typeof setTimeout>;

}
