//#region src/lib/utils/dates.ts
function ymd(d) {
	return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
function rangeEnd() {
	return new Date((/* @__PURE__ */ new Date()).getFullYear() + 1, 11, 31);
}
function rangeEndStr() {
	return ymd(rangeEnd());
}

export { rangeEndStr as a, rangeEnd as r, ymd as y };
//# sourceMappingURL=dates.js-WhQLpw1q.js.map
