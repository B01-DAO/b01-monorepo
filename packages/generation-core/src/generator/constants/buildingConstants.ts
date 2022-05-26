/** Constants file -- need I say more? */

export const baseParameters = {
	baseWidth: 1,
	baseDepth: 1,
	baseColor: 0x999999,
	siteOffset: 0.0,
	backgroundColor: 0xffbc1f
} as const;

export const buildingParameters = {
	columnProbability: 0.4,
	greenRoofProbability: 0.2,
	floorHeight: 0.15,
	cylinderRatio: 0.7,
} as const;

export enum BuildingShapes {
	box,
	cylinder,
	dodecahedron,
	capsule,
}

export enum WallTypes {
	green,
	climbing
}

export const currentVersion = 'H0';
