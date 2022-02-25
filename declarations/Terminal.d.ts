declare interface TerminalHandle {

    clear(): void;
    focus(): void;
    getInput(): Promise<string>;
    newline(): void;
    print(str: string, style?: TerminalTextStyle): void;
    printElement(el: any): void;
    printLink(str: string, onClick: () => any, style: TerminalTextStyle): void;
    printLoadingSpinner(): void;
    printShellLn(str: string): void;
    println(str: string, style?: TerminalTextStyle): void;
    removeLast(n: number): void;
    setInput(input: string): void;
    setUserInputEnabled(enabled: boolean): void;

}

declare enum TerminalTextStyle {

    Green     = 0,
    Sub       = 1,
    Subber    = 2,
    Text      = 3,
    White     = 4,
    Red       = 5,
    Blue      = 6,
    Invisible = 7,
    Underline = 8,
    Mythic    = 9

}
