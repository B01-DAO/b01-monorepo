import Color from 'color';
import { buildingStore } from '../store/buildingStore';
import {customRandom, randomColor} from './math';

export let colorTheme = Color('#000000');

buildingStore.store.subscribe(({ buildingColor }) => {
	colorTheme = Color(convertFromHexToString(buildingColor));
});

export function convertFromHexToString(colorHex: string) {
	return '#' + colorHex.padStart(6, '0');
}

export function hex_to_ascii(hexValue: number) {
	return "#" + hexValue.toString(16).padStart(6, '0');
}

export function getRandomColorInTheme() {
	let blockColor = colorTheme;
	if(customRandom() < 0.3) {
		blockColor = blockColor.rotate(120);
	}
	if(blockColor.hsl().color[0] === 0) {
		if (customRandom() < 0.3) {
			blockColor = Color('#' + randomColor(customRandom).padStart(6, '0'));
		}
	}
	blockColor = blockColor.saturate(customRandom()*5);

	// blockColor = blockColor.desaturate(customRandom()/2 + 0.3)
	blockColor = blockColor.rotate(customRandom() * 50);
	// blockColor = blockColor.darken(customRandom() * 0.1);
	// blockColor = blockColor.lighten(customRandom() * 0.4);
	// console.log("blockColor", blockColor.hex());
	return parseInt(blockColor.hex().substring(1), 16);
}

export function stringToHex(color: string) {
	return parseInt(color, 16);
}
