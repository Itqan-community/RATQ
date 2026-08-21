import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "resources" DROP CONSTRAINT "resources_owner_id_users_id_fk";
  
  ALTER TABLE "comments" DROP CONSTRAINT "comments_author_id_users_id_fk";
  
  ALTER TABLE "comments" DROP CONSTRAINT "comments_resource_id_resources_id_fk";
  
  ALTER TABLE "reports" DROP CONSTRAINT "reports_resource_id_resources_id_fk";
  
  ALTER TABLE "reports" DROP CONSTRAINT "reports_reporter_id_users_id_fk";
  
  ALTER TABLE "access_requests" DROP CONSTRAINT "access_requests_resource_id_resources_id_fk";
  
  ALTER TABLE "access_requests" DROP CONSTRAINT "access_requests_applicant_id_users_id_fk";
  
  ALTER TABLE "api_keys" DROP CONSTRAINT "api_keys_resource_id_resources_id_fk";
  
  ALTER TABLE "api_keys" DROP CONSTRAINT "api_keys_owner_id_users_id_fk";
  
  ALTER TABLE "resources" ADD COLUMN "github_stats_stars" numeric;
  ALTER TABLE "resources" ADD COLUMN "github_stats_forks" numeric;
  ALTER TABLE "resources" ADD COLUMN "github_stats_open_issues" numeric;
  ALTER TABLE "resources" ADD COLUMN "github_stats_last_commit" timestamp(3) with time zone;
  ALTER TABLE "resources" ADD COLUMN "github_commits" jsonb;
  ALTER TABLE "resources" ADD COLUMN "github_topics" jsonb;
  ALTER TABLE "resources" ADD COLUMN "github_stats_fetched_at" timestamp(3) with time zone;
  ALTER TABLE "resources" ADD CONSTRAINT "resources_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "comments" ADD CONSTRAINT "comments_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "comments" ADD CONSTRAINT "comments_resource_id_resources_id_fk" FOREIGN KEY ("resource_id") REFERENCES "public"."resources"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "reports" ADD CONSTRAINT "reports_resource_id_resources_id_fk" FOREIGN KEY ("resource_id") REFERENCES "public"."resources"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "reports" ADD CONSTRAINT "reports_reporter_id_users_id_fk" FOREIGN KEY ("reporter_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "access_requests" ADD CONSTRAINT "access_requests_resource_id_resources_id_fk" FOREIGN KEY ("resource_id") REFERENCES "public"."resources"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "access_requests" ADD CONSTRAINT "access_requests_applicant_id_users_id_fk" FOREIGN KEY ("applicant_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "api_keys" ADD CONSTRAINT "api_keys_resource_id_resources_id_fk" FOREIGN KEY ("resource_id") REFERENCES "public"."resources"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "api_keys" ADD CONSTRAINT "api_keys_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "resources" DROP CONSTRAINT "resources_owner_id_users_id_fk";
  
  ALTER TABLE "comments" DROP CONSTRAINT "comments_author_id_users_id_fk";
  
  ALTER TABLE "comments" DROP CONSTRAINT "comments_resource_id_resources_id_fk";
  
  ALTER TABLE "reports" DROP CONSTRAINT "reports_resource_id_resources_id_fk";
  
  ALTER TABLE "reports" DROP CONSTRAINT "reports_reporter_id_users_id_fk";
  
  ALTER TABLE "access_requests" DROP CONSTRAINT "access_requests_resource_id_resources_id_fk";
  
  ALTER TABLE "access_requests" DROP CONSTRAINT "access_requests_applicant_id_users_id_fk";
  
  ALTER TABLE "api_keys" DROP CONSTRAINT "api_keys_resource_id_resources_id_fk";
  
  ALTER TABLE "api_keys" DROP CONSTRAINT "api_keys_owner_id_users_id_fk";
  
  ALTER TABLE "resources" ADD CONSTRAINT "resources_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "comments" ADD CONSTRAINT "comments_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "comments" ADD CONSTRAINT "comments_resource_id_resources_id_fk" FOREIGN KEY ("resource_id") REFERENCES "public"."resources"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "reports" ADD CONSTRAINT "reports_resource_id_resources_id_fk" FOREIGN KEY ("resource_id") REFERENCES "public"."resources"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "reports" ADD CONSTRAINT "reports_reporter_id_users_id_fk" FOREIGN KEY ("reporter_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "access_requests" ADD CONSTRAINT "access_requests_resource_id_resources_id_fk" FOREIGN KEY ("resource_id") REFERENCES "public"."resources"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "access_requests" ADD CONSTRAINT "access_requests_applicant_id_users_id_fk" FOREIGN KEY ("applicant_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "api_keys" ADD CONSTRAINT "api_keys_resource_id_resources_id_fk" FOREIGN KEY ("resource_id") REFERENCES "public"."resources"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "api_keys" ADD CONSTRAINT "api_keys_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "resources" DROP COLUMN "github_stats_stars";
  ALTER TABLE "resources" DROP COLUMN "github_stats_forks";
  ALTER TABLE "resources" DROP COLUMN "github_stats_open_issues";
  ALTER TABLE "resources" DROP COLUMN "github_stats_last_commit";
  ALTER TABLE "resources" DROP COLUMN "github_commits";
  ALTER TABLE "resources" DROP COLUMN "github_topics";
  ALTER TABLE "resources" DROP COLUMN "github_stats_fetched_at";`)
}
