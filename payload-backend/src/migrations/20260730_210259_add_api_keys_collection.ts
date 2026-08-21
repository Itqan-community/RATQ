import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_api_keys_scope" AS ENUM('read', 'read,write');
  CREATE TABLE "api_keys" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"resource_id" integer NOT NULL,
  	"owner_id" integer NOT NULL,
  	"key_prefix" varchar,
  	"key_hash" varchar,
  	"scope" "enum_api_keys_scope" DEFAULT 'read' NOT NULL,
  	"last_used_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "api_keys_id" integer;
  ALTER TABLE "api_keys" ADD CONSTRAINT "api_keys_resource_id_resources_id_fk" FOREIGN KEY ("resource_id") REFERENCES "public"."resources"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "api_keys" ADD CONSTRAINT "api_keys_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "api_keys_resource_idx" ON "api_keys" USING btree ("resource_id");
  CREATE INDEX "api_keys_owner_idx" ON "api_keys" USING btree ("owner_id");
  CREATE INDEX "api_keys_updated_at_idx" ON "api_keys" USING btree ("updated_at");
  CREATE INDEX "api_keys_created_at_idx" ON "api_keys" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_api_keys_fk" FOREIGN KEY ("api_keys_id") REFERENCES "public"."api_keys"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_api_keys_id_idx" ON "payload_locked_documents_rels" USING btree ("api_keys_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_api_keys_fk";
  DROP INDEX "payload_locked_documents_rels_api_keys_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "api_keys_id";
  ALTER TABLE "api_keys" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "api_keys" CASCADE;
  DROP TYPE "public"."enum_api_keys_scope";`)
}
