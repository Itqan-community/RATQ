import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_resources_content_language" AS ENUM('ar', 'en');
  CREATE TYPE "public"."enum_resources_title_language" AS ENUM('ar', 'en');
  ALTER TABLE "resources" ADD COLUMN "content_language" "enum_resources_content_language";
  ALTER TABLE "resources" ADD COLUMN "title_language" "enum_resources_title_language";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "resources" DROP COLUMN "content_language";
  ALTER TABLE "resources" DROP COLUMN "title_language";
  DROP TYPE "public"."enum_resources_content_language";
  DROP TYPE "public"."enum_resources_title_language";`)
}
