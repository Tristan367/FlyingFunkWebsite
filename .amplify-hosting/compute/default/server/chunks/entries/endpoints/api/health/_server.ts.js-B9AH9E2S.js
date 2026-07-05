import { j as json } from '../../../../chunks/utils.js-DU29Pc2z.js';
import '../../../../chunks/shared.js-CgP5r6wP.js';

//#region src/routes/api/health/+server.ts
function GET() {
	return json({
		status: "ok",
		env: process.env.DATABASE_URL ? "has-db-url" : "no-db-url"
	});
}

export { GET };
//# sourceMappingURL=_server.ts.js-B9AH9E2S.js.map
