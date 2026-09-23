import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "resources" ADD COLUMN "audio_url" varchar;
  ALTER TABLE "resources" ADD COLUMN "audio_thumbnail" varchar;
  ALTER TABLE "resources" ADD COLUMN "reciter_name" varchar;
  ALTER TABLE "resources" ADD COLUMN "audio_quality" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "resources" DROP COLUMN "audio_url";
  ALTER TABLE "resources" DROP COLUMN "audio_thumbnail";
  ALTER TABLE "resources" DROP COLUMN "reciter_name";
  ALTER TABLE "resources" DROP COLUMN "audio_quality";`)
}
