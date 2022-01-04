export namespace PluginUtils {

    export function requestFileUpload(types?: string) {
        let e = document.createElement("input");
        e.type = "file";
        e.accept = types;
        let promise = new Promise<FileList>(resolve => {
            e.onchange = () => resolve(e.files);
        });
        e.click();
        return promise;
    }

    export function download(filename: string, text: string): void;
    export function download(filename: string, blob: Blob): void;
    export function download(filename: string, a: string | Blob) {
        let blob = typeof a == "string"? new Blob([a], { type: "text/plain" }) : a;
        let e = document.createElement("a");
        let url = URL.createObjectURL(blob);
        e.href = url;
        e.download = filename;
        e.click();
        URL.revokeObjectURL(url);
    }
    export let downloadJSON = (filename: string, json: any) => download(filename, JSON.stringify(json));

}