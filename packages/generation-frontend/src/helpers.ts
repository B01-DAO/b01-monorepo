export function buildArrayForSelect(paramList: { name: string }[]) {
    return paramList.map(({ name }) => ({ value: name, label: name }));
}
