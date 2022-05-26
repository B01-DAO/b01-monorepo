import { createStore } from '@udecode/zustood';
import { SpecialShapeTypes } from '../constants/constants';

export const buildingStore = createStore('buildingStore')({
    globalDefaultY: 0,
    rotateYProbability: 0,
    buildingColor: (0x000000).toString(16),
    defaultWidth: 0.1,
    defaultHeight: 1,
    defaultLength: 0.1,
    tripleSizeProbability: 0,
    allVolumesSameSize: true,
    greenRoofProbability: 0,
    cylinderProbability: 0,
    maxHeight: 5,
    hasCylinders: true,
    hasDodecahedron: true,
    dodecahedronProbability: 0,
    specialShape: SpecialShapeTypes.dodecahedron,
    hasPitchedRoofs: true,
});
