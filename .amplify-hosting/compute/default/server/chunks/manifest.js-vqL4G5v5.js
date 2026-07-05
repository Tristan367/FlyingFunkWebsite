const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["robots.txt","uploads/.gitkeep","uploads/1783118766662-9uksc3-dragon_demo_2.mp3","uploads/1783144799357-0sgqql-dragon_demo_2.mp3","uploads/1783144830134-039mcp-1783072162058-0f1uth-dragon_demo_2.mp3","uploads/m1/1783111269939-eu5l7s-hostname","uploads/m1/1783111269969-yw9esf-img2.jpg","uploads/m1/1783111437204-60ipzy-wolf.jpg","uploads/m1/1783111773086-9knvqe-8407.jpg","uploads/m1/1783112496310-n57ui7-wolf.jpg","uploads/m1/1783112858049-duu08f-wolf.jpg","uploads/m1/1783113068631-h23wpj-wolf.jpg","uploads/m1/1783113375485-07fwpr-ff_color_2048.png","uploads/m1/1783113375501-vo7vwt-hs-2003-13-a-full_jpg.jpg","uploads/m1/1783113375513-fhoquf-uvTest.png","uploads/m1/1783113891531-hhjq3d-wolf.jpg","uploads/m1/1783113911147-bkk4uj-g66.svg","uploads/m1/1783114074745-ijeje5-wolf.jpg","uploads/m1/1783114242763-cgsb1s-wolf.jpg","uploads/m1/1783126116124-bzdukk-wolf.jpg","uploads/m1/1783137981801-khkf7p-wolf.jpg","uploads/m1/1783139305613-wzn6hu-wolf.jpg","uploads/m1/1783139476584-cdios2-wolf.jpg","uploads/m1/1783144778137-xgfs99-wolf.jpg","uploads/m1/1783151065730-t6nx04-wolf.jpg","uploads/m1/1783151080781-4iuixg-wolf.jpg"]),
	mimeTypes: {".txt":"text/plain",".mp3":"audio/mpeg",".jpg":"image/jpeg",".png":"image/png",".svg":"image/svg+xml"},
	_: {
		client: {start:"_app/immutable/entry/start.CvNg2zD-.js",app:"_app/immutable/entry/app.995ApRY5.js",imports:["_app/immutable/entry/start.CvNg2zD-.js","_app/immutable/chunks/CNffLXDY.js","_app/immutable/chunks/Cqs9FcHY.js","_app/immutable/entry/app.995ApRY5.js","_app/immutable/chunks/Cqs9FcHY.js","_app/immutable/chunks/DYl5dUZ5.js","_app/immutable/chunks/xihTtKlq.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			__memo(() => import('./nodes/0.js-_rJ8mM8O.js')),
			__memo(() => import('./nodes/1.js-BgDXlorn.js')),
			__memo(() => import('./nodes/2.js-VUUINYTi.js')),
			__memo(() => import('./nodes/3.js-CGzNNxZ1.js')),
			__memo(() => import('./nodes/4.js-DFe09p-t.js')),
			__memo(() => import('./nodes/5.js-BUIOzX98.js')),
			__memo(() => import('./nodes/6.js-1SJBjP1A.js')),
			__memo(() => import('./nodes/7.js-BgWFuLmm.js')),
			__memo(() => import('./nodes/8.js-D35iW1n9.js')),
			__memo(() => import('./nodes/9.js-DcEKkZYF.js')),
			__memo(() => import('./nodes/10.js-DJktQXyk.js')),
			__memo(() => import('./nodes/11.js-DyyM7g-C.js')),
			__memo(() => import('./nodes/12.js-Cf928VNp.js')),
			__memo(() => import('./nodes/13.js-1eaM-4vL.js')),
			__memo(() => import('./nodes/14.js-BsZ3uxPY.js')),
			__memo(() => import('./nodes/15.js-DQPy75JC.js')),
			__memo(() => import('./nodes/16.js-C2dv7X7r.js')),
			__memo(() => import('./nodes/17.js-BodhvKcn.js')),
			__memo(() => import('./nodes/18.js-D3XaYVlr.js')),
			__memo(() => import('./nodes/19.js-DOVqyY_j.js')),
			__memo(() => import('./nodes/20.js-BG2GjgTD.js')),
			__memo(() => import('./nodes/21.js-CSPz8SzW.js')),
			__memo(() => import('./nodes/22.js-D09_BXBH.js')),
			__memo(() => import('./nodes/23.js-BXBtDwvG.js'))
		],
		remotes: {
			
		},
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 3 },
				endpoint: null
			},
			{
				id: "/admin",
				pattern: /^\/admin\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 5 },
				endpoint: null
			},
			{
				id: "/admin/availability",
				pattern: /^\/admin\/availability\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 6 },
				endpoint: null
			},
			{
				id: "/admin/blog",
				pattern: /^\/admin\/blog\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 7 },
				endpoint: null
			},
			{
				id: "/admin/blog/[id]",
				pattern: /^\/admin\/blog\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,2,], errors: [1,,], leaf: 8 },
				endpoint: null
			},
			{
				id: "/admin/config",
				pattern: /^\/admin\/config\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 9 },
				endpoint: null
			},
			{
				id: "/admin/gigs",
				pattern: /^\/admin\/gigs\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 10 },
				endpoint: null
			},
			{
				id: "/admin/gigs/[id]",
				pattern: /^\/admin\/gigs\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,2,], errors: [1,,], leaf: 11 },
				endpoint: null
			},
			{
				id: "/admin/members",
				pattern: /^\/admin\/members\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 12 },
				endpoint: null
			},
			{
				id: "/admin/notifications",
				pattern: /^\/admin\/notifications\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 13 },
				endpoint: null
			},
			{
				id: "/admin/profile",
				pattern: /^\/admin\/profile\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 14 },
				endpoint: null
			},
			{
				id: "/admin/report",
				pattern: /^\/admin\/report\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 15 },
				endpoint: null
			},
			{
				id: "/admin/songs",
				pattern: /^\/admin\/songs\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 16 },
				endpoint: null
			},
			{
				id: "/api/distances",
				pattern: /^\/api\/distances\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/distances/_server.ts.js-BK4nu8n3.js'))
			},
			{
				id: "/api/health",
				pattern: /^\/api\/health\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/health/_server.ts.js-B9AH9E2S.js'))
			},
			{
				id: "/api/images",
				pattern: /^\/api\/images\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/images/_server.ts.js-DL868Il_.js'))
			},
			{
				id: "/api/songs/play",
				pattern: /^\/api\/songs\/play\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/songs/play/_server.ts.js-1QdIOvig.js'))
			},
			{
				id: "/api/upload",
				pattern: /^\/api\/upload\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/upload/_server.ts.js-BCmYQ7et.js'))
			},
			{
				id: "/blog",
				pattern: /^\/blog\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 17 },
				endpoint: null
			},
			{
				id: "/blog/[slug]",
				pattern: /^\/blog\/([^/]+?)\/?$/,
				params: [{"name":"slug","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,], errors: [1,], leaf: 18 },
				endpoint: null
			},
			{
				id: "/book",
				pattern: /^\/book\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 19 },
				endpoint: null
			},
			{
				id: "/login",
				pattern: /^\/login\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 20 },
				endpoint: null
			},
			{
				id: "/logout",
				pattern: /^\/logout\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 21 },
				endpoint: null
			},
			{
				id: "/songs",
				pattern: /^\/songs\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 22 },
				endpoint: null
			},
			{
				id: "/theme",
				pattern: /^\/theme\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 23 },
				endpoint: null
			},
			{
				id: "/[slug]",
				pattern: /^\/([^/]+?)\/?$/,
				params: [{"name":"slug","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,], errors: [1,], leaf: 4 },
				endpoint: null
			}
		],
		prerendered_routes: new Set([]),
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();

export { manifest as m };
//# sourceMappingURL=manifest.js-vqL4G5v5.js.map
