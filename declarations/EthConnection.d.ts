declare interface EthConnection {

    gasPrices: { slow: number, average: number, fast: number };
    blockNumber: number;

}
