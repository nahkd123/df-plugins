declare interface Upgrade {

    energyCapMultiplier: number;
    energyGroMultiplier: number;
    rangeMultiplier: number;
    speedMultiplier: number;
    defMultiplier: number;

}

declare type UpgradeLevels = [Upgrade, Upgrade, Upgrade, Upgrade];
declare type UpgradeBranches = [UpgradeLevels, UpgradeLevels, UpgradeLevels];
declare type UpgradeState = [number, number, number];
declare enum UpgradeBranchName {

    Defense = 0,
    Range = 1,
    Speed = 2

}
