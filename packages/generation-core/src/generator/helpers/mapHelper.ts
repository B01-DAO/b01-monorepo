export function buildMapFromArrayName(paramList) {
	const nameMap = {};
	for (let i = 0; i < paramList.length; i++) {
		nameMap[paramList[i].name] = paramList[i];
	}
	return nameMap;
}

export function buildArrayForSelect(paramList) {
	const selectList = [];
	for (let i = 0; i < paramList.length; i++) {
		selectList.push({ value: paramList[i].name, label: paramList[i].name });
	}
	return selectList;
}
