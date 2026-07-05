//#region src/lib/utils/images.ts
function resolveImages(html, images) {
	return html.replace(/\.\/images\/([^"'\s<>]+)/g, (_match, name) => {
		const img = images.find((i) => i.filename === name);
		return img ? img.path : _match;
	});
}

export { resolveImages as r };
//# sourceMappingURL=images.js-Drv2Xr4-.js.map
