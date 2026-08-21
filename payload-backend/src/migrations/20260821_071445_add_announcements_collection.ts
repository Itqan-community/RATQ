import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_announcements_type" AS ENUM('release', 'new_resource', 'maintenance', 'breaking_change');
  CREATE TABLE "announcements" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"type" "enum_announcements_type" NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar NOT NULL,
  	"resource_id_id" integer,
  	"cta_url" varchar,
  	"cta_label" varchar,
  	"expires_at" timestamp(3) with time zone,
  	"is_active" boolean DEFAULT true NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "announcements_id" integer;
  ALTER TABLE "announcements" ADD CONSTRAINT "announcements_resource_id_id_resources_id_fk" FOREIGN KEY ("resource_id_id") REFERENCES "public"."resources"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "announcements_resource_id_idx" ON "announcements" USING btree ("resource_id_id");
  CREATE INDEX "announcements_updated_at_idx" ON "announcements" USING btree ("updated_at");
  CREATE INDEX "announcements_created_at_idx" ON "announcements" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_announcements_fk" FOREIGN KEY ("announcements_id") REFERENCES "public"."announcements"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_announcements_id_idx" ON "payload_locked_documents_rels" USING btree ("announcements_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_announcements_fk";
  DROP INDEX "payload_locked_documents_rels_announcements_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "announcements_id";
  ALTER TABLE "announcements" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "announcements" CASCADE;
  DROP TYPE "public"."enum_announcements_type";`)
}
