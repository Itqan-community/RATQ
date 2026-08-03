import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "comments" ADD COLUMN "author_name" varchar;
  UPDATE "comments" c SET "author_name" = COALESCE(NULLIF(u."display_name", ''), split_part(u."email", '@', 1))
  FROM "users" u WHERE u."id" = c."author_id";
  ALTER TABLE "comments" ALTER COLUMN "author_name" SET NOT NULL;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "comments" DROP COLUMN "author_name";`)
}
