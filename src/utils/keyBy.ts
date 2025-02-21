export function keyBy<Value extends object>(list: Value[], field: keyof Value) {
	return Object.fromEntries(list.map((value) => [value[field], value] as [keyof Value, Value]));
}
