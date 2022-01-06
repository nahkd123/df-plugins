export namespace ScriptsJson {

    export interface Block {
        libraryId: string;
        type: string;
        inputs: Record<string, Block | string>;
        blockData: any;
        children?: Block[];
    }

    export interface Script {
        name: string;
        statements: Block[];
    }

}