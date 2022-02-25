declare type CoordsString = `${number},${number}`;

declare type MutableRefObject<T> = {

    current: T;

}
declare type Diff<T> = {

    current: T;
    previous: T;
    
}

declare type DFLocation = {
    biomebase: number;
    coords: WorldCoords;
    hash: LocationId;
    perlin: number;
    revealer: string;
}

declare interface HashConfig {

    biomebaseKey: number;
    perlinLengthScale: number;
    perlinMirrorX: boolean;
    perlinMirrorY: boolean;
    planetHashKey: number;
    planetRarity: number;
    spaceTypeKey: number;

}

declare interface PerlinConfig {

    key: number;
    scale: number;
    mirrorX: boolean;
    mirrorY: boolean;
    floor: boolean;

}

type TBigIntConsumeable = TBigInteger | number | `${bigint}` | bigint;

declare interface TBigInteger {

    value: bigint;
    abs(): TBigInteger;
    add(a: TBigIntConsumeable): TBigInteger;
    and(a: TBigIntConsumeable): TBigInteger;
    bitLength(): TBigInteger;
    compare(a: TBigIntConsumeable): -1 | 0 | 1;
    compareAbs(a: TBigIntConsumeable): -1 | 0 | 1;
    compareTo(a: TBigIntConsumeable): -1 | 0 | 1;
    divide(a: TBigIntConsumeable): TBigInteger;
    multiply(a: TBigIntConsumeable): TBigInteger;
    subtract(a: TBigIntConsumeable): TBigInteger;

}

declare interface MapCache<K, V> {

    K: K;
    V: V;
    backward: Uint8Array;
    forward: Uint8Array;
    capacity: number;
    head: number;
    tail: number;
    items: Map<K, number>;
    size: number;

    clear(): void;
    entries: Iterable<[K, V]>;
    forEach(cb: (v: V, k: K) => any): void;
    get(k: K): void;
    has(k: K): boolean;
    inspect(): Map<K, V>;
    keys(): Iterable<K>;
    values(): Iterable<V>;

}
