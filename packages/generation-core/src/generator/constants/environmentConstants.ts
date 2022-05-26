export enum EnvironmentTypes {
    none,
    land,
    underWater,
    onWater,
    clouds,
    space
}

export const envWithBase = [EnvironmentTypes.underWater, EnvironmentTypes.land];
export const envWithWater = [EnvironmentTypes.underWater, EnvironmentTypes.onWater];
