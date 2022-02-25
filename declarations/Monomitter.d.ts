declare interface Monomitter<T> {

    clear(): void;
    publish(obj: T): void;
    subscribe(cb: (obj: T) => any): void;

}