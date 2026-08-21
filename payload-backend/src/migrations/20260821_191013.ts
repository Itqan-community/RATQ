import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "resources" ADD COLUMN "github_stats_stars" numeric;
  ALTER TABLE "resources" ADD COLUMN "github_stats_forks" numeric;
  ALTER TABLE "resources" ADD COLUMN "github_stats_open_issues" numeric;
  ALTER TABLE "resources" ADD COLUMN "github_stats_last_commit" timestamp(3) with time zone;
  ALTER TABLE "resources" ADD COLUMN "github_commits" jsonb;
  ALTER TABLE "resources" ADD COLUMN "github_topics" jsonb;
  ALTER TABLE "resources" ADD COLUMN "github_stats_fetched_at" timestamp(3) with time zone;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "resources" DROP COLUMN "github_stats_stars";
  ALTER TABLE "resources" DROP COLUMN "github_stats_forks";
  ALTER TABLE "resources" DROP COLUMN "github_stats_open_issues";
  ALTER TABLE "resources" DROP COLUMN "github_stats_last_commit";
  ALTER TABLE "resources" DROP COLUMN "github_commits";
  ALTER TABLE "resources" DROP COLUMN "github_topics";
  ALTER TABLE "resources" DROP COLUMN "github_stats_fetched_at";`)
}
