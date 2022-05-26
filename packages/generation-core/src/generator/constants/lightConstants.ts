export type LightParameters = {
    name: string;
    hemLightColorSky: number;
    hemLightColorGround: number;
    hemLightIntensity: number;
    DirectionalLightColor: number;
    DirectionalLightIntensity: number;
	DirectionalLightPosition: [number, number, number],
    backgroundColor: number;
    windowColor: number;
};

export const sunsetLightParameters: LightParameters = {
	name: 'sunset',
	hemLightColorSky: 0xc23400,
	hemLightColorGround: 0x080820,
	hemLightIntensity: 0.7,
	DirectionalLightColor: 0xc26e00,
	DirectionalLightIntensity: 0.5,
	DirectionalLightPosition: [-1, 0.2, 1],
	backgroundColor: 0xc23400,
	windowColor: 0xffd152
};

export const dayLightParameters: LightParameters = {
	name: 'daylight',
	hemLightColorSky: 0xffffbb,
	hemLightColorGround: 0x080820,
	hemLightIntensity: 0.5,
	DirectionalLightColor: 0xffffff,
	DirectionalLightIntensity: 1.5,
	DirectionalLightPosition: [1, 2, -0.8],
	backgroundColor: 0x0875c9,
	windowColor: 0x00c5db
};

export const wildcardLightParameters: LightParameters = {
	name: 'wildcard',
	hemLightColorSky: 0x4d648c,
	hemLightColorGround: 0x080820,
	hemLightIntensity: 1,
	DirectionalLightColor: 0xff0d86,
	DirectionalLightIntensity: 1.8,
	DirectionalLightPosition: [1, 1, 0],
	backgroundColor: 0xb84ddb,
	windowColor: 0xb5608b
};

export const overcastLightParameters: LightParameters = {
	name: 'overcastLight',
	hemLightColorSky: 0x999999,
	hemLightColorGround: 0x999999,
	hemLightIntensity: 0.6,
	DirectionalLightColor: 0x999999,
	DirectionalLightIntensity: 0.2,
	DirectionalLightPosition: [1, 2, 0.5],
	backgroundColor: 0x666666,
	windowColor: 0xcccccc
}

export const nightLightParameters: LightParameters = {
	name: 'nightLight',
	hemLightColorSky: 0x292f69,
	hemLightColorGround: 0x080820,
	hemLightIntensity: 1,
	DirectionalLightColor: 0xffffff,
	DirectionalLightIntensity: 0.1,
	DirectionalLightPosition: [1, 2, 0.5],
	backgroundColor: 0x0d0f21,
	windowColor: 0xfcfcd2
};

export const streetLightParameters = {
	color: 0xffe08a,
	intensity: 0.5,
	distance: 0.5,
	decay: 2
};

export const lightParameterList = [dayLightParameters, nightLightParameters, sunsetLightParameters,
	overcastLightParameters, wildcardLightParameters];

export function buildLightMap() {
	const lightMap = {};
	for (let i = 0; i < lightParameterList.length; i++) {
		lightMap[lightParameterList[i].name] = lightParameterList[i];
	}
	return lightMap;
}
