import type { Member } from '$lib/server/auth';

declare global {
	namespace App {
		interface Locals {
			user: Member | null;
			session: import('$lib/server/auth').Session | null;
		}
	}
}

export {};
