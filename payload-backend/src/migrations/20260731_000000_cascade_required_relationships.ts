import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// All required (NOT NULL) relationship columns default to `ON DELETE set null`
// (Payload's Postgres adapter always generates that, with no per-field way to
// override it in collection config), which violates the NOT NULL constraint
// and 500s the moment the referenced row is deleted. Switching these to
// `ON DELETE cascade` is the correct semantics here: a comment/report/access
// request/API key with no resource, or a resource with no owner, doesn't mean
// anything on its own. Confirmed via `payload migrate:create` before and
// after this change that Payload's schema diffing does not track a FK's
// ON DELETE action, so this doesn't create drift for the next migration.
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "resources" DROP CONSTRAINT "resources_owner_id_users_id_fk";
  ALTER TABLE "resources" ADD CONSTRAINT "resources_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;

  ALTER TABLE "comments" DROP CONSTRAINT "comments_author_id_users_id_fk";
  ALTER TABLE "comments" ADD CONSTRAINT "comments_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "comments" DROP CONSTRAINT "comments_resource_id_resources_id_fk";
  ALTER TABLE "comments" ADD CONSTRAINT "comments_resource_id_resources_id_fk" FOREIGN KEY ("resource_id") REFERENCES "public"."resources"("id") ON DELETE cascade ON UPDATE no action;

  ALTER TABLE "reports" DROP CONSTRAINT "reports_resource_id_resources_id_fk";
  ALTER TABLE "reports" ADD CONSTRAINT "reports_resource_id_resources_id_fk" FOREIGN KEY ("resource_id") REFERENCES "public"."resources"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "reports" DROP CONSTRAINT "reports_reporter_id_users_id_fk";
  ALTER TABLE "reports" ADD CONSTRAINT "reports_reporter_id_users_id_fk" FOREIGN KEY ("reporter_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;

  ALTER TABLE "access_requests" DROP CONSTRAINT "access_requests_resource_id_resources_id_fk";
  ALTER TABLE "access_requests" ADD CONSTRAINT "access_requests_resource_id_resources_id_fk" FOREIGN KEY ("resource_id") REFERENCES "public"."resources"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "access_requests" DROP CONSTRAINT "access_requests_applicant_id_users_id_fk";
  ALTER TABLE "access_requests" ADD CONSTRAINT "access_requests_applicant_id_users_id_fk" FOREIGN KEY ("applicant_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;

  ALTER TABLE "api_keys" DROP CONSTRAINT "api_keys_resource_id_resources_id_fk";
  ALTER TABLE "api_keys" ADD CONSTRAINT "api_keys_resource_id_resources_id_fk" FOREIGN KEY ("resource_id") REFERENCES "public"."resources"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "api_keys" DROP CONSTRAINT "api_keys_owner_id_users_id_fk";
  ALTER TABLE "api_keys" ADD CONSTRAINT "api_keys_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "resources" DROP CONSTRAINT "resources_owner_id_users_id_fk";
  ALTER TABLE "resources" ADD CONSTRAINT "resources_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;

  ALTER TABLE "comments" DROP CONSTRAINT "comments_author_id_users_id_fk";
  ALTER TABLE "comments" ADD CONSTRAINT "comments_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "comments" DROP CONSTRAINT "comments_resource_id_resources_id_fk";
  ALTER TABLE "comments" ADD CONSTRAINT "comments_resource_id_resources_id_fk" FOREIGN KEY ("resource_id") REFERENCES "public"."resources"("id") ON DELETE set null ON UPDATE no action;

  ALTER TABLE "reports" DROP CONSTRAINT "reports_resource_id_resources_id_fk";
  ALTER TABLE "reports" ADD CONSTRAINT "reports_resource_id_resources_id_fk" FOREIGN KEY ("resource_id") REFERENCES "public"."resources"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "reports" DROP CONSTRAINT "reports_reporter_id_users_id_fk";
  ALTER TABLE "reports" ADD CONSTRAINT "reports_reporter_id_users_id_fk" FOREIGN KEY ("reporter_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;

  ALTER TABLE "access_requests" DROP CONSTRAINT "access_requests_resource_id_resources_id_fk";
  ALTER TABLE "access_requests" ADD CONSTRAINT "access_requests_resource_id_resources_id_fk" FOREIGN KEY ("resource_id") REFERENCES "public"."resources"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "access_requests" DROP CONSTRAINT "access_requests_applicant_id_users_id_fk";
  ALTER TABLE "access_requests" ADD CONSTRAINT "access_requests_applicant_id_users_id_fk" FOREIGN KEY ("applicant_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;

  ALTER TABLE "api_keys" DROP CONSTRAINT "api_keys_resource_id_resources_id_fk";
  ALTER TABLE "api_keys" ADD CONSTRAINT "api_keys_resource_id_resources_id_fk" FOREIGN KEY ("resource_id") REFERENCES "public"."resources"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "api_keys" DROP CONSTRAINT "api_keys_owner_id_users_id_fk";
  ALTER TABLE "api_keys" ADD CONSTRAINT "api_keys_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;`)
}
