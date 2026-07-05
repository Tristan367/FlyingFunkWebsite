import './shared.js-CgP5r6wP.js';
import './exports.js-Bq66Su2C.js';
import { n as noop } from './server.js-D7jMOqOz.js';
import './internal2.js-DHGs7jvM.js';
import { i as index_server_exports } from './index-server.js-dMC7ajjs.js';
import './utils.js-DU29Pc2z.js';

var is_legacy = noop.toString().includes("$$") || /function \w+\(\) \{\}/.test(noop.toString());
var placeholder_url = "a:";
if (is_legacy) {
	({
		data: {},
		form: null,
		error: null,
		params: {},
		route: { id: null },
		state: {},
		status: -1,
		url: new URL(placeholder_url)
	});
}
//#endregion
//#region node_modules/@sveltejs/kit/src/runtime/client/client.js
/** @import { RemoteFunctionDataNode, ServerNodesResponse, ServerRedirectNode } from 'types' */
/** @import { CacheEntry } from './remote-functions/cache.svelte.js' */
/** @import { Query } from './remote-functions/query/instance.svelte.js' */
/** @import { LiveQuery } from './remote-functions/query-live/instance.svelte.js' */
var { onMount, tick } = index_server_exports;
//# sourceMappingURL=client.js-q5RwB46e.js.map
