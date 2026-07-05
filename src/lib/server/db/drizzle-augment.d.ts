/**
 * Module augmentation to add SQLite-compatible `.get()` / `.all()` terminal
 * methods to drizzle-orm's Postgres select query builder.
 *
 * The app was written against libsql/SQLite (which has synchronous `.get()`
 * and `.all()`). At runtime we monkey-patch these onto the postgres-js builder
 * prototype (see ./index.ts `patchBuilder`). This declaration makes TypeScript
 * aware of them so the ~100 existing call sites type-check.
 *
 * `.all()` resolves to the full result array (the row type).
 * `.get()` resolves to the first row or null.
 */
import 'drizzle-orm/pg-core';

declare module 'drizzle-orm/pg-core' {
	interface PgSelectQueryBuilderBase<
		THKT,
		TTableName extends string | undefined,
		TSelection,
		TSelectMode,
		TNullabilityMap,
		TDynamic extends boolean,
		TExcludedMethods extends string,
		TResult extends any[],
		TSelectedFields
	> {
		all(): Promise<TResult>;
		get(): Promise<TResult[number] | null>;
	}
}
