import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_access_requests_status" AS ENUM('pending', 'approved', 'denied');
  CREATE TABLE "access_requests" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"resource_id" integer NOT NULL,
  	"applicant_id" integer NOT NULL,
  	"status" "enum_access_requests_status" DEFAULT 'pending' NOT NULL,
  	"message" varchar NOT NULL,
  	"publisher_notes" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "access_requests_id" integer;
  ALTER TABLE "access_requests" ADD CONSTRAINT "access_requests_resource_id_resources_id_fk" FOREIGN KEY ("resource_id") REFERENCES "public"."resources"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "access_requests" ADD CONSTRAINT "access_requests_applicant_id_users_id_fk" FOREIGN KEY ("applicant_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "access_requests_resource_idx" ON "access_requests" USING btree ("resource_id");
  CREATE INDEX "access_requests_applicant_idx" ON "access_requests" USING btree ("applicant_id");
  CREATE INDEX "access_requests_updated_at_idx" ON "access_requests" USING btree ("updated_at");
  CREATE INDEX "access_requests_created_at_idx" ON "access_requests" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_access_requests_fk" FOREIGN KEY ("access_requests_id") REFERENCES "public"."access_requests"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_access_requests_id_idx" ON "payload_locked_documents_rels" USING btree ("access_requests_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "access_requests" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "access_requests" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_access_requests_fk";
  
  DROP INDEX "payload_locked_documents_rels_access_requests_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "access_requests_id";
  DROP TYPE "public"."enum_access_requests_status";`)
}
