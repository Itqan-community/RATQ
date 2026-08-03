import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_reports_reason" AS ENUM('inaccurate', 'inappropriate', 'infringing', 'spam', 'outdated', 'broken-link');
  CREATE TYPE "public"."enum_reports_status" AS ENUM('open', 'resolved', 'closed');
  CREATE TABLE "reports" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"resource_id" integer NOT NULL,
  	"reporter_id" integer NOT NULL,
  	"reason" "enum_reports_reason" NOT NULL,
  	"details" varchar,
  	"status" "enum_reports_status" DEFAULT 'open' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "reports_id" integer;
  ALTER TABLE "reports" ADD CONSTRAINT "reports_resource_id_resources_id_fk" FOREIGN KEY ("resource_id") REFERENCES "public"."resources"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "reports" ADD CONSTRAINT "reports_reporter_id_users_id_fk" FOREIGN KEY ("reporter_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "reports_resource_idx" ON "reports" USING btree ("resource_id");
  CREATE INDEX "reports_reporter_idx" ON "reports" USING btree ("reporter_id");
  CREATE INDEX "reports_updated_at_idx" ON "reports" USING btree ("updated_at");
  CREATE INDEX "reports_created_at_idx" ON "reports" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_reports_fk" FOREIGN KEY ("reports_id") REFERENCES "public"."reports"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_reports_id_idx" ON "payload_locked_documents_rels" USING btree ("reports_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "reports" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "reports" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_reports_fk";
  
  DROP INDEX "payload_locked_documents_rels_reports_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "reports_id";
  DROP TYPE "public"."enum_reports_reason";
  DROP TYPE "public"."enum_reports_status";`)
}
