import { createStore } from '@udecode/zustood';
import {TreeTypes} from "../constants/constants";

export const landscapeStore = createStore('landscapeStore')({
    treeType: TreeTypes.Sphere,
    treeScale: 0.5,
});
