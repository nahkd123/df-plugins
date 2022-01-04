export namespace Pretty {

    const SUFFIXES = ["", "K", "M", "B"];

    export function shortNumber(no: number) {
        let suffixIndex = 0;
        while (no >= 1000 && suffixIndex < SUFFIXES.length) {
            no /= 1000;
            suffixIndex++;
        }
        return no.toFixed(2) + SUFFIXES[suffixIndex];
    }
    
    export let friendlyClassName = (e: Function) => e.name.replace(/[A-Z]/g, e => ` ${e}`).trim();

}