import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "resources" ADD COLUMN "image_id" integer;
  ALTER TABLE "resources" ADD CONSTRAINT "resources_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "resources_image_idx" ON "resources" USING btree ("image_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "resources" DROP CONSTRAINT "resources_image_id_media_id_fk";
  
  DROP INDEX "resources_image_idx";
  ALTER TABLE "resources" DROP COLUMN "image_id";`)
}
