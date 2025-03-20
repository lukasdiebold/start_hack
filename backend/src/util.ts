export function enumToStringArray(myEnum: Record<string, string>): [string, ...string[]] {
	return Object.values(myEnum).map((value: string) => `${value}`) as [string, ...string[]];
}
