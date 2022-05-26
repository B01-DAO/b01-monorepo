import { createStore } from '@udecode/zustood';
import {TreeTypes} from "../constants/constants";

export const landscapeStore = createStore('landscapeStore')({
    treeCount: 100, // most trees will not build due to building collision.
    treeType: TreeTypes.Sphere,
    treeScale: 0.5,
});