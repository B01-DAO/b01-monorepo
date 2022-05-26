import { createStore } from '@udecode/zustood';
import { lightParameterList } from '../constants/lightConstants';
import { EnvironmentTypes } from '../constants/environmentConstants';

// TODO: Remove seasons related code back to constants.
export const springFoliage = {
    name: 'spring',
    bushColor: 0x6a994e,
    treeColor: 0x82a820,
    barkColor: 0x786262,
    grassColor: 0x5d6b39,
};
export const summerFoliage = {
    name: 'summer',
    bushColor: 0x2e7841,
    treeColor: 0x00660a,
    barkColor: 0x786262,
    grassColor: 0x2e7841,
};
export const fallFoliage = {
    name: 'fall',
    bushColor: 0xcc5008,
    treeColor: 0xedbe00,
    barkColor: 0x786262,
    grassColor: 0x548c2f,
};
export const winterFoliage = {
    name: 'winter',
    bushColor: 0xeeeeee,
    treeColor: 0xeeeeee,
    barkColor: 0x786262,
    grassColor: 0xeeeeee,
};

export const seasonList = [springFoliage, summerFoliage, fallFoliage, winterFoliage];

export const environmentStore = createStore('environmentStore')({
    currentLightingName: null,
    currentSeasonName: 'spring',
    currentEnvironment: EnvironmentTypes.none,
}).extendSelectors((_set, get, _api) => ({
    currentLightingParams: () =>
        lightParameterList.filter(lightParam => lightParam.name === get.currentLightingName())[0],
    currentSeasonParams: () =>
        seasonList.filter(seasonParam => seasonParam.name === get.currentSeasonName())[0],
}));
