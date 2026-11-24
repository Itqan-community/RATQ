import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_resources_has_api" AS ENUM('yes', 'no', 'planned', 'iframe');
  ALTER TABLE "resources" ALTER COLUMN "license" DROP NOT NULL;
  ALTER TABLE "users" ADD COLUMN "system_account" boolean DEFAULT false;
  ALTER TABLE "resources" ADD COLUMN "sheet_id" varchar;
  ALTER TABLE "resources" ADD COLUMN "name_en" varchar;
  ALTER TABLE "resources" ADD COLUMN "description_en" varchar;
  ALTER TABLE "resources" ADD COLUMN "content_domain" varchar;
  ALTER TABLE "resources" ADD COLUMN "riwayah" varchar;
  ALTER TABLE "resources" ADD COLUMN "smallest_unit" varchar;
  ALTER TABLE "resources" ADD COLUMN "query_units" varchar;
  ALTER TABLE "resources" ADD COLUMN "numbering_reference" varchar;
  ALTER TABLE "resources" ADD COLUMN "authentication" varchar;
  ALTER TABLE "resources" ADD COLUMN "rate_limits" varchar;
  ALTER TABLE "resources" ADD COLUMN "attribution" varchar;
  ALTER TABLE "resources" ADD COLUMN "scholarly_review" varchar;
  ALTER TABLE "resources" ADD COLUMN "content_domain_en" varchar;
  ALTER TABLE "resources" ADD COLUMN "riwayah_en" varchar;
  ALTER TABLE "resources" ADD COLUMN "smallest_unit_en" varchar;
  ALTER TABLE "resources" ADD COLUMN "query_units_en" varchar;
  ALTER TABLE "resources" ADD COLUMN "numbering_reference_en" varchar;
  ALTER TABLE "resources" ADD COLUMN "authentication_en" varchar;
  ALTER TABLE "resources" ADD COLUMN "rate_limits_en" varchar;
  ALTER TABLE "resources" ADD COLUMN "attribution_en" varchar;
  ALTER TABLE "resources" ADD COLUMN "scholarly_review_en" varchar;
  ALTER TABLE "resources" ADD COLUMN "short_description_en" varchar;
  ALTER TABLE "resources" ADD COLUMN "license_en" varchar;
  ALTER TABLE "resources" ADD COLUMN "sample_request" varchar;
  ALTER TABLE "resources" ADD COLUMN "source_status" varchar;
  ALTER TABLE "resources" ADD COLUMN "source_type" varchar;
  ALTER TABLE "resources" ADD COLUMN "source_last_updated" varchar;
  ALTER TABLE "resources" ADD COLUMN "verified_on" varchar;
  ALTER TABLE "resources" ADD COLUMN "base_url" varchar;
  ALTER TABLE "resources" ADD COLUMN "api_key_url" varchar;
  ALTER TABLE "resources" ADD COLUMN "playground_url" varchar;
  ALTER TABLE "resources" ADD COLUMN "download_url" varchar;
  ALTER TABLE "resources" ADD COLUMN "repository" varchar;
  ALTER TABLE "resources" ADD COLUMN "languages" jsonb;
  ALTER TABLE "resources" ADD COLUMN "tags" jsonb;
  ALTER TABLE "resources" ADD COLUMN "data_formats" jsonb;
  ALTER TABLE "resources" ADD COLUMN "has_api" "enum_resources_has_api";
  CREATE UNIQUE INDEX "resources_sheet_id_idx" ON "resources" USING btree ("sheet_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP INDEX "resources_sheet_id_idx";
  UPDATE "resources" SET "license" = '' WHERE "license" IS NULL;
  ALTER TABLE "resources" ALTER COLUMN "license" SET NOT NULL;
  ALTER TABLE "users" DROP COLUMN "system_account";
  ALTER TABLE "resources" DROP COLUMN "sheet_id";
  ALTER TABLE "resources" DROP COLUMN "name_en";
  ALTER TABLE "resources" DROP COLUMN "description_en";
  ALTER TABLE "resources" DROP COLUMN "content_domain";
  ALTER TABLE "resources" DROP COLUMN "riwayah";
  ALTER TABLE "resources" DROP COLUMN "smallest_unit";
  ALTER TABLE "resources" DROP COLUMN "query_units";
  ALTER TABLE "resources" DROP COLUMN "numbering_reference";
  ALTER TABLE "resources" DROP COLUMN "authentication";
  ALTER TABLE "resources" DROP COLUMN "rate_limits";
  ALTER TABLE "resources" DROP COLUMN "attribution";
  ALTER TABLE "resources" DROP COLUMN "scholarly_review";
  ALTER TABLE "resources" DROP COLUMN "content_domain_en";
  ALTER TABLE "resources" DROP COLUMN "riwayah_en";
  ALTER TABLE "resources" DROP COLUMN "smallest_unit_en";
  ALTER TABLE "resources" DROP COLUMN "query_units_en";
  ALTER TABLE "resources" DROP COLUMN "numbering_reference_en";
  ALTER TABLE "resources" DROP COLUMN "authentication_en";
  ALTER TABLE "resources" DROP COLUMN "rate_limits_en";
  ALTER TABLE "resources" DROP COLUMN "attribution_en";
  ALTER TABLE "resources" DROP COLUMN "scholarly_review_en";
  ALTER TABLE "resources" DROP COLUMN "short_description_en";
  ALTER TABLE "resources" DROP COLUMN "license_en";
  ALTER TABLE "resources" DROP COLUMN "sample_request";
  ALTER TABLE "resources" DROP COLUMN "source_status";
  ALTER TABLE "resources" DROP COLUMN "source_type";
  ALTER TABLE "resources" DROP COLUMN "source_last_updated";
  ALTER TABLE "resources" DROP COLUMN "verified_on";
  ALTER TABLE "resources" DROP COLUMN "base_url";
  ALTER TABLE "resources" DROP COLUMN "api_key_url";
  ALTER TABLE "resources" DROP COLUMN "playground_url";
  ALTER TABLE "resources" DROP COLUMN "download_url";
  ALTER TABLE "resources" DROP COLUMN "repository";
  ALTER TABLE "resources" DROP COLUMN "languages";
  ALTER TABLE "resources" DROP COLUMN "tags";
  ALTER TABLE "resources" DROP COLUMN "data_formats";
  ALTER TABLE "resources" DROP COLUMN "has_api";
  DROP TYPE "public"."enum_resources_has_api";`)
}
