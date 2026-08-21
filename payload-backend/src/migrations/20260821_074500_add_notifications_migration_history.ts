import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// The `notifications` collection has existed in payload.config.ts and in
// production since before this repo's migration history started being
// tracked consistently - its table was created out-of-band and never got a
// committed migration. This retroactively records that schema so a fresh
// environment built from migrations alone (disaster recovery, a new
// deploy target, a reset local DB) actually gets a working notifications
// table instead of 500ing the first time the collection is queried.
//
// The whole notifications table/type/FK/index block is gated behind a
// single "does this table already exist" check, rather than per-statement
// IF NOT EXISTS/duplicate-object guards - production's actual column,
// constraint, and orphan-row shape was never directly verified (only
// inferred from an auto-generated diff), so this migration must not touch
// anything on a table that already exists at all, not just skip
// individually-colliding statements. Per-statement ADD CONSTRAINT against
// live data with unknown orphan rows can raise foreign_key_violation,
// which is not caught by a duplicate-object guard and would abort the
// migration - and since `payload migrate` runs before `next start` on
// deploy, a migration failure is a full backend outage, not a soft error.
//
// recipient_id is NOT NULL (Notifications.ts sets recipient as required),
// so its FK uses ON DELETE cascade, not set null - matching the exact
// pattern 20260731_000000_cascade_required_relationships.ts fixed for
// every other required relationship column in this schema.
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'notifications'
      ) THEN
        CREATE TYPE "public"."enum_notifications_type" AS ENUM('access_approved', 'access_denied', 'comment_reply', 'report_resolved', 'report_status_change', 'resource_activity', 'access_revoked');

        CREATE TABLE "notifications" (
          "id" serial PRIMARY KEY NOT NULL,
          "recipient_id" integer NOT NULL,
          "type" "enum_notifications_type" NOT NULL,
          "message" varchar NOT NULL,
          "resource_id" integer,
          "resource_name" varchar,
          "related_access_request_id" integer,
          "related_report_id" integer,
          "related_comment_id" integer,
          "read" boolean DEFAULT false,
          "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
          "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
        );

        ALTER TABLE "notifications" ADD CONSTRAINT "notifications_recipient_id_users_id_fk" FOREIGN KEY ("recipient_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
        ALTER TABLE "notifications" ADD CONSTRAINT "notifications_resource_id_resources_id_fk" FOREIGN KEY ("resource_id") REFERENCES "public"."resources"("id") ON DELETE set null ON UPDATE no action;
        ALTER TABLE "notifications" ADD CONSTRAINT "notifications_related_access_request_id_access_requests_id_fk" FOREIGN KEY ("related_access_request_id") REFERENCES "public"."access_requests"("id") ON DELETE set null ON UPDATE no action;
        ALTER TABLE "notifications" ADD CONSTRAINT "notifications_related_report_id_reports_id_fk" FOREIGN KEY ("related_report_id") REFERENCES "public"."reports"("id") ON DELETE set null ON UPDATE no action;
        ALTER TABLE "notifications" ADD CONSTRAINT "notifications_related_comment_id_comments_id_fk" FOREIGN KEY ("related_comment_id") REFERENCES "public"."comments"("id") ON DELETE set null ON UPDATE no action;

        CREATE INDEX "notifications_recipient_idx" ON "notifications" USING btree ("recipient_id");
        CREATE INDEX "notifications_resource_idx" ON "notifications" USING btree ("resource_id");
        CREATE INDEX "notifications_related_access_request_idx" ON "notifications" USING btree ("related_access_request_id");
        CREATE INDEX "notifications_related_report_idx" ON "notifications" USING btree ("related_report_id");
        CREATE INDEX "notifications_related_comment_idx" ON "notifications" USING btree ("related_comment_id");
        CREATE INDEX "notifications_updated_at_idx" ON "notifications" USING btree ("updated_at");
        CREATE INDEX "notifications_created_at_idx" ON "notifications" USING btree ("created_at");
      END IF;
    END $$;

    -- Kept outside the table-existence guard: a hand-created notifications
    -- table might predate the payload_locked_documents_rels linkage that
    -- Payload's admin document-locking feature needs, so this must attach
    -- regardless of whether the table above was just created or already existed.
    ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "notifications_id" integer;

    DO $$ BEGIN
      ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_notifications_fk" FOREIGN KEY ("notifications_id") REFERENCES "public"."notifications"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;

    CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_notifications_id_idx" ON "payload_locked_documents_rels" USING btree ("notifications_id");
  `)
}

// Intentionally a no-op, not a real rollback. up() is a no-op against
// production (the table already existed before this migration was
// written), so the symmetric down() must not destroy live notification
// data - an unconditional DROP TABLE here would mean a single
// `payload migrate:down` deletes every real user's notifications.
// A fresh environment that wants to fully tear down its own schema can
// still do so manually; this migration's job is only to make a fresh
// bootstrap possible, not to make production's data reversible.
export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  // No-op by design - see comment above.
}
