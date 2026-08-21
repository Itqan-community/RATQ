import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_resources_type" AS ENUM('library', 'sdk', 'dataset', 'api', 'tafsir', 'audio', 'pdf', 'json', 'recitation', 'mushaf', 'program', 'linguistic', 'translation', 'font', 'search', 'tajweed');
  CREATE TYPE "public"."enum_resources_status" AS ENUM('draft', 'published', 'archived');
  CREATE TABLE "resources" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"type" "enum_resources_type" NOT NULL,
  	"description" varchar NOT NULL,
  	"short_description" varchar NOT NULL,
  	"documentation_url" varchar,
  	"github_url" varchar,
  	"license" varchar NOT NULL,
  	"itqan_badge" boolean DEFAULT false,
  	"status" "enum_resources_status" DEFAULT 'draft' NOT NULL,
  	"version" varchar,
  	"owner_id" integer NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "resources_id" integer;
  ALTER TABLE "resources" ADD CONSTRAINT "resources_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  CREATE UNIQUE INDEX "resources_slug_idx" ON "resources" USING btree ("slug");
  CREATE INDEX "resources_owner_idx" ON "resources" USING btree ("owner_id");
  CREATE INDEX "resources_updated_at_idx" ON "resources" USING btree ("updated_at");
  CREATE INDEX "resources_created_at_idx" ON "resources" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_resources_fk" FOREIGN KEY ("resources_id") REFERENCES "public"."resources"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_resources_id_idx" ON "payload_locked_documents_rels" USING btree ("resources_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_resources_fk";
  DROP INDEX "payload_locked_documents_rels_resources_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "resources_id";
  ALTER TABLE "resources" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "resources" CASCADE;
  DROP TYPE "public"."enum_resources_type";
  DROP TYPE "public"."enum_resources_status";`)
}
