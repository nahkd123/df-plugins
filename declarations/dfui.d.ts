declare namespace ui {

    export function getViewport(): UIViewport;

    export let selectedPlanet: Planet;

}

declare interface UIViewport {
    canvas: HTMLCanvasElement;
    centerWorldCoords: WorldCoords;
    scale: number;
    centerCoords(coords: WorldCoords): void;
}
