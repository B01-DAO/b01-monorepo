export const sceneParameters = {
    hemLightName: 'hemLight',
    sunLightName: 'sunLight',
    canvasId: 'canvas',
} as const;

export const drivewayParameters = {
    color: 0x333333,
    width: 0.1,
    height: 0.01,
    entryLength: 0.2,
    driveStart: [0.3, 0, 0.55],
} as const;

export const personParameters = {
    heightMin: 0.03,
    heightMax: 0.06,
    headRatio: 0.2,
    torsoRatio: 0.4,
    legRatio: 0.4,
    armRatio: 0.5,
    torsoRadiusRatio: 0.2,
    armRadiusRatio: 0.05,
    legRadiusRatio: 0.06,
} as const;

export const greenAreaParameters = {
    soilDepth: 0.01,
} as const;

export const waterFeatureParameters = {
    boxWidth: 0.1,
    boxLength: 0.03,
    maxNumber: 40,
    height: 0.001,
    color: 0x277da1,
} as const;

export enum SpecialShapeTypes {
    dodecahedron,
    capsule,
}

export const renderParameters = {
    boundingBoxes: false,
    hasPeople: true,
    width: 800,
    height: 800,
} as const;

export enum TreeTypes {
    Sphere,
    Cone,
}
