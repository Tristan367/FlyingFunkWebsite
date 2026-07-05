export function resolveImages(
	html: string,
	images: Array<{ filename: string; path: string }>
): string {
	return html.replace(/\.\/images\/([^"'\s<>]+)/g, (_match, name) => {
		const img = images.find((i) => i.filename === name);
		return img ? img.path : _match;
	});
}
